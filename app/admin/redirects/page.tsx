export const dynamic = "force-dynamic";

import { RedirectsManager } from "@/components/admin/redirects/RedirectsManager";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title:"Redirects"
};


export default async function AdminRedirectsPage(){

  const redirects = await prisma.redirect.findMany({
    orderBy:{
      fromPath:"asc"
    }
  });


  const formattedRedirects = redirects.map((redirect)=>({
    id: redirect.id,
    fromPath: redirect.fromPath,
    toPath: redirect.toPath,
    statusCode: redirect.statusCode as 301 | 302 | 307
  }));


  return (
    <RedirectsManager
      initialRedirects={formattedRedirects}
    />
  );

}
