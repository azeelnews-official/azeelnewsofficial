import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";
import { rateLimit } from "@/lib/redis";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const GENERIC_ERROR = "Incorrect email or password.";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };

  if (!email || !EMAIL_RE.test(email) || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit(`login:${ip}:${email}`, 8, 15 * 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Compare against a dummy hash when the user doesn't exist so response
  // timing doesn't reveal whether the email is registered.
  const hashToCheck = user?.passwordHash ?? "$2a$12$invalidsaltinvalidsaltinvalidsal.tuVeuVeuVeuVeuVeuVeuVe";
  const validPassword = user?.passwordHash ? await verifyPassword(password, hashToCheck) : false;

  if (!user || !user.passwordHash || !validPassword) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const token = await signSessionToken({ sub: user.id, email: user.email, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
