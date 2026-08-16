import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
}) {
  const positive = (change ?? 0) >= 0;

  return (
    <div className="border border-hairline bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md bg-azeel/10 p-2 text-azeel">
          <Icon size={18} />
        </span>
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 font-mono text-xs font-semibold",
              positive ? "text-green-600" : "text-press"
            )}
          >
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-ink-950">{value}</p>
      <p className="mt-0.5 text-sm text-ink-300">{label}</p>
    </div>
  );
}
