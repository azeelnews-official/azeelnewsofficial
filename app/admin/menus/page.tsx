import { MenusManager } from "@/components/admin/menus/MenusManager";
import { adminMenus } from "@/lib/mock-data";

export const metadata = { title: "Menus" };

export default function AdminMenusPage() {
  return <MenusManager initialMenus={adminMenus} />;
}
