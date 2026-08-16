import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { sendPasswordResetEmail } from "@/lib/email";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit(`forgot-password:${ip}`, 5, 60 * 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success regardless of whether the account exists, so the
  // response can't be used to enumerate registered emails.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);
  }

  return NextResponse.json({ ok: true });
}
