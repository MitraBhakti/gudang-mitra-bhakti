import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gudang Mitra Bhakti - Dukuh Prosutan",
  description: "Transparansi keuangan & peminjaman perkakas Gudang Mitra Bhakti Dukuh Prosutan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${fraunces.variable} ${inter.variable} font-body bg-paper text-ink`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
