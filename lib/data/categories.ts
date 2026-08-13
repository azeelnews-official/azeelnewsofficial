import { prisma } from "@/lib/prisma";


export async function getCategories(){

return prisma.category.findMany({

orderBy:{
name:"asc"
}

});

}



export async function getCategoriesWithCounts(){

return prisma.category.findMany({

include:{
_count:{
select:{
posts:true
}
}
}

});

}