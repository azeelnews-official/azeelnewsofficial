import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { sendNewsletterEmail } from "@/lib/email";
import { newsletterSubscribers } from "@/lib/mock-data";

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session || !["EDITOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { subject, body } = (await req.json()) as { subject?: string; body?: string };
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and body are required." }, { status: 400 });
  }

  const active = newsletterSubscribers.filter((s) => s.status === "active");
  const bodyHtml = body
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

  await Promise.all(active.map((sub) => sendNewsletterEmail(sub.email, subject, bodyHtml)));

  return NextResponse.json({ ok: true, sentTo: active.length });
}
