"use client";

import {
  Bold,
  Italic,
  Heading2,
  Link2,
  Quote,
  List,
  ListOrdered,
  ImagePlus,
  Youtube,
} from "lucide-react";

interface ToolbarAction {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  before: string;
  after?: string;
  placeholder: string;
}

const ACTIONS: ToolbarAction[] = [
  { label: "Bold", icon: Bold, before: "**", after: "**", placeholder: "bold text" },
  { label: "Italic", icon: Italic, before: "*", after: "*", placeholder: "italic text" },
  { label: "Heading", icon: Heading2, before: "## ", placeholder: "Heading" },
  { label: "Quote", icon: Quote, before: "> ", placeholder: "Quote" },
  { label: "Bullet list", icon: List, before: "- ", placeholder: "List item" },
  { label: "Numbered list", icon: ListOrdered, before: "1. ", placeholder: "List item" },
  { label: "Link", icon: Link2, before: "[", after: "](https://)", placeholder: "link text" },
  { label: "Image", icon: ImagePlus, before: "![", after: "](https://)", placeholder: "alt text" },
  { label: "YouTube embed", icon: Youtube, before: "[youtube](", after: ")", placeholder: "https://youtube.com/embed/…" },
];

export function EditorToolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
}) {
  function applyAction(action: ToolbarAction) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || action.placeholder;
    const after = action.after ?? "";
    const next = value.slice(0, start) + action.before + selected + after + value.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + action.before.length + selected.length + after.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-hairline bg-ink-50 px-2 py-1.5">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => applyAction(action)}
          aria-label={action.label}
          title={action.label}
          className="rounded p-1.5 text-ink-600 hover:bg-surface hover:text-azeel"
        >
          <action.icon size={15} />
        </button>
      ))}
    </div>
  );
}
