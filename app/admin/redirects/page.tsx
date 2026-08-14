import { RedirectsManager } from "@/components/admin/redirects/RedirectsManager";
import { getAdminRedirects } from "@/lib/data/redirects";

export const metadata={
 title:"Redirects"
};

export default async function AdminRedirectsPage(){

 const redirects = await getAdminRedirects();

 return (
  <RedirectsManager
   redirects={redirects}
  />
 );

}
