import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeGoogleCode, fetchGoogleUserInfo } from "@/lib/auth/google";
import { signSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("google_oauth_state="))
    ?.split("=")[1];

  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(`${siteUrl}/login?error=google_oauth_failed`);
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    const profile = await fetchGoogleUserInfo(tokens.access_token);

    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: { image: profile.picture },
      create: {
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        emailVerified: profile.email_verified ? new Date() : null,
      },
    });

    await prisma.account.upsert({
      where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
      update: {},
      create: { provider: "google", providerAccountId: profile.sub, userId: user.id },
    });

    const token = await signSessionToken({ sub: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    return NextResponse.redirect(siteUrl);
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return NextResponse.redirect(`${siteUrl}/login?error=google_oauth_failed`);
  }
}
