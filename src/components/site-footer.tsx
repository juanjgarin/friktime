import Link from "next/link";
import { Img } from "./img";
import { getAbout } from "@/lib/queries";
import { phoneHref, socialLinks } from "@/lib/format";

export async function SiteFooter({ logo }: { logo: string }) {
  const about = await getAbout();
  const socials = socialLinks(about);

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Img src={logo} alt="Friktime" className="h-20 w-auto" />
          <div className="mt-4 space-y-1 text-sm text-muted">
            {about?.contactEmails.map((e) => (
              <a key={e} href={`mailto:${e}`} className="block hover:text-blood">
                {e}
              </a>
            ))}
            {about?.phones.map((p) => (
              <a key={p} href={phoneHref(p)} className="block hover:text-blood">
                {p}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-blood">
              {s.label}
            </a>
          ))}
          <Link href="/contacto" className="hover:text-blood">
            Contacto
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-line px-4 py-4 text-xs text-muted">
        <p>© {new Date().getFullYear()} Friktime. Todos los derechos reservados.</p>
        <a
          href="https://synclear.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 opacity-50 transition hover:opacity-100"
        >
          Powered by
          {/* El logo es oscuro: se pasa a blanco para que se lea sobre el fondo negro, sin recuadro. */}
          <Img src="/synclear-logo.webp" alt="Synclear" className="h-5 w-auto brightness-0 invert" />
        </a>
      </div>
    </footer>
  );
}
