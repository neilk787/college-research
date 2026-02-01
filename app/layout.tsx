import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Research Tool | Explore Universities",
  description: "Browse and compare colleges with admissions data, costs, and outcomes from the Common Data Set.",
  openGraph: {
    title: "College Research Tool",
    description: "Explore universities with admissions data, costs, and outcomes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
