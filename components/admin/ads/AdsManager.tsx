"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Pause, Play, Trash2 } from "lucide-react";
import type { AdCampaign, AdCampaignStatus, AdPlacement } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AdCampaignStatus, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  paused: "bg-azeel/10 text-azeel-dark border-azeel/20",
  ended: "bg-ink-50 text-ink-600 border-hairline",
};

export function AdsManager({ initialCampaigns }: { initialCampaigns: AdCampaign[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [query, setQuery] = useState("");
  const [placementFilter, setPlacementFilter] = useState<AdPlacement | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (placementFilter !== "all" && c.placement !== placementFilter) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [campaigns, query, placementFilter]);

  function toggleStatus(id: string) {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id && c.status !== "ended" ? { ...c, status: c.status === "active" ? "paused" : "active" } : c
      )
    );
  }

  function remove(id: string) {
    if (!window.confirm("Delete this campaign?")) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  const totals = useMemo(
    () => ({
      impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    }),
    [campaigns]
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-950">Advertisements</h1>
        <p className="text-sm text-ink-300">
          {(totals.impressions / 1000).toFixed(0)}K impressions · {totals.clicks.toLocaleString("en-IN")} clicks
          across {campaigns.length} campaigns
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-hairline bg-surface p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
          <Search size={15} className="text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>
        <select
          value={placementFilter}
          onChange={(e) => setPlacementFilter(e.target.value as AdPlacement | "all")}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">All placements</option>
          <option value="leaderboard">Leaderboard</option>
          <option value="sidebar">Sidebar</option>
          <option value="inline">Inline</option>
          <option value="sticky">Sticky</option>
          <option value="native">Native</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-hairline bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-3 py-3 font-medium">Placement</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Impressions</th>
              <th className="px-3 py-3 font-medium">CTR</th>
              <th className="px-3 py-3 font-medium">Runs</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-ink-100">
                      <Image src={c.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <span className="line-clamp-1 max-w-[220px] font-medium text-ink-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 capitalize text-ink-600">{c.placement}</td>
                <td className="px-3 py-3">
                  <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[c.status])}>
                    {c.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-ink-600">{c.impressions.toLocaleString("en-IN")}</td>
                <td className="px-3 py-3 text-ink-600">{((c.clicks / c.impressions) * 100).toFixed(2)}%</td>
                <td className="px-3 py-3 text-ink-300">
                  {new Date(c.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                  {new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    {c.status !== "ended" && (
                      <button
                        onClick={() => toggleStatus(c.id)}
                        aria-label={c.status === "active" ? "Pause" : "Resume"}
                        className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800"
                      >
                        {c.status === "active" ? <Pause size={15} /> : <Play size={15} />}
                      </button>
                    )}
                    <button onClick={() => remove(c.id)} aria-label="Delete" className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-300">
                  No campaigns match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
