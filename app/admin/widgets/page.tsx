import { getWidgets } from "@/lib/data/widgets";
import { WidgetsManager } from "@/components/admin/widgets/WidgetsManager";

export const metadata = { title: "Widgets" };

export default async function AdminWidgetsPage() {
  return <WidgetsManager />;
}
