import { NewsletterManager } from "@/components/admin/newsletter/NewsletterManager";
import { getNewsletterData } from "@/lib/data/newsletter";

export const metadata = { title: "Newsletter" };

export default async function AdminNewsletterPage() {

  const { subscribers } = await getNewsletterData();

  return (
    <NewsletterManager
      subscribers={subscribers}
      campaigns={[]}
    />
  );

}
