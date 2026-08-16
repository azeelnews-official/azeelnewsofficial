export function AdSlot({ size = "leaderboard" }: { size?: "leaderboard" | "sidebar" | "inline" }) {
  const dims: Record<string, string> = {
    leaderboard: "h-[90px] w-full",
    sidebar: "h-[250px] w-full",
    inline: "h-[100px] w-full",
  };

  return (
    <div
      className={`flex ${dims[size]} items-center justify-center border border-dashed border-hairline bg-ink-50 text-xs uppercase tracking-eyebrow text-ink-300`}
      aria-label="Advertisement"
      role="complementary"
    >
      Advertisement
    </div>
  );
}
