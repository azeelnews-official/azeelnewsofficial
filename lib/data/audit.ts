import { prisma } from "@/lib/prisma";


export async function getAuditLogs(){

return prisma.auditLog.findMany({

orderBy:{
createdAt:"desc"
},

include:{
user:true
}

});

}