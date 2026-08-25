"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, LayoutGrid, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Widget {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  order: number;
}

interface WidgetArea {
  id: string;
  name: string;
  slug: string;
  widgets: Widget[];
}

export function WidgetsManager() {
  const [areas, setAreas] = useState<WidgetArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadWidgets() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/widgets", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load widgets.");
      }

      setAreas(data.areas ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load widgets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWidgets();
  }, []);

  async function updateWidget(
    widgetId: string,
    changes: { enabled?: boolean; order?: number }
  ) {
    setSaving(widgetId);
    setError(null);

    try {
      const response = await fetch("/api/admin/widgets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          widgetId,
          ...changes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update widget.");
      }

      return data.widget;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update widget.");
      return null;
    } finally {
      setSaving(null);
    }
  }

  async function toggleWidget(widget: Widget) {
    const nextEnabled = !widget.enabled;

    setAreas((current) =>
      current.map((area) => ({
        ...area,
        widgets: area.widgets.map((item) =>
          item.id === widget.id
            ? { ...item, enabled: nextEnabled }
            : item
        ),
      }))
    );

    const updated = await updateWidget(widget.id, {
      enabled: nextEnabled,
    });

    if (!updated) {
      setAreas((current) =>
        current.map((area) => ({
          ...area,
          widgets: area.widgets.map((item) =>
            item.id === widget.id
              ? { ...item, enabled: widget.enabled }
              : item
          ),
        }))
      );
    }
  }

  async function moveWidget(
    areaId: string,
    index: number,
    direction: -1 | 1
  ) {
    const area = areas.find((item) => item.id === areaId);

    if (!area) return;

    const target = index + direction;

    if (target < 0 || target >= area.widgets.length) return;

    const reordered = [...area.widgets];
    const currentWidget = reordered[index];
    const targetWidget = reordered[target];

    if (!currentWidget || !targetWidget) return;

    reordered[index] = targetWidget;
    reordered[target] = currentWidget;

    const normalized = reordered.map((widget, position) => ({
      ...widget,
      order: position,
    }));

    setAreas((current) =>
      current.map((item) =>
        item.id === areaId
          ? { ...item, widgets: normalized }
          : item
      )
    );

    setSaving(currentWidget.id);
    setError(null);

    try {
      const response = await fetch("/api/admin/widgets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          areaId,
          orderedWidgetIds: normalized.map((widget) => widget.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save widget order.");
      }

      if (Array.isArray(data.widgets)) {
        setAreas((current) =>
          current.map((item) =>
            item.id === areaId
              ? { ...item, widgets: data.widgets }
              : item
          )
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save widget order."
      );

      await loadWidgets();
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-ink-300">
        <Loader2 size={16} className="animate-spin" />
        Loading widgets...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">
          Widgets
        </h1>

        <p className="text-sm text-ink-300">
          Control what appears in each placement area and in what order.
        </p>
      </div>

      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {areas.length === 0 ? (
        <div className="border border-hairline bg-surface px-5 py-8 text-sm text-ink-300">
          No widget areas have been configured.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {areas.map((area) => (
            <div
              key={area.id}
              className="border border-hairline bg-surface"
            >
              <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
                <LayoutGrid size={15} className="text-azeel" />

                <h2 className="font-display text-sm font-bold text-ink-950">
                  {area.name}
                </h2>
              </div>

              <ul className="divide-y divide-hairline">
                {area.widgets.map((widget, index) => (
                  <li
                    key={widget.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <label className="flex min-w-0 items-center gap-2 text-sm text-ink-800">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        disabled={saving === widget.id}
                        onChange={() => toggleWidget(widget)}
                        className="h-4 w-4 accent-azeel"
                      />

                      <span
                        className={cn(
                          "truncate",
                          !widget.enabled &&
                            "text-ink-300 line-through"
                        )}
                      >
                        {widget.name}
                      </span>
                    </label>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveWidget(area.id, index, -1)}
                        disabled={
                          index === 0 || saving !== null
                        }
                        aria-label={`Move ${widget.name} up`}
                        className="rounded p-1 text-ink-300 hover:bg-ink-50 hover:text-ink-800 disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveWidget(area.id, index, 1)}
                        disabled={
                          index === area.widgets.length - 1 ||
                          saving !== null
                        }
                        aria-label={`Move ${widget.name} down`}
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
      )}
    </div>
  );
}
