import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: true },
};

export default function LoginRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
