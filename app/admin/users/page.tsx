import { UsersManager } from "@/components/admin/users/UsersManager";
import { adminUsers } from "@/lib/mock-data";

export const metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <UsersManager initialUsers={adminUsers} />;
}
