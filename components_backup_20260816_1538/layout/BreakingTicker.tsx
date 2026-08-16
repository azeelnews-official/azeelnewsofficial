import type { TickerItem } from "@/lib/types";

export function BreakingTicker({ items }: { items: TickerItem[] }) {
  const loop = [...items, ...items];

  return (
    <div className="border-b border-hairline-dark bg-press">
      <div className="mx-auto flex max-w-[1400px] items-stretch">
        <div className="flex shrink-0 items-center gap-2 bg-press-dark px-3 py-2 md:px-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-white" />
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-eyebrow text-white">
            LIVE
          </span>
        </div>

        <div
          className="group relative flex-1 overflow-hidden"
          role="marquee"
          aria-label="Breaking news ticker"
        >
          <div className="flex animate-marquee items-center whitespace-nowrap py-2 group-hover:[animation-play-state:paused]">
            {loop.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.href}
                className="mx-6 text-sm font-medium text-white/95 transition-opacity hover:opacity-80"
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
