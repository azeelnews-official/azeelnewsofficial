import { PagesManager } from "@/components/admin/pages/PagesManager";
import { adminPages } from "@/lib/mock-data";

export const metadata = { title: "Pages" };

export default function AdminPagesPage() {
  return <PagesManager initialPages={adminPages} />;
}
