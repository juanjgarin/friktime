import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { films } from "@/db/schema";
import { statusLabels } from "@/lib/labels";
import { ArchiveFilter, btnCls } from "@/components/admin/ui";

export default async function FilmsAdmin({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const showAll = (await searchParams).ver === "todas";
  const q = getDb().select().from(films);
  const list = await (showAll ? q : q.where(eq(films.archived, false))).orderBy(asc(films.sortOrder), desc(films.id));
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl sm:text-4xl">Contenido</h1>
        <Link href="/admin/peliculas/nuevo" className={btnCls}>
          + Nuevo
        </Link>
      </div>
      <ArchiveFilter href="/admin/peliculas" showAll={showAll} />
      <ul className="divide-y divide-line border-y border-line">
        {list.length === 0 && <li className="py-6 text-muted">Todavía no cargaste contenido.</li>}
        {list.map((f) => (
          <li key={f.id} className={f.archived ? "opacity-60" : ""}>
            <Link href={`/admin/peliculas/${f.id}`} className="flex items-center gap-4 py-3 hover:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {f.posterUrl ? <img src={f.posterUrl} alt="" className="h-16 w-11 rounded object-cover" /> : <div className="h-16 w-11 rounded bg-zinc-900" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{f.title}</p>
                <p className="text-xs text-muted">
                  {statusLabels[f.status]}
                  {f.year ? ` · ${f.year}` : ""}
                  {f.featured ? " · ★ destacada" : ""}
                  {f.archived ? " · Archivada" : ""}
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
