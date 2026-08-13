import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy:{
      name:"asc"
    }
  });
}


export async function getCategoriesWithCounts(){

const categories = await prisma.category.findMany({
include:{
_count:{
select:{
posts:true
}
}
}
});

return categories.map((category)=>({
id:category.id,
slug:category.slug,
name:category.name,
nameHi:category.nameHi,
count:category._count.posts
}));

}
