import { getMedia } from "@/lib/data/media";
import { MediaManager } from "@/components/admin/media/MediaManager";
import { getMediaLibrary } from "@/lib/mock-data";

export const metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  return <MediaManager initialItems={getMediaLibrary()} />;
}
