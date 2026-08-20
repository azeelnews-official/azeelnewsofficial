import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "@prisma/client";

export interface SessionPayload {
  sub: string;
  email: string;
  role: Role;
}

const JWT_ISSUER =
  process.env.JWT_ISSUER ?? "https://www.azeelnews.in";

const JWT_AUDIENCE =
  process.env.JWT_AUDIENCE ?? "azeel-news";

const SESSION_EXPIRY = "7d";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Configure a strong production secret."
    );
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

function isRole(value: unknown): value is Role {
  return (
    value === "READER" ||
    value === "JOURNALIST" ||
    value === "EDITOR" ||
    value === "ADMIN"
  );
}

function isSessionPayload(
  payload: JWTPayload
): payload is JWTPayload & SessionPayload {
  return (
    typeof payload.sub === "string" &&
    typeof payload.email === "string" &&
    isRole(payload.role)
  );
}

export async function signSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey(),
      {
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );

    if (!isSessionPayload(payload)) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
