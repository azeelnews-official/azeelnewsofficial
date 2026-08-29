import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getPublishedArticles } from "@/lib/data/articles";
import { PhotoGallery } from "@/components/photos/PhotoGallery";


export default async function PhotosPage() {

  const articles = await getPublishedArticles();

  return (
    <>
      <TopBar />
      <Header />

      <main
        id="main-content"
        className="mx-auto max-w-[1400px] px-4 py-10"
      >
        <h1 className="mb-8 font-display text-3xl font-bold text-ink-950 md:text-4xl">
          Photos
        </h1>

        <PhotoGallery articles={articles} />

      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
