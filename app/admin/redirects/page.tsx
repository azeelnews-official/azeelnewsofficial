import { RedirectsManager } from "@/components/admin/redirects/RedirectsManager";
import { adminRedirects } from "@/lib/mock-data";

export const metadata = { title: "Redirects" };

export default function AdminRedirectsPage() {
  return <RedirectsManager initialRedirects={adminRedirects} />;
}
