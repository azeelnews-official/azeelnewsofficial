"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle, Radio, Clock } from "lucide-react";
import { liveChannels, liveSchedule } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function LiveTvPlayer() {
  const [activeChannelId, setActiveChannelId] = useState(liveChannels[0]?.id ?? "");
  const activeChannel = liveChannels.find((c) => c.id === activeChannelId) ?? liveChannels[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink-950">Live TV</h1>
        <p className="text-sm text-ink-300">Streaming coverage across AZEEL&apos;s live channels.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative mb-3 aspect-video overflow-hidden bg-ink-950">
            {activeChannel && (
              <Image src={activeChannel.posterUrl} alt={activeChannel.name} fill sizes="800px" className="object-cover opacity-70" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <PlayCircle size={56} className="text-white/90" />
              <span className="flex items-center gap-1.5 rounded-full bg-press px-3 py-1 text-xs font-bold uppercase tracking-eyebrow text-white">
                <Radio size={12} className="animate-pulse-dot" /> Live
              </span>
            </div>
          </div>
          {activeChannel && (
            <>
              <h2 className="font-display text-xl font-bold text-ink-950">{activeChannel.name}</h2>
              <p className="text-sm text-ink-600">{activeChannel.description}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="border border-hairline bg-surface p-4">
            <h3 className="mb-3 font-display text-sm font-bold text-ink-950">Channels</h3>
            <div className="flex flex-col gap-1.5">
              {liveChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-md p-2 text-left transition-colors",
                    channel.id === activeChannelId ? "bg-azeel/10" : "hover:bg-ink-50"
                  )}
                >
                  <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-ink-100">
                    <Image src={channel.posterUrl} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      channel.id === activeChannelId ? "text-azeel-dark" : "text-ink-800"
                    )}
                  >
                    {channel.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-hairline bg-surface p-4">
            <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-ink-950">
              <Clock size={14} /> Today&apos;s Schedule
            </h3>
            <ul className="divide-y divide-hairline">
              {liveSchedule.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-ink-900">{item.show}</p>
                    <p className="text-xs text-ink-300">{item.host}</p>
                  </div>
                  <span className="font-mono text-xs text-ink-300">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
