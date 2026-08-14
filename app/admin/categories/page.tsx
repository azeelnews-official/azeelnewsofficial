import { CategoriesManager } from "@/components/admin/categories/CategoriesManager";
import { getCategoriesWithCounts } from "@/lib/data/categories";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  return <CategoriesManager initialCategories={await getCategoriesWithCounts()} />;
}
