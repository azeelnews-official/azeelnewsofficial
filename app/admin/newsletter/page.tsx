import { NewsletterManager } from "@/components/admin/newsletter/NewsletterManager";
import { newsletterSubscribers, newsletterCampaigns } from "@/lib/mock-data";

export const metadata = { title: "Newsletter" };

export default function AdminNewsletterPage() {
  return <NewsletterManager subscribers={newsletterSubscribers} campaigns={newsletterCampaigns} />;
}
