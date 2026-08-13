"use client";

import type { PostStatus } from "@/lib/types/post";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatRelativeTime, formatViews, cn } from "@/lib/utils";

const PAGE_SIZE = 8;



type CategorySlug =
  | "india"
  | "world"
  | "politics"
  | "business"
  | "technology"
  | "sports"
  | "entertainment"
  | "health"
  | "explainers";

interface AdminPost {
  id: string;
  slug: string;
  headline: string;
  dek: string;
  category: CategorySlug;
  author: {
    name: string;
    slug: string;
    role: string;
    avatarUrl: string;
  };
  publishedAt: string;
  updatedAt: string;
  readingTimeMin: number;
  imageUrl: string;
  imageAlt: string;
  isLive?: boolean;
  isBreaking?: boolean;
  views?: number;
  tags?: string[];
  body?: string[];
  status: PostStatus;
}

const CATEGORIES: {
  slug: CategorySlug;
  label: string;
}[] = [
  { slug: "india", label: "India" },
  { slug: "world", label: "World" },
  { slug: "politics", label: "Politics" },
  { slug: "business", label: "Business" },
  { slug: "technology", label: "Technology" },
  { slug: "sports", label: "Sports" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "health", label: "Health" },
  { slug: "explainers", label: "Explainers" },
];

const STATUS_STYLES: Record<PostStatus, string> = {
  PUBLISHED:
    "bg-green-50 text-green-700 border-green-200",
  DRAFT:
    "bg-ink-50 text-ink-600 border-hairline",
  SCHEDULED:
    "bg-azeel/10 text-azeel-dark border-azeel/20",
  ARCHIVED:
    "bg-red-50 text-red-700 border-red-200",
};

function getCategoryLabel(
  category: CategorySlug
): string {
  return (
    CATEGORIES.find(
      (item) => item.slug === category
    )?.label ?? category
  );
}

function getBody(post: AdminPost): string {
  return post.body?.join("\n\n") ?? "";
}

function getStatusValue(
  status: PostStatus
): string {
  return status;
}

export function PostsManager({
  initialPosts,
}: {
  initialPosts: AdminPost[];
}) {
  const [posts, setPosts] =
    useState<AdminPost[]>(initialPosts);

  const [query, setQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<PostStatus | "all">("all");

  const [categoryFilter, setCategoryFilter] =
    useState<string>("all");

  const [selected, setSelected] =
    useState<Set<string>>(new Set());

  const [page, setPage] =
    useState(1);

  const [busyIds, setBusyIds] =
    useState<Set<string>>(new Set());

  const [error, setError] =
    useState<string | null>(null);

  const filtered = useMemo(() => {
    const q =
      query.trim().toLowerCase();

    return posts.filter((post) => {
      if (
        statusFilter !== "all" &&
        post.status !== statusFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        post.category !== categoryFilter
      ) {
        return false;
      }

      if (
        q &&
        !post.headline
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [
    posts,
    query,
    statusFilter,
    categoryFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const allOnPageSelected =
    pageItems.length > 0 &&
    pageItems.every((post) =>
      selected.has(post.id)
    );

  function setBusy(
    id: string,
    value: boolean
  ) {
    setBusyIds((previous) => {
      const next = new Set(previous);

      if (value) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((previous) => {
      const next = new Set(previous);

      if (allOnPageSelected) {
        pageItems.forEach((post) =>
          next.delete(post.id)
        );
      } else {
        pageItems.forEach((post) =>
          next.add(post.id)
        );
      }

      return next;
    });
  }

  async function updatePostStatus(
    post: AdminPost,
    status: PostStatus
  ) {
    setError(null);
    setBusy(post.id, true);

    try {
      const response = await fetch(
        `/api/admin/posts/${post.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            headline: post.headline,
            dek: post.dek,
            body: getBody(post),
            slug: post.slug,
            category: post.category,
            tags: post.tags ?? [],
            featuredImageUrl:
              post.imageUrl,
            featuredImageAlt:
              post.imageAlt ||
              post.headline,
            metaDescription:
              post.dek,
            status:
              getStatusValue(status),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to update article."
        );
      }

      setPosts((previous) =>
        previous.map((item) =>
          item.id === post.id
            ? {
                ...item,
                status,
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update article."
      );
    } finally {
      setBusy(post.id, false);
    }
  }

  async function applyBulkStatus(
    status: PostStatus
  ) {
    const selectedPosts =
      posts.filter((post) =>
        selected.has(post.id)
      );

    if (selectedPosts.length === 0) {
      return;
    }

    setError(null);

    for (const post of selectedPosts) {
      await updatePostStatus(
        post,
        status
      );
    }

    setSelected(new Set());
  }

  async function deleteOne(id: string) {
    const post = posts.find(
      (item) => item.id === id
    );

    if (!post) return;

    if (
      !window.confirm(
        "Delete this post? This cannot be undone."
      )
    ) {
      return;
    }

    setError(null);
    setBusy(id, true);

    try {
      const response = await fetch(
        `/api/admin/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to delete article."
        );
      }

      setPosts((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      setSelected((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete article."
      );
    } finally {
      setBusy(id, false);
    }
  }

  async function bulkDelete() {
    if (selected.size === 0) {
      return;
    }

    if (
      !window.confirm(
        `Delete ${selected.size} selected post(s)? This cannot be undone.`
      )
    ) {
      return;
    }

    const selectedIds =
      Array.from(selected);

    setError(null);

    for (const id of selectedIds) {
      const post = posts.find(
        (item) => item.id === id
      );

      if (!post) continue;

      setBusy(id, true);

      try {
        const response =
          await fetch(
            `/api/admin/posts/${id}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ??
              "Unable to delete article."
          );
        }

        setPosts((previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete article."
        );
      } finally {
        setBusy(id, false);
      }
    }

    setSelected(new Set());
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-950">
          Posts
        </h1>

        <Link
          href="/admin/posts/new"
          className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
        >
          New Post
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-hairline bg-surface p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
          <Search
            size={15}
            className="text-ink-300"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(
                event.target.value
              );
              setPage(1);
            }}
            placeholder="Search posts…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(
              event.target.value as
                | PostStatus
                | "all"
            );
            setPage(1);
          }}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">
            All statuses
          </option>
          <option value="PUBLISHED">
            Published
          </option>
          <option value="DRAFT">
            Draft
          </option>
          <option value="SCHEDULED">
            Scheduled
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(
              event.target.value
            );
            setPage(1);
          }}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">
            All categories
          </option>

          {CATEGORIES.map(
            (category) => (
              <option
                key={category.slug}
                value={category.slug}
              >
                {category.label}
              </option>
            )
          )}
        </select>

        <span className="ml-auto font-mono text-xs text-ink-300">
          {filtered.length} posts
        </span>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 flex items-center justify-between border border-azeel/30 bg-azeel/5 px-4 py-2.5">
          <span className="text-sm font-medium text-azeel-dark">
            {selected.size} selected
          </span>

          <div className="flex items-center gap-1">
            <BulkButton
              icon={CheckCircle2}
              label="Publish"
              onClick={() =>
                void applyBulkStatus(
                  "PUBLISHED"
                )
              }
            />

            <BulkButton
              icon={EyeOff}
              label="Unpublish"
              onClick={() =>
                void applyBulkStatus(
                  "DRAFT"
                )
              }
            />

            <BulkButton
              icon={Trash2}
              label="Delete"
              tone="danger"
              onClick={() =>
                void bulkDelete()
              }
            />
          </div>
        </div>
      )}

      <div className="border border-hairline bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      allOnPageSelected
                    }
                    onChange={
                      toggleAllOnPage
                    }
                    aria-label="Select all posts on this page"
                    className="h-4 w-4 accent-azeel"
                  />
                </th>

                <th className="px-3 py-3 font-medium">
                  Post
                </th>

                <th className="px-3 py-3 font-medium">
                  Category
                </th>

                <th className="px-3 py-3 font-medium">
                  Author
                </th>

                <th className="px-3 py-3 font-medium">
                  Status
                </th>

                <th className="px-3 py-3 font-medium">
                  Views
                </th>

                <th className="px-3 py-3 font-medium">
                  Updated
                </th>

                <th className="px-3 py-3 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map(
                (post) => {
                  const busy =
                    busyIds.has(
                      post.id
                    );

                  return (
                    <tr
                      key={post.id}
                      className="border-b border-hairline last:border-0 hover:bg-ink-50/50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(
                            post.id
                          )}
                          onChange={() =>
                            toggleOne(
                              post.id
                            )
                          }
                          disabled={busy}
                          aria-label={`Select ${post.headline}`}
                          className="h-4 w-4 accent-azeel"
                        />
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-ink-100">
                            {post.imageUrl ? (
                              <Image
                                src={
                                  post.imageUrl
                                }
                                alt={
                                  post.imageAlt ||
                                  ""
                                }
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-ink-300">
                                No image
                              </div>
                            )}
                          </div>

                          <span className="line-clamp-2 max-w-xs font-medium text-ink-900">
                            {post.headline}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-ink-600">
                        {getCategoryLabel(
                          post.category
                        )}
                      </td>

                      <td className="px-3 py-3 text-ink-600">
                        {post.author.name}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                            STATUS_STYLES[
                              post.status
                            ]
                          )}
                        >
                          {post.status}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-ink-600">
                        {formatViews(
                          post.views
                        ) || "—"}
                      </td>

                      <td className="px-3 py-3 text-ink-300">
                        {formatRelativeTime(
                          post.updatedAt
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/article/${post.slug}`}
                            aria-label="View post"
                            className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800"
                          >
                            <Eye
                              size={15}
                            />
                          </Link>

                          <Link
                            href={`/admin/posts/${post.slug}/edit`}
                            aria-label="Edit post"
                            className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800"
                          >
                            <Pencil
                              size={15}
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteOne(
                                post.id
                              )
                            }
                            disabled={busy}
                            aria-label="Delete post"
                            className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}

              {pageItems.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-ink-300"
                  >
                    No posts match your
                    filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
            <span className="font-mono text-xs text-ink-300">
              Page {currentPage} of{" "}
              {totalPages}
            </span>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                  )
                }
                disabled={
                  currentPage === 1
                }
                aria-label="Previous page"
                className="rounded-md border border-hairline p-1.5 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
              >
                <ChevronLeft
                  size={15}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                aria-label="Next page"
                className="rounded-md border border-hairline p-1.5 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
              >
                <ChevronRight
                  size={15}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BulkButton({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
        tone === "danger"
          ? "text-press hover:bg-press/10"
          : "text-ink-700 hover:bg-surface"
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}