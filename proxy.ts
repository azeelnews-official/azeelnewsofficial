import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const EDITORIAL_ROLES = new Set(["JOURNALIST", "EDITOR", "ADMIN"]);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("azeel_session")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set.");

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = typeof payload.role === "string" ? payload.role : "";

    if (!EDITORIAL_ROLES.has(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
