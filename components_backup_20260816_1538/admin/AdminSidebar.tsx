"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Users,
  Image as ImageIcon,
  Megaphone,
  ShieldCheck,
  MessageSquare,
  Mail,
  Search,
  Link2,
  Menu as MenuIcon,
  Layout,
  LayoutGrid,
  Settings,
  DatabaseBackup,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Posts", href: "/admin/posts", icon: FileText },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Tags", href: "/admin/tags", icon: Tags },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Authors & Editors", href: "/admin/people", icon: Users },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Comments", href: "/admin/comments", icon: MessageSquare },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { label: "Advertisements", href: "/admin/ads", icon: Megaphone },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Redirects", href: "/admin/redirects", icon: Link2 },
      { label: "Menus", href: "/admin/menus", icon: MenuIcon },
      { label: "Pages", href: "/admin/pages", icon: Layout },
      { label: "Widgets", href: "/admin/widgets", icon: LayoutGrid },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Backup", href: "/admin/backup", icon: DatabaseBackup },
      { label: "Logs", href: "/admin/logs", icon: ScrollText },
    ],
  },
];

export function AdminNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-5 px-3">
          <p className="mb-1.5 px-2 font-mono text-[10px] font-semibold uppercase tracking-eyebrow text-ink-600">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                      active ? "bg-azeel text-white" : "text-ink-300 hover:bg-ink-900 hover:text-white"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-ink-800 bg-ink-950 py-5 lg:block">
      <Link href="/" className="mb-6 block px-5">
        <span className="font-display text-xl font-black tracking-masthead text-white">
          AZEEL <span className="text-press">NEWS</span>
        </span>
        <span className="mt-0.5 block font-mono text-[10px] tracking-eyebrow text-ink-300">ADMIN</span>
      </Link>
      <AdminNavContent />
    </aside>
  );
}
