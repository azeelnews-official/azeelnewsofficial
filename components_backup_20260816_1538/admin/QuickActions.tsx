import Link from "next/link";
import { FilePlus, FolderPlus, UserPlus, Megaphone } from "lucide-react";

const ACTIONS = [
  { label: "New Post", href: "/admin/posts/new", icon: FilePlus },
  { label: "New Category", href: "/admin/categories/new", icon: FolderPlus },
  { label: "Invite User", href: "/admin/users/invite", icon: UserPlus },
  { label: "New Ad Campaign", href: "/admin/ads/new", icon: Megaphone },
];

export function QuickActions() {
  return (
    <div className="border border-hairline bg-surface p-5">
      <h2 className="mb-4 font-display text-base font-bold text-ink-950">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 rounded-md border border-hairline p-4 text-center transition-colors hover:border-azeel hover:bg-azeel/5"
          >
            <Icon size={18} className="text-azeel" />
            <span className="text-xs font-semibold text-ink-800">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
