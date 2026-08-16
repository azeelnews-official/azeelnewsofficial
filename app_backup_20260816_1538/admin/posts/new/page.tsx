import { PostEditorForm } from "@/components/admin/editor/PostEditorForm";

export const metadata = { title: "New Post" };

export default function NewPostPage() {
  return <PostEditorForm mode="create" />;
}
