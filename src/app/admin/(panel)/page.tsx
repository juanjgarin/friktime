import Link from "next/link";
import { count } from "drizzle-orm";
import { getDb } from "@/db";
import { films, news } from "@/db/schema";

export default async function Dashboard() {
  const db = getDb();
  const [[f], [n]] = await Promise.all([
    db.select({ c: count() }).from(films),
    db.select({ c: count() }).from(news),
  ]);
  const cards = [
    { href: "/admin/peliculas", label: "Películas", value: f.c },
    { href: "/admin/novedades", label: "Novedades", value: n.c },
    { href: "/admin/nosotros", label: "Nosotros", value: "Editar" },
  ];
  return (
    <>
      <h1 className="display mb-8 text-4xl">Panel</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded border border-line p-6 transition hover:border-blood">
            <p className="text-xs uppercase tracking-widest text-muted">{c.label}</p>
            <p className="display mt-2 text-5xl">{c.value}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
