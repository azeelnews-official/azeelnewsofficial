"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Calendar, Download, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { getEpaperEdition } from "@/lib/mock-data";

function formatDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function EpaperViewer() {
  const [date, setDate] = useState(() => formatDateInput(new Date()));
  const [openPage, setOpenPage] = useState<number | null>(null);
  const edition = useMemo(() => getEpaperEdition(date), [date]);

  function shiftDate(days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    setDate(formatDateInput(next));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-950">E-Paper</h1>
          <p className="text-sm text-ink-300">Today&apos;s print edition, page by page.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            aria-label="Previous edition"
            className="rounded-md border border-hairline p-2 text-ink-600 hover:bg-ink-50"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2 rounded-md border border-hairline px-3 py-2">
            <Calendar size={15} className="text-ink-300" />
            <input
              type="date"
              value={date}
              max={formatDateInput(new Date())}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm text-ink-900 outline-none"
            />
          </div>
          <button
            onClick={() => shiftDate(1)}
            disabled={date >= formatDateInput(new Date())}
            aria-label="Next edition"
            className="rounded-md border border-hairline p-2 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark">
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {edition.pages.map((page) => (
          <button
            key={page.pageNumber}
            onClick={() => setOpenPage(page.pageNumber)}
            className="group relative aspect-[5/7] overflow-hidden border border-hairline bg-ink-100"
          >
            <Image
              src={page.thumbnailUrl}
              alt={`Page ${page.pageNumber}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all group-hover:bg-ink-950/40 group-hover:opacity-100">
              <Expand size={22} className="text-white" />
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-ink-950/80 px-2 py-0.5 font-mono text-[11px] text-white">
              Page {page.pageNumber}
            </span>
          </button>
        ))}
      </div>

      {openPage !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Page ${openPage} full view`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/90 p-6"
          onClick={() => setOpenPage(null)}
        >
          <div className="relative aspect-[5/7] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Image
              src={edition.pages[openPage - 1]?.thumbnailUrl ?? ""}
              alt={`Page ${openPage}`}
              fill
              sizes="500px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
