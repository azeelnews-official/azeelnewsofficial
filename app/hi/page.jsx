import Link from "next/link";

export const metadata = {
  title: "Azeel News हिंदी - ताज़ा समाचार",
  description:
    "Azeel News हिंदी पर पढ़ें भारत, दुनिया, व्यापार, तकनीक और मनोरंजन की ताज़ा खबरें।",
  alternates: {
    canonical: "https://www.azeelnews.in/hi",
    languages: {
      en: "https://www.azeelnews.in/en",
      hi: "https://www.azeelnews.in/hi",
    },
  },
};

export default function HindiHome() {
  return (
    <main>
      <h1>Azeel News हिंदी</h1>

      <p>
        भारत, दुनिया, व्यापार, तकनीक और मनोरंजन की
        ताज़ा खबरें पढ़ें।
      </p>

      <Link href="/en">
        Read in English
      </Link>
    </main>
  );
}
