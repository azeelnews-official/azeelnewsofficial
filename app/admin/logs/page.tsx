import { LogsViewer } from "@/components/admin/logs/LogsViewer";
import { auditLogEntries } from "@/lib/mock-data";

export const metadata = { title: "Logs" };

export default function AdminLogsPage() {
  return <LogsViewer initialEntries={auditLogEntries} />;
}
