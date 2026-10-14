import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { news } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { ArchiveFilter, btnCls } from "@/components/admin/ui";

export default async function NewsAdmin({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const showAll = (await searchParams).ver === "todas";
  const q = getDb().select().from(news);
  const list = await (showAll ? q : q.where(eq(news.archived, false))).orderBy(desc(news.publishedAt));
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl sm:text-4xl">Novedades</h1>
        <Link href="/admin/novedades/nuevo" className={btnCls}>
          + Nueva
        </Link>
      </div>
      <ArchiveFilter href="/admin/novedades" showAll={showAll} />
      <ul className="divide-y divide-line border-y border-line">
        {list.length === 0 && <li className="py-6 text-muted">Todavía no cargaste novedades.</li>}
        {list.map((n) => (
          <li key={n.id} className={n.archived ? "opacity-60" : ""}>
            <Link href={`/admin/novedades/${n.id}`} className="flex items-center gap-4 py-3 hover:bg-white/5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{n.title}</p>
                <p className="text-xs text-muted">
                  {formatDate(n.publishedAt)} · {n.published ? "Publicada" : "Borrador"}
                  {n.archived ? " · Archivada" : ""}
                </p>
              </div>
              <span className="hidden text-xs uppercase tracking-widest text-muted sm:inline">Editar</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
