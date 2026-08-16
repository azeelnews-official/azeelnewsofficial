import { markdownToHtml } from "@/lib/markdown";

export function MarkdownPreview({ markdown, title }: { markdown: string; title: string }) {
  return (
    <div className="prose-none px-5 py-4">
      <h1 className="mb-4 font-display text-2xl font-bold text-ink-950">{title || "Untitled Post"}</h1>
      {markdown.trim() ? (
        <div
          className="text-sm text-ink-800"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
        />
      ) : (
        <p className="text-sm text-ink-300">Nothing to preview yet — start writing in the Write tab.</p>
      )}
    </div>
  );
}
