export const dynamic = "force-dynamic";

import { getWidgets } from "@/lib/data/widgets";
import { WidgetsManager } from "@/components/admin/widgets/WidgetsManager";

export const metadata = { title: "Widgets" };

export default async function AdminWidgetsPage() {
  const areas = await getWidgets();

  return <WidgetsManager initialAreas={areas} />;
}
