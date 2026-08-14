import { ShieldCheck, Check } from "lucide-react";
import { ROLE_PERMISSIONS, adminUsers, type AdminRole } from "@/lib/mock-data";

export const metadata = { title: "Roles & Permissions" };

const ROLE_ORDER: AdminRole[] = ["reader", "journalist", "editor", "admin"];

export default function AdminRolesPage() {
  const countByRole = adminUsers.reduce<Record<AdminRole, number>>(
    (acc, u) => ({ ...acc, [u.role]: (acc[u.role] ?? 0) + 1 }),
    { reader: 0, journalist: 0, editor: 0, admin: 0 }
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">Roles &amp; Permissions</h1>
        <p className="text-sm text-ink-300">
          Each role inherits the permissions of the ones below it in the hierarchy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROLE_ORDER.map((role) => {
          const info = ROLE_PERMISSIONS[role];
          return (
            <div key={role} className="border border-hairline bg-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-md bg-azeel/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-azeel-dark">
                  <ShieldCheck size={13} />
                  {info.label}
                </span>
                <span className="font-mono text-xs text-ink-300">{countByRole[role]} users</span>
              </div>
              <p className="mb-4 text-sm text-ink-600">{info.description}</p>
              <ul className="flex flex-col gap-2">
                {info.permissions.map((perm) => (
                  <li key={perm} className="flex items-start gap-2 text-sm text-ink-800">
                    <Check size={15} className="mt-0.5 shrink-0 text-green-600" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
