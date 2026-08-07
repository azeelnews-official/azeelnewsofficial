import { PostsManager } from "@/components/admin/posts/PostsManager";
import { getAdminPosts } from "@/lib/mock-data";

export const metadata = { title: "Posts" };

export default function AdminPostsPage() {
  const posts = getAdminPosts();
  return <PostsManager initialPosts={posts} />;
}
