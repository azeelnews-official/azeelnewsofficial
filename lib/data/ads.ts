
import { prisma } from "@/lib/prisma";

export async function getAds(){
return prisma.advertisement.findMany({
orderBy:{
createdAt:"desc"
}
});
}
