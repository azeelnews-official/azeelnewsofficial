"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import type { Comment } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setComments((prev) => [
      {
        id: `local-${Date.now()}`,
        articleId,
        authorName: "You",
        postedAt: new Date().toISOString(),
        text: trimmed,
        likes: 0,
        status: "pending" as const,
      },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <section aria-labelledby="comments-heading" className="border-t border-hairline py-10">
      <h2 id="comments-heading" className="mb-6 font-display text-xl font-bold text-ink-950">
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="comment-draft" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          className="w-full resize-none rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark disabled:opacity-40"
            disabled={!draft.trim()}
          >
            Post Comment
          </button>
        </div>
      </form>

      <ul className="flex flex-col gap-6">
        {comments.map((comment) => (
          <li key={comment.id} className="border-b border-hairline pb-6 last:border-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-sm font-semibold text-ink-950">{comment.authorName}</span>
              <span className="font-mono text-[11px] text-ink-300">
                {formatRelativeTime(comment.postedAt)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-600">{comment.text}</p>
            <button className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink-300 hover:text-azeel">
              <ThumbsUp size={13} />
              {comment.likes}
            </button>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="text-sm text-ink-300">Be the first to comment on this story.</li>
        )}
      </ul>
    </section>
  );
}
