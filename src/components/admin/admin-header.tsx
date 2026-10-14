"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Img } from "../img";

type NavLink = { href: string; label: string };

const linkCls = "text-xs font-semibold uppercase tracking-widest hover:text-blood";

/** Desktop: menú en línea. Mobile: hamburguesa arriba a la derecha (igual que el sitio público). */
export function AdminHeader({
  logo,
  links,
  email,
  logoutAction,
}: {
  logo: string;
  links: NavLink[];
  email?: string | null;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  // Se guarda la ruta en la que se abrió: al navegar deja de coincidir y el menú se cierra solo.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  return (
    <header className="relative border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/admin" className="mr-auto md:mr-0">
          <Img src={logo} alt="Friktime" loading="eager" className="h-9 w-auto" />
        </Link>

        {/* Desktop */}
        <nav className="hidden flex-1 gap-5 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/" target="_blank" className="hidden text-xs text-muted hover:text-blood md:inline">
          Ver sitio ↗
        </Link>
        <form action={logoutAction} className="hidden items-center gap-3 md:flex">
          <span className="text-xs text-muted">{email}</span>
          <button className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-blood">Salir</button>
        </form>

        {/* Hamburguesa (mobile) */}
        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpenAt(open ? null : pathname)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-[3px] w-7 bg-white transition ${open ? "translate-y-[9px] rotate-45" : ""}`} />
          <span className={`h-[3px] w-7 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-[3px] w-7 bg-white transition ${open ? "-translate-y-[9px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-line bg-black/95 px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${linkCls} rounded px-2 py-3 text-sm ${pathname.startsWith(l.href) ? "text-blood" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="px-2 py-3 text-sm text-muted hover:text-blood">
            Ver sitio ↗
          </Link>
          <form action={logoutAction} className="mt-2 flex items-center justify-between border-t border-line px-2 pt-4">
            <span className="min-w-0 truncate text-xs text-muted">{email}</span>
            <button className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-blood">Salir</button>
          </form>
        </nav>
      )}
    </header>
  );
}
