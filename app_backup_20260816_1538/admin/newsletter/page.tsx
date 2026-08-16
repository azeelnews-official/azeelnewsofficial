import { NewsletterManager } from "@/components/admin/newsletter/NewsletterManager";
import { getNewsletterData } from "@/lib/data/newsletter";

export const metadata = { title: "Newsletter" };

export default async function AdminNewsletterPage() {

  const { subscribers } = await getNewsletterData();

  const formattedSubscribers = subscribers.map((sub) => ({
    id: sub.id,
    email: sub.email,
    status: (sub.active ? "active" : "unsubscribed") as "active" | "unsubscribed",
    subscribedAt: sub.subscribedAt.toISOString(),
  }));

  return (
    <NewsletterManager
      subscribers={formattedSubscribers}
      campaigns={[]}
    />
  );
}
