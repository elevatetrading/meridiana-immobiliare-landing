import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Meridiana Immobiliare — Find your home in Palermo in 60 seconds",
  description:
    "AI-powered real estate matching. Answer a few questions, get your perfect property in real time.",
  openGraph: {
    title: "Meridiana Immobiliare — Find your home in Palermo in 60 seconds",
    description:
      "AI-powered real estate matching. Answer a few questions, get your perfect property in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
