import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos",
  description: "Browse photo galleries from AZEEL NEWS coverage.",
  alternates: { canonical: "/photos" },
};

export default function PhotosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
