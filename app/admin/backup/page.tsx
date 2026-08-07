import { BackupManager } from "@/components/admin/backup/BackupManager";
import { adminBackups } from "@/lib/mock-data";

export const metadata = { title: "Backup" };

export default function AdminBackupPage() {
  return <BackupManager initialBackups={adminBackups} />;
}
