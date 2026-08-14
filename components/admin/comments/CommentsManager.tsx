"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";
type AdminComment = {
  id: string;
  text: string;
  authorName: string;
  status: "approved" | "pending" | "spam";
  postedAt: string;
  articleSlug: string;
  articleHeadline: string;
};
import { formatRelativeTime, cn } from "@/lib/utils";

type StatusFilter = AdminComment["status"] | "all";

const STATUS_STYLES: Record<AdminComment["status"], string> = {
  approved: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-azeel/10 text-azeel-dark border-azeel/20",
  spam: "bg-press/10 text-press border-press/20",
};

export function CommentsManager({ initialComments }: { initialComments: AdminComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return comments.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (q && !c.text.toLowerCase().includes(q) && !c.authorName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [comments, query, statusFilter]);

  function setStatus(id: string, status: AdminComment["status"]) {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function remove(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  const counts = useMemo(
    () => ({
      pending: comments.filter((c) => c.status === "pending").length,
      spam: comments.filter((c) => c.status === "spam").length,
    }),
    [comments]
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-950">Comments</h1>
        <p className="text-sm text-ink-300">
          {counts.pending} pending review, {counts.spam} flagged as spam.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-hairline bg-surface p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
          <Search size={15} className="text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search comments…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-hairline p-1">
          {(["pending", "approved", "spam", "all"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded px-2.5 py-1.5 text-xs font-semibold capitalize transition-colors",
                statusFilter === status ? "bg-azeel text-white" : "text-ink-600 hover:bg-ink-50"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <span className="ml-auto font-mono text-xs text-ink-300">{filtered.length} comments</span>
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((comment) => (
          <li key={comment.id} className="border border-hairline bg-surface p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink-900">{comment.authorName}</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    STATUS_STYLES[comment.status]
                  )}
                >
                  {comment.status}
                </span>
              </div>
              <span className="font-mono text-[11px] text-ink-300">{formatRelativeTime(comment.postedAt)}</span>
            </div>

            <p className="mb-2 text-sm leading-relaxed text-ink-800">{comment.text}</p>

            <Link
              href={`/article/${comment.articleSlug}`}
              className="mb-3 block line-clamp-1 text-xs text-azeel hover:text-azeel-dark"
            >
              On: {comment.articleHeadline}
            </Link>

            <div className="flex gap-1">
              {comment.status !== "approved" && (
                <ActionButton
                  icon={CheckCircle2}
                  label="Approve"
                  tone="positive"
                  onClick={() => setStatus(comment.id, "approved")}
                />
              )}
              {comment.status !== "spam" && (
                <ActionButton
                  icon={ShieldAlert}
                  label="Mark as Spam"
                  tone="warning"
                  onClick={() => setStatus(comment.id, "spam")}
                />
              )}
              <ActionButton icon={Trash2} label="Delete" tone="danger" onClick={() => remove(comment.id)} />
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="border border-dashed border-hairline p-8 text-center text-sm text-ink-300">
            No comments match this filter.
          </li>
        )}
      </ul>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  tone: "positive" | "warning" | "danger";
}) {
  const toneClass = {
    positive: "text-green-700 hover:bg-green-50",
    warning: "text-azeel-dark hover:bg-azeel/10",
    danger: "text-press hover:bg-press/10",
  }[tone];

  return (
    <button onClick={onClick} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold", toneClass)}>
      <Icon size={13} />
      {label}
    </button>
  );
}
