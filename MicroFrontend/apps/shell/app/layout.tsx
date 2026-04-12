import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Microfrontend Commerce Platform",
  description: "A production-minded microfrontend example with a Next.js shell and independent React remotes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
