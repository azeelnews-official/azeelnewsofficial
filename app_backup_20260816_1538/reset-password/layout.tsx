import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set a New Password",
  robots: { index: false, follow: true },
};

export default function ResetPasswordRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
