const WEEKLY_TRAFFIC = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 74 },
  { day: "Wed", value: 58 },
  { day: "Thu", value: 81 },
  { day: "Fri", value: 90 },
  { day: "Sat", value: 68 },
  { day: "Sun", value: 100 },
];

export function TrafficChart() {
  return (
    <div className="border border-hairline bg-surface p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink-950">Traffic — Last 7 Days</h2>
        <span className="font-mono text-xs text-ink-300">Pageviews</span>
      </div>
      <div className="flex h-40 items-end gap-3" role="img" aria-label="Bar chart of pageviews for the last seven days">
        {WEEKLY_TRAFFIC.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t bg-azeel/80 transition-all hover:bg-azeel"
                style={{ height: `${d.value}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-ink-300">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
