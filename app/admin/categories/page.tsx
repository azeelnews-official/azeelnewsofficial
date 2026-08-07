import { CategoriesManager } from "@/components/admin/categories/CategoriesManager";
import { getCategoriesWithCounts } from "@/lib/mock-data";

export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return <CategoriesManager initialCategories={getCategoriesWithCounts()} />;
}
