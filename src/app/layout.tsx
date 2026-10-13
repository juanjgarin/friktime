import type { Metadata, Viewport } from "next";
import { Geist, Anton } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Anton({ variable: "--font-display", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: "Friktime — Productora de cine de terror", template: "%s · Friktime" },
  description: "Friktime es una productora de cine de terror. Películas, novedades y más.",
  icons: { icon: "/logo.webp" },
};

export const viewport: Viewport = { themeColor: "#d90f1a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${display.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
