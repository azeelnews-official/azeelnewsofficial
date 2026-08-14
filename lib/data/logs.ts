
import { prisma } from "@/lib/prisma";

export async function getAuditLogs() {
  const logs = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    metadata: log.metadata,
    createdAt: log.createdAt.toISOString(),
    userName: log.user?.name || "System",
  }));
}
