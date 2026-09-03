const GOOGLE_NEWS_SEARCH_URL =
  "https://news.google.com/search?q=Azeel%20News&hl=en-IN&gl=IN&ceid=IN%3Aen";

export default function GoogleNewsButton() {
  return (
    <a
      href={GOOGLE_NEWS_SEARCH_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-black hover:bg-gray-200"
      aria-label="Find Azeel News on Google News"
    >
      📰 Find Azeel News on Google News
    </a>
  );
}
