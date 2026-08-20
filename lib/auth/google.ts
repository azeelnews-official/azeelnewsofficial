interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}

function getRedirectUri(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  return `${base.replace(/\/+$/, "")}/api/auth/google/callback`;
}

export function normalizeEmail(
  email: string
): string {
  return email.trim().toLowerCase();
}

export function buildGoogleAuthUrl(
  state: string
): string {
  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      "GOOGLE_CLIENT_ID is not set."
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(
  code: string
): Promise<GoogleTokenResponse> {
  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Google OAuth environment variables are not set."
    );
  }

  const res = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getRedirectUri(),
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `Google token exchange failed: ${res.status}`
    );
  }

  return res.json();
}

export async function fetchGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `Google userinfo fetch failed: ${res.status}`
    );
  }

  return res.json();
}
