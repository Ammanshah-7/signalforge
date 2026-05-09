import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://signalforge.ai";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: true,
  preload: true,
});

const title = "SignalForge — Find B2B Buyers Before Competitors Do";
const description =
  "AI-powered buyer intent detection and GEO scoring. Monitor Reddit, LinkedIn, and AI search engines to find warm leads and generate outreach automatically.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s · SignalForge" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "SignalForge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SignalForge — B2B buyer intent and GEO scoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "hsl(223 35% 6%)" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} min-h-full antialiased`}>{children}</body>
    </html>
  );
}
