import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  isPasswordStrongEnough,
} from "@/lib/auth/password";
import { rateLimit } from "@/lib/redis";

function hashResetToken(
  token: string
): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(req: Request) {
  const {
    token: rawToken,
    password,
  } = (await req.json()) as {
    token?: string;
    password?: string;
  };

  const token = rawToken?.trim() ?? "";

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Missing reset token.",
      },
      { status: 400 }
    );
  }

  if (
    !password ||
    !isPasswordStrongEnough(password)
  ) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters.",
      },
      { status: 400 }
    );
  }

  const tokenHash =
    hashResetToken(token);

  const forwarded =
    req.headers.get("x-forwarded-for");

  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } =
    await rateLimit(
      `reset-password:${ip}:${tokenHash.slice(0, 16)}`,
      5,
      15 * 60
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

  const resetToken =
    await prisma.passwordResetToken.findUnique({
      where: {
        token: tokenHash,
      },
    });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt < new Date()
  ) {
    return NextResponse.json(
      {
        error:
          "This reset link is invalid or has expired.",
      },
      { status: 400 }
    );
  }

  const passwordHash =
    await hashPassword(password);

  const now = new Date();

  try {
    await prisma.$transaction(
      async (tx) => {
        const user =
          await tx.user.findUnique({
            where: {
              email: resetToken.email,
            },
            select: {
              id: true,
            },
          });

        if (!user) {
          throw new Error(
            "RESET_USER_NOT_FOUND"
          );
        }

        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordHash,
          },
        });

        await tx.passwordResetToken.update({
          where: {
            id: resetToken.id,
          },
          data: {
            usedAt: now,
          },
        });

        /*
         * Invalidate every other reset token belonging
         * to the same account.
         */
        await tx.passwordResetToken.deleteMany({
          where: {
            email: resetToken.email,
            id: {
              not: resetToken.id,
            },
          },
        });
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "RESET_USER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error:
            "This reset link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    throw error;
  }

  return NextResponse.json({
    ok: true,
  });
}
