import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { sendPasswordResetEmail } from "@/lib/email";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function hashResetToken(
  token: string
): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(req: Request) {
  const { email: rawEmail } =
    (await req.json()) as {
      email?: string;
    };

  const email =
    rawEmail?.trim().toLowerCase() ?? "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      {
        error:
          "Enter a valid email address.",
      },
      { status: 400 }
    );
  }

  const forwarded =
    req.headers.get("x-forwarded-for");

  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } =
    await rateLimit(
      `forgot-password:${ip}`,
      5,
      60 * 60
    );

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Too many attempts. Try again later.",
      },
      { status: 429 }
    );
  }

  const user =
    await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

  /*
   * Always return success regardless of whether
   * the account exists to prevent email enumeration.
   */
  if (!user) {
    return NextResponse.json({
      ok: true,
    });
  }

  /*
   * Remove previous unused reset tokens for this
   * account before issuing a fresh one.
   */
  await prisma.passwordResetToken.deleteMany({
    where: {
      email,
      OR: [
        { usedAt: { not: null } },
        {
          expiresAt: {
            lt: new Date(),
          },
        },
      ],
    },
  });

  const rawToken =
    crypto.randomBytes(32).toString("hex");

  const tokenHash =
    hashResetToken(rawToken);

  await prisma.passwordResetToken.create({
    data: {
      email,
      token: tokenHash,
      expiresAt: new Date(
        Date.now() + 60 * 60 * 1000
      ),
    },
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const resetUrl =
    `${siteUrl.replace(/\/+$/, "")}` +
    `/reset-password?token=${encodeURIComponent(rawToken)}`;

  await sendPasswordResetEmail(
    email,
    resetUrl
  );

  return NextResponse.json({
    ok: true,
  });
}
