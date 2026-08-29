export const dynamic = "force-dynamic";

import { CommentsManager } from "@/components/admin/comments/CommentsManager";
import { getAllComments } from "@/lib/data/comments";

export const metadata = { title: "Comments" };

export default async function AdminCommentsPage() {
  const comments = await getAllComments();

  return <CommentsManager initialComments={comments as any} />;
}
