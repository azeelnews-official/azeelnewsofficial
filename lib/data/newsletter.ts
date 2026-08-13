
import { prisma } from "@/lib/prisma";

export async function getSubscribers(){
return prisma.newsletterSubscriber.findMany({
orderBy:{
subscribedAt:"desc"
}
});
}
