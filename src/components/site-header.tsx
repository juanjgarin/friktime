import Link from "next/link";
import { Img } from "./img";

const links = [
  { href: "/peliculas", label: "Películas" },
  { href: "/novedades", label: "Novedades" },
  { href: "/nosotros", label: "Nosotros" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Friktime — inicio">
          <Img src="/logo.webp" alt="Friktime" loading="eager" className="h-12 w-auto" />
        </Link>
        <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest sm:gap-8 sm:text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-foreground/80 transition hover:text-blood">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
