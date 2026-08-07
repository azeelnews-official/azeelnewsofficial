import { TagsManager } from "@/components/admin/tags/TagsManager";
import { getTagsWithCounts } from "@/lib/mock-data";

export const metadata = { title: "Tags" };

export default function AdminTagsPage() {
  return <TagsManager initialTags={getTagsWithCounts()} />;
}
