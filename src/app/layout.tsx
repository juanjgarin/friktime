import type { Metadata, Viewport } from "next";
import { Lato, Anton } from "next/font/google";
import "./globals.css";

const geist = Lato({ variable: "--font-geist-sans", subsets: ["latin"], weight: ["400", "700", "900"] });
const display = Anton({ variable: "--font-display", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: "Friktime — Productora de cine de terror", template: "%s · Friktime" },
  description: "Friktime es una productora de cine de terror. Contenido, novedades y más.",
};

export const viewport: Viewport = { themeColor: "#1a1a1a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geist.variable} ${display.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
