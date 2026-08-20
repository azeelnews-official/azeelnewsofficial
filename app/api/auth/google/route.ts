import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/auth/google";

export async function GET() {
  const state = crypto
    .randomBytes(32)
    .toString("hex");

  const response = NextResponse.redirect(
    buildGoogleAuthUrl(state)
  );

  response.cookies.set(
    "google_oauth_state",
    state,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    }
  );

  return response;
}
