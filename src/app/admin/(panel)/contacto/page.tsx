import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { about, messages } from "@/db/schema";
import { ContactForm } from "./contact-form";

export default async function ContactAdmin() {
  const db = getDb();
  const [[data], [unread]] = await Promise.all([
    db.select().from(about).where(eq(about.id, 1)),
    db.select({ c: count() }).from(messages).where(eq(messages.read, false)),
  ]);
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">Contacto</h1>
        <Link href="/admin/mensajes" className="text-xs font-bold uppercase tracking-widest text-blood hover:underline">
          Ver mensajes recibidos{unread.c > 0 ? ` (${unread.c} sin leer)` : ""} →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">
        Estos datos se muestran en la página de contacto y en el pie de página del sitio.
      </p>
      <ContactForm data={data} />
    </>
  );
}
