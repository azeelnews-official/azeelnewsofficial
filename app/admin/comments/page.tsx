import { CommentsManager } from "@/components/admin/comments/CommentsManager";
import { getAllComments } from "@/lib/mock-data";

export const metadata = { title: "Comments" };

export default function AdminCommentsPage() {
  return <CommentsManager initialComments={getAllComments()} />;
}
