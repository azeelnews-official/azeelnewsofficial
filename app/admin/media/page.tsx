export const dynamic = "force-dynamic";

import { MediaManager } from "@/components/admin/media/MediaManager";
import { getAdminMedia } from "@/lib/data/media";

export const metadata = {
  title:"Media"
};


export default async function AdminMediaPage(){

  const media = await getAdminMedia();


  const formattedMedia = media.map((item)=>({
    id:item.id,
    url:item.url,
    altText:item.altText ?? "",
    type:item.type.toLowerCase() as "image" | "video",
    uploadedAt:item.createdAt.toISOString()
  }));


  return (
    <MediaManager
      initialItems={formattedMedia}
    />
  );

}
