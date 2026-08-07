"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface Widget {
  id: string;
  name: string;
  enabled: boolean;
}

interface WidgetArea {
  id: string;
  name: string;
  widgets: Widget[];
}

const INITIAL_AREAS: WidgetArea[] = [
  {
    id: "home-sidebar",
    name: "Homepage Sidebar",
    widgets: [
      { id: "w-1", name: "Trending Now", enabled: true },
      { id: "w-2", name: "Ad Slot — Sidebar", enabled: true },
      { id: "w-3", name: "Newsletter Signup", enabled: false },
    ],
  },
  {
    id: "article-sidebar",
    name: "Article Sidebar",
    widgets: [
      { id: "w-4", name: "Newsletter Signup", enabled: true },
      { id: "w-5", name: "Ad Slot — Sidebar", enabled: true },
      { id: "w-6", name: "Related Topics", enabled: false },
    ],
  },
  {
    id: "footer",
    name: "Footer",
    widgets: [
      { id: "w-7", name: "Social Links", enabled: true },
      { id: "w-8", name: "Newsletter Signup", enabled: true },
      { id: "w-9", name: "App Download Badges", enabled: false },
    ],
  },
];

export function WidgetsManager() {
  const [areas, setAreas] = useState(INITIAL_AREAS);

  function toggleWidget(areaId: string, widgetId: string) {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? { ...area, widgets: area.widgets.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w)) }
          : area
      )
    );
  }

  function moveWidget(areaId: string, index: number, direction: -1 | 1) {
    setAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area;
        const widgets = [...area.widgets];
        const target = index + direction;
        if (target < 0 || target >= widgets.length) return area;
        const a = widgets[index];
        const b = widgets[target];
        if (!a || !b) return area;
        widgets[index] = b;
        widgets[target] = a;
        return { ...area, widgets };
      })
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">Widgets</h1>
        <p className="text-sm text-ink-300">Control what appears in each placement area and in what order.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {areas.map((area) => (
          <div key={area.id} className="border border-hairline bg-surface">
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
              <LayoutGrid size={15} className="text-azeel" />
              <h2 className="font-display text-sm font-bold text-ink-950">{area.name}</h2>
            </div>
            <ul className="divide-y divide-hairline">
              {area.widgets.map((widget, index) => (
                <li key={widget.id} className="flex items-center justify-between px-4 py-3">
                  <label className="flex items-center gap-2 text-sm text-ink-800">
                    <input
                      type="checkbox"
                      checked={widget.enabled}
                      onChange={() => toggleWidget(area.id, widget.id)}
                      className="h-4 w-4 accent-azeel"
                    />
                    <span className={cn(!widget.enabled && "text-ink-300 line-through")}>{widget.name}</span>
                  </label>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveWidget(area.id, index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded p-1 text-ink-300 hover:bg-ink-50 hover:text-ink-800 disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveWidget(area.id, index, 1)}
                      disabled={index === area.widgets.length - 1}
                      aria-label="Move down"
                      className="rounded p-1 text-ink-300 hover:bg-ink-50 hover:text-ink-800 disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
