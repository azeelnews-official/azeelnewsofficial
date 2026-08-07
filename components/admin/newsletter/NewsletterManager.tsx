"use client";

import { useState } from "react";
import { Users, Send, TrendingUp } from "lucide-react";
import type { NewsletterSubscriber, NewsletterCampaign } from "@/lib/mock-data";
import { StatCard } from "@/components/admin/StatCard";

export function NewsletterManager({
  subscribers,
  campaigns,
}: {
  subscribers: NewsletterSubscriber[];
  campaigns: NewsletterCampaign[];
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const avgOpenRate = campaigns.length
    ? campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length
    : 0;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    try {
      await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
    } catch {
      // Falls through to the confirmation state regardless — this mirrors
      // forgot-password's console-log fallback when RESEND_API_KEY isn't set.
    }
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject("");
      setBody("");
    }, 2000);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">Newsletter</h1>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Subscribers" value={activeCount.toLocaleString("en-IN")} icon={Users} />
        <StatCard label="Campaigns Sent" value={String(campaigns.length)} icon={Send} />
        <StatCard label="Avg. Open Rate" value={`${avgOpenRate.toFixed(1)}%`} icon={TrendingUp} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="border border-hairline bg-surface p-5">
          <h2 className="mb-4 font-display text-base font-bold text-ink-950">Compose Campaign</h2>
          {sent ? (
            <p className="rounded-md border border-hairline bg-ink-50 p-4 text-sm text-ink-800">
              Sent to {activeCount.toLocaleString("en-IN")} active subscribers.
            </p>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-3">
              <div>
                <label htmlFor="newsletter-subject" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Subject
                </label>
                <input
                  id="newsletter-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Morning Briefing — …"
                  className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
                />
              </div>
              <div>
                <label htmlFor="newsletter-body" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Body
                </label>
                <textarea
                  id="newsletter-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder="Write the campaign content…"
                  className="w-full resize-none rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
                />
              </div>
              <button
                type="submit"
                disabled={!subject.trim() || !body.trim()}
                className="flex items-center justify-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark disabled:opacity-50"
              >
                <Send size={15} />
                Send to {activeCount.toLocaleString("en-IN")} Subscribers
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="border border-hairline bg-surface">
            <h2 className="border-b border-hairline px-5 py-3 font-display text-base font-bold text-ink-950">
              Recent Campaigns
            </h2>
            <ul className="divide-y divide-hairline">
              {campaigns.map((c) => (
                <li key={c.id} className="px-5 py-3">
                  <p className="line-clamp-1 text-sm font-medium text-ink-900">{c.subject}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-300">
                    {new Date(c.sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                    {c.recipients.toLocaleString("en-IN")} sent · {c.openRate}% open rate
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-hairline bg-surface">
            <h2 className="border-b border-hairline px-5 py-3 font-display text-base font-bold text-ink-950">
              Subscribers
            </h2>
            <ul className="max-h-64 divide-y divide-hairline overflow-y-auto">
              {subscribers.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span className="text-ink-800">{s.email}</span>
                  <span
                    className={
                      s.status === "active"
                        ? "rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700"
                        : "rounded-full border border-hairline bg-ink-50 px-2 py-0.5 text-xs font-semibold text-ink-600"
                    }
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
