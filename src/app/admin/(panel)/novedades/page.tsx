import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { news } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { btnCls } from "@/components/admin/ui";

export default async function NewsAdmin() {
  const list = await getDb().select().from(news).orderBy(desc(news.publishedAt));
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">Novedades</h1>
        <Link href="/admin/novedades/nuevo" className={btnCls}>
          + Nueva
        </Link>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {list.length === 0 && <li className="py-6 text-muted">Todavía no cargaste novedades.</li>}
        {list.map((n) => (
          <li key={n.id}>
            <Link href={`/admin/novedades/${n.id}`} className="flex items-center gap-4 py-3 hover:bg-white/5">
              <div className="flex-1">
                <p className="font-semibold">{n.title}</p>
                <p className="text-xs text-muted">
                  {formatDate(n.publishedAt)} · {n.published ? "Publicada" : "Borrador"}
                </p>
              </div>
              <span className="text-xs uppercase tracking-widest text-muted">Editar</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
