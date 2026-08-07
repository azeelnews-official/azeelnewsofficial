function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text: string): string {
  let out = escapeHtml(text);
  // Images: ![alt](url)
  out = out.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    '<img src="$2" alt="$1" class="my-3 w-full rounded" />'
  );
  // Links: [label](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" class="text-azeel underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Bold, then italic
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

/** Converts a small, safe subset of Markdown to HTML for the editor's live preview. */
export function markdownToHtml(source: string): string {
  const lines = source.split("\n");
  const html: string[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listType && listBuffer.length) {
      html.push(`<${listType} class="my-3 ml-5 list-${listType === "ul" ? "disc" : "decimal"} space-y-1">`);
      html.push(...listBuffer);
      html.push(`</${listType}>`);
    }
    listBuffer = [];
    listType = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const youtubeMatch = line.match(/^\[youtube]\((https?:\/\/[^\s)]+)\)$/i);
    if (youtubeMatch) {
      flushList();
      html.push(
        `<div class="my-4 aspect-video w-full overflow-hidden rounded"><iframe class="h-full w-full" src="${escapeHtml(
          youtubeMatch[1] ?? ""
        )}" allowfullscreen title="Embedded video"></iframe></div>`
      );
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushList();
      html.push(`<h3 class="mt-5 mb-2 font-display text-lg font-bold">${inlineFormat(line.replace(/^###\s+/, ""))}</h3>`);
    } else if (/^##\s+/.test(line)) {
      flushList();
      html.push(`<h2 class="mt-6 mb-2 font-display text-xl font-bold">${inlineFormat(line.replace(/^##\s+/, ""))}</h2>`);
    } else if (/^>\s+/.test(line)) {
      flushList();
      html.push(
        `<blockquote class="my-3 border-l-4 border-azeel pl-4 italic text-ink-600">${inlineFormat(
          line.replace(/^>\s+/, "")
        )}</blockquote>`
      );
    } else if (/^-\s+/.test(line)) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listBuffer.push(`<li>${inlineFormat(line.replace(/^-\s+/, ""))}</li>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listBuffer.push(`<li>${inlineFormat(line.replace(/^\d+\.\s+/, ""))}</li>`);
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      html.push(`<p class="my-3 leading-relaxed">${inlineFormat(line)}</p>`);
    }
  }
  flushList();

  return html.join("\n");
}
