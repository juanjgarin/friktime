import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { PosterCarousel } from "@/components/poster-carousel";
import { NewsCard } from "@/components/news-card";
import { getFeaturedFilms, getFilms, getPublishedNews } from "@/lib/queries";

export const revalidate = 60;

export default async function Home() {
  const [featured, films, news] = await Promise.all([getFeaturedFilms(), getFilms(), getPublishedNews(3)]);
  const hero = featured.length ? featured : films.slice(0, 5);

  return (
    <>
      {hero.length ? (
        <HeroCarousel films={hero} />
      ) : (
        <section className="flex h-[60svh] items-center justify-center px-4 text-center">
          <h1 className="display text-5xl sm:text-7xl">
            Friktime<span className="text-blood">.</span>
          </h1>
        </section>
      )}

      {films.length > 0 && (
        <Section title="Películas" href="/peliculas">
          <PosterCarousel films={films} />
        </Section>
      )}

      {news.length > 0 && (
        <Section title="Novedades" href="/novedades">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-3">
        <h2 className="text-lg font-black uppercase tracking-[0.2em]">{title}</h2>
        <Link href={href} className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-blood">
          Ver todo →
        </Link>
      </div>
      {children}
    </section>
  );
}
