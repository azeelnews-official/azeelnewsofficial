"use client";

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
import type { AdminPost, PostStatus } from "@/lib/mock-data";
import { categories, getCategoryLabel } from "@/lib/mock-data";
import { formatRelativeTime, formatViews, cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const STATUS_STYLES: Record<PostStatus, string> = {
  published: "bg-green-50 text-green-700 border-green-200",
  draft: "bg-ink-50 text-ink-600 border-hairline",
  scheduled: "bg-azeel/10 text-azeel-dark border-azeel/20",
};

export function PostsManager({ initialPosts }: { initialPosts: AdminPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (q && !p.headline.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, query, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allOnPageSelected = pageItems.length > 0 && pageItems.every((p) => selected.has(p.id));

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageItems.forEach((p) => next.delete(p.id));
      } else {
        pageItems.forEach((p) => next.add(p.id));
      }
      return next;
    });
  }

  function applyBulkStatus(status: PostStatus) {
    setPosts((prev) => prev.map((p) => (selected.has(p.id) ? { ...p, status } : p)));
    setSelected(new Set());
  }

  function bulkDelete() {
    if (!window.confirm(`Delete ${selected.size} selected post(s)? This cannot be undone.`)) return;
    setPosts((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  }

  function deleteOne(id: string) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-950">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
        >
          New Post
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-hairline bg-surface p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
          <Search size={15} className="text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as PostStatus | "all");
            setPage(1);
          }}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <span className="ml-auto font-mono text-xs text-ink-300">{filtered.length} posts</span>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 flex items-center justify-between border border-azeel/30 bg-azeel/5 px-4 py-2.5">
          <span className="text-sm font-medium text-azeel-dark">{selected.size} selected</span>
          <div className="flex items-center gap-1">
            <BulkButton icon={CheckCircle2} label="Publish" onClick={() => applyBulkStatus("published")} />
            <BulkButton icon={EyeOff} label="Unpublish" onClick={() => applyBulkStatus("draft")} />
            <BulkButton icon={Trash2} label="Delete" tone="danger" onClick={bulkDelete} />
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
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                    aria-label="Select all posts on this page"
                    className="h-4 w-4 accent-azeel"
                  />
                </th>
                <th className="px-3 py-3 font-medium">Post</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Author</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Views</th>
                <th className="px-3 py-3 font-medium">Updated</th>
                <th className="px-3 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((post) => (
                <tr key={post.id} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(post.id)}
                      onChange={() => toggleOne(post.id)}
                      aria-label={`Select ${post.headline}`}
                      className="h-4 w-4 accent-azeel"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-ink-100">
                        <Image src={post.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                      <span className="line-clamp-2 max-w-xs font-medium text-ink-900">{post.headline}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink-600">{getCategoryLabel(post.category)}</td>
                  <td className="px-3 py-3 text-ink-600">{post.author.name}</td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                        STATUS_STYLES[post.status]
                      )}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-ink-600">{formatViews(post.views) || "—"}</td>
                  <td className="px-3 py-3 text-ink-300">{formatRelativeTime(post.updatedAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/article/${post.slug}`}
                        aria-label="View post"
                        className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        aria-label="Edit post"
                        className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => deleteOne(post.id)}
                        aria-label="Delete post"
                        className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-300">
                    No posts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
            <span className="font-mono text-xs text-ink-300">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="rounded-md border border-hairline p-1.5 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="rounded-md border border-hairline p-1.5 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
              >
                <ChevronRight size={15} />
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
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
        tone === "danger" ? "text-press hover:bg-press/10" : "text-ink-700 hover:bg-surface"
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
