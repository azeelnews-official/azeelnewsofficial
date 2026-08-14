
import { prisma } from "@/lib/prisma";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "JOURNALIST" | "READER";
  avatarUrl: string;
  joinedAt: string;
  status: "active" | "suspended";
};


export async function getAdminUsers(): Promise<AdminUserRow[]> {

  const users = await prisma.user.findMany({
    orderBy:{
      createdAt:"desc"
    }
  });


  return users.map((user)=>({
    id:user.id,
    name:user.name,
    email:user.email,
    role:user.role,
    avatarUrl:user.image ?? "",
    joinedAt:user.createdAt.toISOString(),
    status:user.emailVerified ? "active" : "suspended"
  }));

}
