import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { messages } from "@/db/schema";
import { deleteMessage, setMessageRead } from "../../actions";
import { DeleteButton } from "@/components/admin/ui";

export default async function MessagesAdmin() {
  const list = await getDb().select().from(messages).orderBy(desc(messages.createdAt));
  const fmt = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">Mensajes</h1>
        <Link href="/admin/contacto" className="text-xs font-bold uppercase tracking-widest text-blood hover:underline">
          Editar datos de contacto →
        </Link>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {list.length === 0 && <li className="py-6 text-muted">Todavía no hay mensajes.</li>}
        {list.map((m) => (
          <li key={m.id} className="py-4">
            <details>
              <summary className="flex cursor-pointer items-center gap-3">
                {!m.read && <span className="h-2.5 w-2.5 rounded-full bg-blood" aria-label="No leído" />}
                <span className={m.read ? "text-muted" : "font-bold"}>{m.name}</span>
                <span className="text-xs text-muted">{m.email}</span>
                <span className="ml-auto text-xs text-muted">{fmt.format(m.createdAt)}</span>
              </summary>
              <p className="mt-4 whitespace-pre-line text-sm text-foreground/90">{m.body}</p>
              <div className="mt-4 flex items-center gap-6">
                <a href={`mailto:${m.email}`} className="text-xs font-bold uppercase tracking-widest text-blood hover:underline">
                  Responder
                </a>
                <form action={setMessageRead.bind(null, m.id, !m.read)}>
                  <button className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground">
                    Marcar como {m.read ? "no leído" : "leído"}
                  </button>
                </form>
                <DeleteButton action={deleteMessage.bind(null, m.id)} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
