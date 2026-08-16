import { formatRelativeTime } from "@/lib/utils";
import { Clock } from "lucide-react";

export function ArticleMeta({
  authorName,
  publishedAt,
  readingTimeMin,
  tone = "light",
}: {
  authorName: string;
  publishedAt: string;
  readingTimeMin: number;
  tone?: "light" | "dark";
}) {
  const color = tone === "dark" ? "text-ink-300" : "text-ink-600";
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] ${color}`}>
      <span>{authorName}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={publishedAt}>{formatRelativeTime(publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1">
        <Clock size={11} />
        {readingTimeMin} min read
      </span>
    </div>
  );
}
