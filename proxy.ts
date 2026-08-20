import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const EDITORIAL_ROLES = new Set([
  "JOURNALIST",
  "EDITOR",
  "ADMIN",
]);

const JWT_ISSUER =
  process.env.JWT_ISSUER ?? "https://www.azeelnews.in";

const JWT_AUDIENCE =
  process.env.JWT_AUDIENCE ?? "azeel-news";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }

  if (
    process.env.NODE_ENV === "production" &&
    secret.length < 32
  ) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const token =
    req.cookies.get("azeel_session")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const { payload } = await jwtVerify(
      token,
      getSecret(),
      {
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );

    const role =
      typeof payload.role === "string"
        ? payload.role
        : "";

    if (!EDITORIAL_ROLES.has(role)) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
  } catch {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);

  loginUrl.searchParams.set(
    "next",
    req.nextUrl.pathname
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
