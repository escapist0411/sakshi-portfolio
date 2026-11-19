import type { Metadata } from "next";
import { Inter, Syne, Instrument_Serif } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
export const metadata: Metadata = { title: `${portfolio.name} — ${portfolio.title}`, description: "Explore Sakshi Shevkari’s software development, AI/ML research, and deployment experience. Based in Pune, India." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${syne.variable} ${serif.variable}`}><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
