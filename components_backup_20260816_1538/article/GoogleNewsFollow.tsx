import { Newspaper } from "lucide-react";

export function GoogleNewsFollow() {
  return (
    <a
      href="https://news.google.com/publications/azeel-news"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-azeel hover:text-azeel-dark"
    >
      <Newspaper size={16} />
      Follow AZEEL NEWS on Google News
    </a>
  );
}
