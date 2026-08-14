import { getMenus } from "@/lib/data/menus";
import { MenusManager } from "@/components/admin/menus/MenusManager";
import { adminMenus } from "@/lib/mock-data";

export const metadata = { title: "Menus" };

export default async function AdminMenusPage() {
  return <MenusManager initialMenus={adminMenus} />;
}
