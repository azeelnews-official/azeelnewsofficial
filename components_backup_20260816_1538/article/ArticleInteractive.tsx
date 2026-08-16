"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Bookmark,
  Share2,
  Link2,
  Printer,
  Minus,
  Plus,
  BookOpenText,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import type { Article } from "@/lib/types";

const FONT_SCALE = ["text-base", "text-lg", "text-xl", "text-2xl"] as const;

export function ArticleInteractive({ article }: { article: Article }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(2140);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.slug);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontStep, setFontStep] = useState(1);
  const [readingMode, setReadingMode] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    // Deliberate: the share URL depends on window.location, which has no
    // server equivalent, so setting it on mount is the correct
    // hydration-safe pattern rather than an effect anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(window.location.href);
  }, []);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function handleShareClick() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: article.headline, url: shareUrl });
        return;
      } catch {
        // user cancelled — fall through to the menu
      }
    }
    setShareOpen((v) => !v);
  }

  return (
    <div className={cn(readingMode && "mx-auto max-w-2xl")}>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-hairline py-3">
        <div className="flex items-center gap-1">
          <ToolbarButton
            active={liked}
            label={liked ? "Unlike" : "Like"}
            onClick={() => {
              setLiked((v) => !v);
              setLikeCount((c) => (liked ? c - 1 : c + 1));
            }}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
            <span className="ml-1.5 font-mono text-xs">{likeCount.toLocaleString("en-IN")}</span>
          </ToolbarButton>

          <ToolbarButton
            active={bookmarked}
            label={bookmarked ? "Remove bookmark" : "Bookmark"}
            onClick={() => toggleBookmark(article.slug)}
          >
            <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
          </ToolbarButton>

          <div className="relative">
            <ToolbarButton label="Share" onClick={handleShareClick}>
              <Share2 size={17} />
            </ToolbarButton>
            {shareOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 flex gap-1 rounded-md border border-hairline bg-surface p-1.5 shadow-lg">
                <a
                  aria-label="Share on X"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.headline)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-2 text-ink-600 hover:bg-ink-50 hover:text-azeel"
                >
                  <Twitter size={16} />
                </a>
                <a
                  aria-label="Share on Facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-2 text-ink-600 hover:bg-ink-50 hover:text-azeel"
                >
                  <Facebook size={16} />
                </a>
                <a
                  aria-label="Share on WhatsApp"
                  href={`https://wa.me/?text=${encodeURIComponent(`${article.headline} ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-2 text-ink-600 hover:bg-ink-50 hover:text-azeel"
                >
                  <MessageCircle size={16} />
                </a>
                <a
                  aria-label="Share on LinkedIn"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-2 text-ink-600 hover:bg-ink-50 hover:text-azeel"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            )}
          </div>

          <ToolbarButton label="Copy link" onClick={handleCopyLink}>
            {copied ? <Check size={17} className="text-green-600" /> : <Link2 size={17} />}
          </ToolbarButton>

          <ToolbarButton label="Print" onClick={() => window.print()}>
            <Printer size={17} />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            active={readingMode}
            label="Reading mode"
            onClick={() => setReadingMode((v) => !v)}
          >
            <BookOpenText size={17} />
          </ToolbarButton>
          <div className="ml-1 flex items-center gap-1 rounded-md border border-hairline px-1 py-0.5" role="group" aria-label="Font size">
            <button
              aria-label="Decrease font size"
              onClick={() => setFontStep((s) => Math.max(0, s - 1))}
              className="rounded p-1.5 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
              disabled={fontStep === 0}
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center font-mono text-[11px] text-ink-300">Aa</span>
            <button
              aria-label="Increase font size"
              onClick={() => setFontStep((s) => Math.min(FONT_SCALE.length - 1, s + 1))}
              className="rounded p-1.5 text-ink-600 hover:bg-ink-50 disabled:opacity-30"
              disabled={fontStep === FONT_SCALE.length - 1}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex flex-col gap-5 leading-relaxed text-ink-800",
          FONT_SCALE[fontStep],
          readingMode && "font-display"
        )}
      >
        {(article.body ?? []).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex items-center rounded-md px-2.5 py-2 text-sm transition-colors",
        active ? "bg-azeel/10 text-azeel-dark" : "text-ink-600 hover:bg-ink-50"
      )}
    >
      {children}
    </button>
  );
}
