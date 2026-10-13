import Link from "next/link";
import { Img } from "./img";
import { getAbout } from "@/lib/queries";

export async function SiteFooter() {
  const about = await getAbout();
  const socials = [
    { label: "Instagram", href: about?.instagram },
    { label: "X", href: about?.x },
    { label: "YouTube", href: about?.youtube },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          {/* Mobile: logo apilado · Desktop: logo con goteo (igual que el header) */}
          <Img src="/logo-stacked.webp" alt="Friktime" className="h-20 w-auto md:hidden" />
          <Img src="/logo.webp" alt="Friktime" className="hidden h-24 w-auto md:block" />
          {about?.contactEmail && (
            <a href={`mailto:${about.contactEmail}`} className="mt-4 block text-sm text-muted hover:text-blood">
              {about.contactEmail}
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {socials.map((s) => (
            <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer" className="hover:text-blood">
              {s.label}
            </a>
          ))}
          <Link href="/contacto" className="hover:text-blood">
            Contacto
          </Link>
          <Link href="/admin" className="opacity-40 hover:text-blood hover:opacity-100">
            Admin
          </Link>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Friktime. Todos los derechos reservados.
      </p>
    </footer>
  );
}
