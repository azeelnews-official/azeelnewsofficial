import Link from "next/link";

export const metadata = {
  title: "Azeel News English - Latest Breaking News",
  description:
    "Read latest breaking news, India news, world news, technology, business and entertainment updates from Azeel News.",
  alternates: {
    canonical: "https://www.azeelnews.in/en",
    languages: {
      en: "https://www.azeelnews.in/en",
      hi: "https://www.azeelnews.in/hi",
    },
  },
};

export default function EnglishHome() {
  return (
    <main>
      <h1>Azeel News English</h1>

      <p>
        Latest breaking news, India, world, business,
        technology and entertainment updates.
      </p>

      <Link href="/hi">
        हिंदी में पढ़ें
      </Link>
    </main>
  );
}
