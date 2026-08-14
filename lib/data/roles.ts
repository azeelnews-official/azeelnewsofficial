import { prisma } from "@/lib/prisma";

export const ROLE_PERMISSIONS = {
  ADMIN: {
    label: "Admin",
    description: "Full system access",
    permissions: [
      "Manage users",
      "Manage posts",
      "Manage settings",
      "Manage media",
      "Manage advertisements",
    ],
  },

  EDITOR: {
    label: "Editor",
    description: "Content management access",
    permissions: [
      "Create posts",
      "Edit posts",
      "Publish articles",
      "Manage categories",
    ],
  },

  JOURNALIST: {
    label: "Journalist",
    description: "News publishing access",
    permissions: [
      "Create articles",
      "Upload media",
      "Edit own articles",
    ],
  },

  READER: {
    label: "Reader",
    description: "Basic user access",
    permissions: [
      "Read articles",
      "Comment",
      "Bookmark",
    ],
  },
} as const;


export async function getRoleStats(){

const users = await prisma.user.groupBy({
by:["role"],
_count:{
role:true,
}
});


return users;

}
