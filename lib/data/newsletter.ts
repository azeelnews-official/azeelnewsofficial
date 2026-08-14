import { prisma } from "@/lib/prisma";

export async function getNewsletterData(){

const subscribers = await prisma.newsletterSubscriber.findMany({
orderBy:{
subscribedAt:"desc"
}
});


return {
subscribers,
};

}
