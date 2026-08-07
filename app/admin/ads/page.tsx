import { AdsManager } from "@/components/admin/ads/AdsManager";
import { adCampaigns } from "@/lib/mock-data";

export const metadata = { title: "Advertisements" };

export default function AdminAdsPage() {
  return <AdsManager initialCampaigns={adCampaigns} />;
}
