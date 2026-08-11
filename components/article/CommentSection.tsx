"use client";

import { useState } from "react";
import { ThumbsUp, Trash2 } from "lucide-react";
import type { Comment } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

type CommentWithLike = Comment & {
  liked?: boolean;
  canDelete?: boolean;
};

export function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<CommentWithLike[]>(
    initialComments.map((comment) => ({
      ...comment,
      liked: comment.liked ?? false,
      canDelete: comment.canDelete ?? false,
    }))
  );

  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = draft.trim();

    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: articleId,
          text: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(data.error || "Unable to post comment.");
      }

      if (data.comment) {
        setComments((prev) => [
          {
            ...data.comment,
            liked: false,
            canDelete: true,
          },
          ...prev,
        ]);

        setDraft("");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to post comment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike(commentId: string) {
    if (likingId || deletingId) return;

    setLikingId(commentId);
    setError("");

    try {
      const response = await fetch("/api/comments/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(data.error || "Unable to update like.");
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: Number(data.likes ?? comment.likes),
                liked: Boolean(data.liked),
              }
            : comment
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update like. Please try again."
      );
    } finally {
      setLikingId(null);
    }
  }

  async function handleDelete(commentId: string) {
    if (deletingId || likingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    setDeletingId(commentId);
    setError("");

    try {
      const response = await fetch("/api/comments/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(data.error || "Unable to delete comment.");
      }

      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete comment. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section
      aria-labelledby="comments-heading"
      className="border-t border-hairline py-10"
    >
      <h2
        id="comments-heading"
        className="mb-6 font-display text-xl font-bold text-ink-950"
      >
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="comment-draft" className="sr-only">
          Add a comment
        </label>

        <textarea
          id="comment-draft"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);

            if (error) {
              setError("");
            }
          }}
          placeholder="Share your thoughts…"
          rows={3}
          maxLength={2000}
          disabled={submitting}
          className="w-full resize-none rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel disabled:opacity-60"
        />

        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-ink-300">
            {draft.length}/2000
          </span>

          <button
            type="submit"
            className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!draft.trim() || submitting}
          >
            {submitting ? "Posting…" : "Post Comment"}
          </button>
        </div>
      </form>

      <ul className="flex flex-col gap-6">
        {comments.map((comment) => {
          const isLiking = likingId === comment.id;
          const isDeleting = deletingId === comment.id;
          const isLiked = comment.liked === true;

          return (
            <li
              key={comment.id}
              className="border-b border-hairline pb-6 last:border-0"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-sm font-semibold text-ink-950">
                  {comment.authorName}
                </span>

                <span className="font-mono text-[11px] text-ink-300">
                  {formatRelativeTime(comment.postedAt)}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-ink-600">
                {comment.text}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLike(comment.id)}
                  disabled={isLiking || isDeleting}
                  aria-pressed={isLiked}
                  aria-label={
                    isLiked
                      ? `Unlike comment by ${comment.authorName}`
                      : `Like comment by ${comment.authorName}`
                  }
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    isLiked
                      ? "text-azeel"
                      : "text-ink-300 hover:bg-ink-50 hover:text-azeel",
                  ].join(" ")}
                >
                  <ThumbsUp
                    size={14}
                    strokeWidth={isLiked ? 2.5 : 2}
                    className={[
                      "transition-transform",
                      isLiking ? "animate-pulse" : "",
                      isLiked ? "fill-current" : "",
                    ].join(" ")}
                  />

                  <span>{isLiked ? "Liked" : "Like"}</span>

                  <span className="ml-0.5">
                    {comment.likes}
                  </span>
                </button>

                {comment.canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={isDeleting || isLiking}
                    aria-label="Delete your comment"
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2
                      size={13}
                      className={isDeleting ? "animate-pulse" : ""}
                    />

                    <span>
                      {isDeleting ? "Deleting…" : "Delete"}
                    </span>
                  </button>
                )}
              </div>
            </li>
          );
        })}

        {comments.length === 0 && (
          <li className="text-sm text-ink-300">
            Be the first to comment on this story.
          </li>
        )}
      </ul>
    </section>
  );
}
