import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/editor/PostEditorForm";
import { getArticleBySlug, getAdminPosts } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  return { title: article ? `Edit — ${article.headline}` : "Edit Post" };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const adminPost = getAdminPosts().find((p) => p.slug === slug);

  return (
    <PostEditorForm
      mode="edit"
      initialValues={{
        title: article.headline,
        slug: article.slug,
        category: article.category,
        tags: article.tags ?? [],
        featuredImageUrl: article.imageUrl,
        body: (article.body ?? []).join("\n\n"),
        metaDescription: article.dek,
        status: adminPost?.status ?? "published",
        location: article.location ?? "",
      }}
    />
  );
}
