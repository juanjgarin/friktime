import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { about, films, news, type About } from "@/db/schema";

// El sitio público no debe romperse si la BDD no está disponible.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[db]", e instanceof Error ? e.message : e);
    return fallback;
  }
}

const filmOrder = [asc(films.sortOrder), desc(films.year), desc(films.id)];

export const getFilms = () => safe(() => getDb().select().from(films).orderBy(...filmOrder), []);

export const getFeaturedFilms = () =>
  safe(() => getDb().select().from(films).where(eq(films.featured, true)).orderBy(...filmOrder), []);

export const getFilmBySlug = (slug: string) =>
  safe(async () => (await getDb().select().from(films).where(eq(films.slug, slug)))[0] ?? null, null);

export const getPublishedNews = (limit?: number) =>
  safe(() => {
    const q = getDb().select().from(news).where(eq(news.published, true)).orderBy(desc(news.publishedAt));
    return limit ? q.limit(limit) : q;
  }, []);

export const getNewsBySlug = (slug: string) =>
  safe(
    async () =>
      (await getDb().select().from(news).where(and(eq(news.slug, slug), eq(news.published, true))))[0] ?? null,
    null,
  );

export const getAbout = () =>
  safe<About | null>(async () => (await getDb().select().from(about).where(eq(about.id, 1)))[0] ?? null, null);
