import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/img";
import { getFilms } from "@/lib/queries";
import { statusLabels } from "@/lib/labels";

export const revalidate = 60;
export const metadata: Metadata = { title: "Películas" };

export default async function FilmsPage() {
  const films = await getFilms();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6">
      <h1 className="display mb-10 text-5xl sm:text-7xl">Películas</h1>
      {films.length === 0 && <p className="text-muted">Pronto vas a ver acá nuestras películas.</p>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {films.map((f) => (
          <Link key={f.id} href={`/peliculas/${f.slug}`} className="group">
            <div className="aspect-[2/3] overflow-hidden rounded bg-zinc-900">
              {f.posterUrl && (
                <Img
                  src={f.posterUrl}
                  alt={f.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="mt-3 text-sm font-semibold uppercase tracking-wide group-hover:text-blood">{f.title}</h2>
            <p className="text-xs text-muted">
              {statusLabels[f.status]}
              {f.year ? ` · ${f.year}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
