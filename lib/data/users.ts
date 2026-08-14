
import { prisma } from "@/lib/prisma";

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name || "Unknown",
    email: user.email,
    role: user.role.toLowerCase() as "admin" | "editor" | "journalist" | "reader",
    avatarUrl: user.image || "",
    joinedAt: user.createdAt.toISOString(),
    status: user.emailVerified ? "ACTIVE" : "PENDING",
  }));
}
