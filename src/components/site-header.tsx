"use client";

import Link from "next/link";
import { useState } from "react";
import { Img } from "./img";

const left = [
  { href: "/peliculas", label: "Contenido" },
  { href: "/novedades", label: "Novedades" },
];
const right = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];
const all = [...left, ...right];

const linkCls = "text-sm font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:text-blood";

export function SiteHeader({ logo }: { logo: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-start px-4 sm:h-24 md:justify-center sm:px-6">
        {/* Menú izquierdo (desktop) */}
        <nav className="absolute left-6 hidden items-center gap-8 md:flex">
          {left.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/" aria-label="Friktime — inicio" onClick={() => setOpen(false)}>
          <Img src={logo} alt="Friktime" loading="eager" className="h-11 w-auto md:h-14" />
        </Link>

        {/* Menú derecho (desktop) */}
        <nav className="absolute right-6 hidden items-center gap-8 md:flex">
          {right.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Hamburguesa (mobile) */}
        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="absolute right-4 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-[3px] w-7 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-[3px] w-7 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-[3px] w-7 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col items-center gap-6 bg-black/95 py-8 md:hidden">
          {all.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`${linkCls} text-base`}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
