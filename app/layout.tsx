import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AppProvider } from "@/context/AppContext";
import QueryProvider from "@/components/providers/QueryProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Career77 — Find Jobs & Talent",
  description: "Browse openings, register once with your resume, and get matched automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <QueryProvider>
          <Providers>
            <AppProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </AppProvider>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
