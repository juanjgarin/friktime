import type { Metadata } from "next";
import { getAbout } from "@/lib/queries";
import { phoneHref, socialLinks } from "@/lib/format";
import { ContactForm } from "./contact-form";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contacto" };

export default async function ContactPage() {
  const about = await getAbout();
  const socials = socialLinks(about);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-28 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="display text-5xl sm:text-7xl">Contacto</h1>
        <p className="mt-6 max-w-md whitespace-pre-line leading-relaxed text-muted">
          {about?.contactIntro ||
            "¿Querés proponernos un proyecto, hablar de distribución, prensa o simplemente decirnos hola? Escribinos."}
        </p>
        {(about?.contactEmails.length || about?.phones.length) ? (
          <div className="mt-6 space-y-1 text-lg font-bold text-blood">
            {about.contactEmails.map((e) => (
              <a key={e} href={`mailto:${e}`} className="block hover:underline">
                {e}
              </a>
            ))}
            {about.phones.map((p) => (
              <a key={p} href={phoneHref(p)} className="block hover:underline">
                {p}
              </a>
            ))}
          </div>
        ) : null}
        {socials.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest">
            {socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-blood">
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <ContactForm />
    </div>
  );
}
