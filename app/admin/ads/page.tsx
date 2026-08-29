export const dynamic = "force-dynamic";

import { AdsManager } from "@/components/admin/ads/AdsManager";
import { getAdCampaigns } from "@/lib/data/ads";

export const metadata = { title: "Advertisements" };

export default async function AdminAdsPage() {
  const ads = await getAdCampaigns();

  const adCampaigns = ads.map((ad: typeof ads[number]) => ({
    ...ad,
    status: ad.status.toLowerCase(),
    placement: ad.placement.toLowerCase(),
  }));

  return <AdsManager initialCampaigns={adCampaigns as any} />;
}
