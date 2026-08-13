import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { AdminPost, PostStatus } from "@/lib/data/constants";
import { getCategoryLabel } from "@/lib/data/constants";
import { formatRelativeTime, formatViews, cn } from "@/lib/utils";

const STATUS_STYLES: Record<PostStatus, string> = {
  published: "bg-green-50 text-green-700 border-green-200",
  draft: "bg-ink-50 text-ink-600 border-hairline",
  scheduled: "bg-azeel/10 text-azeel-dark border-azeel/20",
};

export function RecentPostsTable({ posts }: { posts: AdminPost[] }) {
  return (
    <div className="border border-hairline bg-surface">
      <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
        <h2 className="font-display text-base font-bold text-ink-950">Recent Posts</h2>
        <Link href="/admin/posts" className="text-sm font-semibold text-azeel hover:text-azeel-dark">
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
              <th className="px-5 py-3 font-medium">Headline</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Views</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                <td className="max-w-xs px-5 py-3">
                  <span className="line-clamp-1 font-medium text-ink-900">{post.headline}</span>
                </td>
                <td className="px-5 py-3 text-ink-600">{getCategoryLabel(post.category)}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                      STATUS_STYLES[post.status]
                    )}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-600">{formatViews(post.views) || "—"}</td>
                <td className="px-5 py-3 text-ink-300">{formatRelativeTime(post.updatedAt)}</td>
                <td className="px-5 py-3">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
