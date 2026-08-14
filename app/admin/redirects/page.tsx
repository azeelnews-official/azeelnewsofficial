import { RedirectsManager } from "@/components/admin/redirects/RedirectsManager";
import { getRedirects } from "@/lib/data/redirects";

export const metadata = { title: "Redirects" };

export default async function AdminRedirectsPage() {
  return <RedirectsManager initialRedirects={await getRedirects()} />;
}
