import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { films } from "@/db/schema";
import { statusLabels } from "@/lib/labels";
import { btnCls } from "@/components/admin/ui";

export default async function FilmsAdmin() {
  const list = await getDb().select().from(films).orderBy(asc(films.sortOrder), desc(films.id));
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">Películas</h1>
        <Link href="/admin/peliculas/nuevo" className={btnCls}>
          + Nueva
        </Link>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {list.length === 0 && <li className="py-6 text-muted">Todavía no cargaste películas.</li>}
        {list.map((f) => (
          <li key={f.id}>
            <Link href={`/admin/peliculas/${f.id}`} className="flex items-center gap-4 py-3 hover:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {f.posterUrl ? <img src={f.posterUrl} alt="" className="h-16 w-11 rounded object-cover" /> : <div className="h-16 w-11 rounded bg-zinc-900" />}
              <div className="flex-1">
                <p className="font-semibold">{f.title}</p>
                <p className="text-xs text-muted">
                  {statusLabels[f.status]}
                  {f.year ? ` · ${f.year}` : ""}
                  {f.featured ? " · ★ destacada" : ""}
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
