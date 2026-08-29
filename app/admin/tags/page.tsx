export const dynamic = "force-dynamic";

import { TagsManager } from "@/components/admin/tags/TagsManager";
import { getTagsWithCounts } from "@/lib/data/tags";

export const metadata = { title: "Tags" };

export default async function AdminTagsPage() {
  return <TagsManager initialTags={await getTagsWithCounts()} />;
}
