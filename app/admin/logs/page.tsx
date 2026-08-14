import { LogsViewer } from "@/components/admin/logs/LogsViewer";
import { getAuditLogs } from "@/lib/data/logs";

export const metadata = { title: "Logs" };

export default async function AdminLogsPage() {
  return <LogsViewer initialEntries={auditLogEntries} />;
}
