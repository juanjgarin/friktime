import Link from "next/link";
import { logoutAction } from "../actions";
import { requireAdmin } from "@/auth";
import { Img } from "@/components/img";

export const metadata = { title: "Panel", robots: { index: false } };

const links = [
  { href: "/admin/peliculas", label: "Películas" },
  { href: "/admin/novedades", label: "Novedades" },
  { href: "/admin/nosotros", label: "Nosotros" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/admin">
            <Img src="/logo.webp" alt="Friktime" loading="eager" className="h-10 w-auto" />
          </Link>
          <nav className="flex flex-1 gap-5 text-xs font-semibold uppercase tracking-widest">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-blood">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" target="_blank" className="text-xs text-muted hover:text-blood">
            Ver sitio ↗
          </Link>
          <form action={logoutAction} className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:inline">{session.user?.email}</span>
            <button className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-blood">Salir</button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </>
  );
}
