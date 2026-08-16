import { BackupManager } from "@/components/admin/backup/BackupManager";
import type { AdminBackup } from "@/lib/types/admin";

export default function AdminBackupPage(){

  const formattedBackups: AdminBackup[] = [];

  return (
    <BackupManager
      initialBackups={formattedBackups}
    />
  );
}
