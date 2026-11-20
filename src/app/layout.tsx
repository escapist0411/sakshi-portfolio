import type { Metadata } from "next";
import { Inter, Syne, Instrument_Serif } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "lenis/dist/lenis.css";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const title = `${portfolio.name} | ${portfolio.title}`;
const description = `Portfolio of ${portfolio.name}, an AI and software engineer in Pune, India, working across machine learning research, full-stack development, and deployment workflows.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [portfolio.name, "AI engineering", "software engineering", "machine learning research", "full-stack development", "software deployment"],
  authors: [{ name: portfolio.name }],
  creator: portfolio.name,
  openGraph: { type: "website", locale: "en_IN", siteName: `${portfolio.name} Portfolio`, title, description },
  twitter: { card: "summary", title, description },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${syne.variable} ${serif.variable}`}><body>{children}</body></html>;
}
