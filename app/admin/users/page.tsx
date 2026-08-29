export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

import { UsersManager } from "@/components/admin/users/UsersManager";
import { getAdminUsers } from "@/lib/data/users";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  return <UsersManager initialUsers={await getAdminUsers()} />;
}
