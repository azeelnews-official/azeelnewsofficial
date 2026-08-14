"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Ban, CheckCircle2 } from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<Role, string> = {
  READER: "bg-ink-50 text-ink-600 border-hairline",
  JOURNALIST: "bg-azeel/10 text-azeel-dark border-azeel/20",
  EDITOR: "bg-press/10 text-press-dark border-press/20",
  ADMIN: "bg-ink-950 text-white border-ink-950",
};

export function UsersManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, query, roleFilter]);

  function changeRole(id: string, role: Role) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u))
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-950">Users</h1>
        <button className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark">
          Invite User
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-hairline bg-surface p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
          <Search size={15} className="text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">All roles</option>
          <option value="reader">Reader</option>
          <option value="journalist">Journalist</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <span className="ml-auto font-mono text-xs text-ink-300">{filtered.length} users</span>
      </div>

      <div className="overflow-x-auto border border-hairline bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-3 py-3 font-medium">Role</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Joined</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-ink-100">
                      <Image src={u.avatarUrl} alt={u.name} fill sizes="36px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{u.name}</p>
                      <p className="text-xs text-ink-300">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value as Role)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold capitalize outline-none",
                      ROLE_STYLES[u.role]
                    )}
                  >
                    <option value="reader">Reader</option>
                    <option value="journalist">Journalist</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                      u.status === "active"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-hairline bg-ink-50 text-ink-600"
                    )}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-ink-300">
                  {new Date(u.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold",
                        u.status === "active" ? "text-press hover:bg-press/10" : "text-green-700 hover:bg-green-50"
                      )}
                    >
                      {u.status === "active" ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                      {u.status === "active" ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-300">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
