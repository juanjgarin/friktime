import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { about, films, members, news, type About } from "@/db/schema";

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

export const getFilms = () => safe(() => getDb().select().from(films).where(eq(films.archived, false)).orderBy(...filmOrder), []);

export const getFeaturedFilms = () =>
  safe(() => getDb().select().from(films).where(and(eq(films.featured, true), eq(films.archived, false))).orderBy(...filmOrder), []);

export const getFilmBySlug = (slug: string) =>
  safe(async () => (await getDb().select().from(films).where(and(eq(films.slug, slug), eq(films.archived, false))))[0] ?? null, null);

export const getPublishedNews = (limit?: number) =>
  safe(() => {
    const q = getDb().select().from(news).where(and(eq(news.published, true), eq(news.archived, false))).orderBy(desc(news.publishedAt));
    return limit ? q.limit(limit) : q;
  }, []);

export const getNewsBySlug = (slug: string) =>
  safe(
    async () =>
      (await getDb().select().from(news).where(and(eq(news.slug, slug), eq(news.published, true), eq(news.archived, false))))[0] ?? null,
    null,
  );

export const getAbout = () =>
  safe<About | null>(async () => (await getDb().select().from(about).where(eq(about.id, 1)))[0] ?? null, null);

export const DEFAULT_LOGO = "/logo-stacked.webp";

/** Logo de toda la app: el cargado desde el panel o, si no hay, el que viene con el sitio. */
export const getLogoUrl = async () => (await getAbout())?.logoUrl || DEFAULT_LOGO;

export const getMembers = () =>
  safe(() => getDb().select().from(members).orderBy(asc(members.sortOrder), asc(members.id)), []);
