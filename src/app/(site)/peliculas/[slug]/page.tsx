import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Img } from "@/components/img";
import { getFilmBySlug } from "@/lib/queries";
import { statusLabels } from "@/lib/labels";
import { filmLinks } from "@/lib/format";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const film = await getFilmBySlug((await params).slug);
  if (!film) return {};
  return {
    title: film.title,
    description: film.tagline ?? film.synopsis?.slice(0, 160),
    openGraph: film.posterUrl ? { images: [film.posterUrl] } : undefined,
  };
}

export default async function FilmPage({ params }: Props) {
  const film = await getFilmBySlug((await params).slug);
  if (!film) notFound();
  const links = filmLinks(film);

  return (
    <article>
      {film.bannerUrl && (
        <div className="relative h-[40svh] w-full md:h-[55svh]">
          <Img src={film.bannerUrl} loading="eager" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-4 pb-12 sm:px-6 md:grid-cols-[300px_1fr] ${film.bannerUrl ? "pt-12" : "pt-28"}`}
      >
        <div className={film.bannerUrl ? "md:-mt-40" : ""}>
          <div className="relative aspect-[2/3] overflow-hidden rounded bg-zinc-900 shadow-2xl shadow-black">
            {film.posterUrl && <Img src={film.posterUrl} alt={film.title} loading="eager" className="h-full w-full object-cover" />}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blood">
            {statusLabels[film.status]}
            {film.year ? ` · ${film.year}` : ""}
          </p>
          <h1 className="display text-5xl sm:text-7xl">{film.title}</h1>
          {film.tagline && <p className="mt-4 text-lg text-foreground/80">{film.tagline}</p>}
          {film.synopsis && (
            <div className="prose-fk mt-8 max-w-2xl">
              <p>{film.synopsis}</p>
            </div>
          )}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((l, i) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded px-6 py-3 text-xs font-bold uppercase tracking-widest transition ${
                    i === 0 ? "bg-blood text-white hover:bg-red-700" : "border border-white/30 hover:border-white"
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
