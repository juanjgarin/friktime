import Link from "next/link";
import { moveMember } from "../../actions";
import type { Member } from "@/db/schema";
import { btnCls } from "@/components/admin/ui";

const arrowCls =
  "flex h-9 w-9 items-center justify-center rounded border border-line text-muted hover:border-blood hover:text-blood disabled:pointer-events-none disabled:opacity-30";

export function TeamList({ list }: { list: Member[] }) {
  return (
    <section className="mt-14">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-2xl sm:text-3xl">Equipo</h2>
        <Link href="/admin/nosotros/equipo/nuevo" className={btnCls}>
          + Agregar miembro
        </Link>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {list.length === 0 && <li className="py-6 text-muted">Todavía no cargaste miembros.</li>}
        {list.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <div className="flex flex-col gap-1">
              <form action={moveMember.bind(null, m.id, -1)}>
                <button className={arrowCls} disabled={i === 0} aria-label={`Subir a ${m.name}`}>
                  ▲
                </button>
              </form>
              <form action={moveMember.bind(null, m.id, 1)}>
                <button className={arrowCls} disabled={i === list.length - 1} aria-label={`Bajar a ${m.name}`}>
                  ▼
                </button>
              </form>
            </div>
            <Link href={`/admin/nosotros/equipo/${m.id}`} className="flex min-w-0 flex-1 items-center gap-4 hover:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {m.photoUrl ? <img src={m.photoUrl} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" /> : <div className="h-16 w-16 shrink-0 rounded-full bg-zinc-900" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.name}</p>
                <p className="truncate text-xs text-muted">{m.role || "Sin rol"}</p>
              </div>
              <span className="hidden text-xs uppercase tracking-widest text-muted sm:inline">Editar</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
