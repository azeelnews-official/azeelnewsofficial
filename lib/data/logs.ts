
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
    actor: log.user?.name || "System",
    entity: `${log.entityType}:${log.entityId}`,
    action: log.action,
    createdAt: log.createdAt.toISOString(),
    metadata: log.metadata,
  }));
}
