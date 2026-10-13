import type { Metadata } from "next";
import { getAbout } from "@/lib/queries";
import { safeUrl } from "@/lib/format";
import { ContactForm } from "./contact-form";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contacto" };

export default async function ContactPage() {
  const about = await getAbout();
  const socials = [
    { label: "Instagram", href: safeUrl(about?.instagram) },
    { label: "X", href: safeUrl(about?.x) },
    { label: "YouTube", href: safeUrl(about?.youtube) },
  ].filter((s) => s.href);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-28 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="display text-5xl sm:text-7xl">Contacto</h1>
        <p className="mt-6 max-w-md whitespace-pre-line leading-relaxed text-muted">
          {about?.contactIntro ||
            "¿Querés proponernos un proyecto, hablar de distribución, prensa o simplemente decirnos hola? Escribinos."}
        </p>
        {about?.contactEmail && (
          <a href={`mailto:${about.contactEmail}`} className="mt-6 block text-lg font-bold text-blood hover:underline">
            {about.contactEmail}
          </a>
        )}
        {socials.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest">
            {socials.map((s) => (
              <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer" className="hover:text-blood">
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
