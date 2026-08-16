"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Mic, X, Clock, Flame } from "lucide-react";
import { getCategoryLabel } from "@/lib/data/constants";
import { trendingSearches } from "@/lib/data/search";

const RECENT_KEY = "azeel-recent-searches";
const MAX_RECENT = 5;

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const voiceSupported =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    // Deliberate: recent-search history lives in localStorage, which has no
    // server equivalent, so this mount-time read is the correct
    // hydration-safe pattern rather than an effect anti-pattern.
    try {
      const stored = window.localStorage.getItem(RECENT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  type SearchResult = {
  id:string;
  slug:string;
  headline:string;
  featuredImageUrl:string;
  category:string;
};

const [suggestions,setSuggestions] = useState<SearchResult[]>([]);

useEffect(()=>{

if(!query.trim()){
setSuggestions([]);
return;
}

const timer=setTimeout(async()=>{

const res=await fetch(`/api/search?q=${encodeURIComponent(query)}`);

const data=await res.json();

setSuggestions(data);

},300);


return ()=>clearTimeout(timer);

},[query]);

  function runSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recent.filter((r) => r.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_RECENT
    );
    setRecent(updated);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose();
  }

  function handleVoiceSearch() {
    type SpeechRecognitionCtor = new () => {
      lang: string;
      onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
      onend: (() => void) | null;
      start: () => void;
    };
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Recognition = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setQuery(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  return (
    <div
      className="border-t border-hairline bg-paper px-4 py-3"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="mx-auto max-w-[1400px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          className="flex items-center gap-2"
        >
          <Search size={18} className="shrink-0 text-ink-300" />
          <input
            ref={inputRef}
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, authors…"
            className="w-full bg-transparent py-1 text-base text-ink-900 outline-none placeholder:text-ink-300"
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              aria-label="Search by voice"
              className={`shrink-0 rounded-full p-2 transition-colors ${
                listening ? "animate-pulse-dot bg-press text-white" : "text-ink-300 hover:bg-ink-50 hover:text-ink-800"
              }`}
            >
              <Mic size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-full p-2 text-ink-300 hover:bg-ink-50 hover:text-ink-800"
          >
            <X size={18} />
          </button>
        </form>

        {suggestions.length > 0 ? (
          <ul className="mt-3 divide-y divide-hairline border-t border-hairline">
            {suggestions.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/article/${article.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm text-ink-800 hover:text-azeel-dark"
                >
                  <span className="line-clamp-1">{article.headline}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-eyebrow text-ink-300">
                    {getCategoryLabel(article.category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 flex flex-col gap-3 border-t border-hairline pt-3 sm:flex-row sm:gap-8">
            {recent.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink-300">
                  <Clock size={12} /> Recent
                </p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <button
                      key={term}
                      onClick={() => runSearch(term)}
                      className="rounded-full border border-hairline px-3 py-1 text-xs font-medium text-ink-600 hover:border-azeel hover:text-azeel-dark"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink-300">
                <Flame size={12} /> Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => runSearch(term)}
                    className="rounded-full border border-hairline px-3 py-1 text-xs font-medium text-ink-600 hover:border-azeel hover:text-azeel-dark"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
