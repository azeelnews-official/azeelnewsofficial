import { Newspaper } from "lucide-react";

const GOOGLE_NEWS_SEARCH_URL =
  "https://news.google.com/search?q=Azeel%20News&hl=en-IN&gl=IN&ceid=IN%3Aen";

export function GoogleNewsFollow() {
  return (
    <a
      href={GOOGLE_NEWS_SEARCH_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-azeel hover:text-azeel-dark"
      aria-label="Find Azeel News on Google News"
    >
      <Newspaper size={16} aria-hidden="true" />
      Find AZEEL NEWS on Google News
    </a>
  );
}
