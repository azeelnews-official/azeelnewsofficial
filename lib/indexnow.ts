const SITE_URL = "https://www.azeelnews.in";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function submitToIndexNow(slug: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;

  if (!key || !slug) {
    return;
  }

  const url = `${SITE_URL}/article/${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(
      `${INDEXNOW_ENDPOINT}?url=${encodeURIComponent(url)}&key=${encodeURIComponent(key)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `IndexNow submission failed for ${url}: ${response.status}`
      );
    }
  } catch (error) {
    console.error(`IndexNow submission error for ${url}:`, error);
  }
}
