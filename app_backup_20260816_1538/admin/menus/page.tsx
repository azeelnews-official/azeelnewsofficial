import { MenusManager } from "@/components/admin/menus/MenusManager";
import { getAdminMenus } from "@/lib/data/menus";


export const metadata = {
title:"Menus"
};


export default async function AdminMenusPage(){

const menus = await getAdminMenus();


return (

<MenusManager initialMenus={menus}/>

)

}
