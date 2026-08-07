import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Your Password",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
