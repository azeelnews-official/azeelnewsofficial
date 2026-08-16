import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | AZEEL NEWS Admin",
  },
  robots: { index: false, follow: false },
};

// Role-gated access (Journalist/Editor/Admin) is enforced by middleware.ts
// at the edge, before any of this ever renders.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
