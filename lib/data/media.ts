
import { prisma } from "@/lib/prisma";

export async function getMedia(){
return prisma.media.findMany({
orderBy:{
createdAt:"desc"
}
});
}
