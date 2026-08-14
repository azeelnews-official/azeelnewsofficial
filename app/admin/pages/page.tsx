import { PagesManager } from "@/components/admin/pages/PagesManager";
import { getAdminPages } from "@/lib/data/pages";

export const metadata = {
  title:"Pages"
};


export default async function AdminPagesPage(){

  const pages = await getAdminPages();


  const formattedPages = pages.map((page)=>({
    id:page.id,
    slug:page.slug,
    title:page.title,
    content:page.content,
    updatedAt:page.updatedAt.toISOString()
  }));


  return (
    <PagesManager
      initialPages={formattedPages}
    />
  );

}
