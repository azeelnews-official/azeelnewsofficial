export const dynamic = "force-dynamic";

import { LogsViewer } from "@/components/admin/logs/LogsViewer";
import { getAuditLogs } from "@/lib/data/logs";

export const metadata = {
  title:"Logs"
};


export default async function AdminLogsPage(){

  const logs = await getAuditLogs();


  const formattedLogs = logs.map((log)=>({
    id: log.id,
    createdAt: log.createdAt.toISOString(),
    actor: log.userId,
    action: log.action,
    entity: `${log.entityType}:${log.entityId}`,
    metadata: log.metadata ?? {}
  }));


  return (
    <LogsViewer initialEntries={formattedLogs}/>
  );

}
