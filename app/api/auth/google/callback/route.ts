import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  normalizeEmail,
} from "@/lib/auth/google";
import { signSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failureRedirect(siteUrl: string) {
  const response = NextResponse.redirect(
    `${siteUrl}/login?error=google_oauth_failed`
  );

  response.cookies.set(
    "google_oauth_state",
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();

  const cookieState =
    cookieStore.get("google_oauth_state")
      ?.value;

  if (
    !code ||
    !state ||
    !cookieState ||
    state !== cookieState
  ) {
    return failureRedirect(siteUrl);
  }

  try {
    const tokens =
      await exchangeGoogleCode(code);

    const profile =
      await fetchGoogleUserInfo(
        tokens.access_token
      );

    if (
      !profile.sub ||
      !profile.email ||
      !profile.email_verified
    ) {
      return failureRedirect(siteUrl);
    }

    const email = normalizeEmail(
      profile.email
    );

    if (!email) {
      return failureRedirect(siteUrl);
    }

    const user =
      await prisma.user.upsert({
        where: {
          email,
        },
        update: {
          image: profile.picture || undefined,
          emailVerified:
            profile.email_verified
              ? new Date()
              : undefined,
        },
        create: {
          name:
            profile.name?.trim() ||
            email.split("@")[0] ||
            "Azeel News Reader",
          email,
          image:
            profile.picture || undefined,
          emailVerified:
            profile.email_verified
              ? new Date()
              : null,
        },
      });

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: profile.sub,
        },
      },
      update: {
        userId: user.id,
      },
      create: {
        provider: "google",
        providerAccountId: profile.sub,
        userId: user.id,
      },
    });

    const token =
      await signSessionToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

    await setSessionCookie(token);

    const response =
      NextResponse.redirect(siteUrl);

    response.cookies.set(
      "google_oauth_state",
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Google OAuth callback failed:",
      error instanceof Error
        ? error.message
        : error
    );

    return failureRedirect(siteUrl);
  }
}
