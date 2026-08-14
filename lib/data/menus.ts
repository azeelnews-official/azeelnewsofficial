import { prisma } from "@/lib/prisma";


export type AdminMenuItem = {
  id: string;
  label: string;
  url: string;
  order: number;
  active: boolean;
};


export type AdminMenu = {
  id: string;
  name: string;
  location: string | null;
  items: AdminMenuItem[];
};


export async function getAdminMenus(): Promise<AdminMenu[]> {

const menus = await prisma.menu.findMany({

include:{
items:{
orderBy:{
order:"asc"
}
}
},

orderBy:{
createdAt:"desc"
}

});


return menus.map((menu)=>({

id: menu.id,

name: menu.name,

location: menu.location,

items: menu.items.map((item)=>({

id:item.id,

label:item.title,

url:item.url,

order:item.order,

active:item.active

}))

}));

}
