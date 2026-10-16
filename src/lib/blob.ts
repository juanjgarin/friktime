import { del } from "@vercel/blob";
import { eq, or } from "drizzle-orm";
import { getDb } from "@/db";
import { about, films, members, news } from "@/db/schema";

/** Solo se borran archivos que están en nuestro Blob (no URLs externas pegadas a mano). */
const isBlobUrl = (u?: string | null): u is string => {
  if (!u) return false;
  try {
    return new URL(u).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
};

/** ¿Algún registro sigue usando este archivo? (por si la misma URL se pegó en dos lugares) */
async function inUse(url: string) {
  const db = getDb();
  const rows = await Promise.all([
    db.select({ id: films.id }).from(films).where(or(eq(films.posterUrl, url), eq(films.bannerUrl, url), eq(films.videoUrl, url))).limit(1),
    db.select({ id: news.id }).from(news).where(eq(news.imageUrl, url)).limit(1),
    db.select({ id: members.id }).from(members).where(eq(members.photoUrl, url)).limit(1),
    db.select({ id: about.id }).from(about).where(or(eq(about.imageUrl, url), eq(about.logoUrl, url))).limit(1),
  ]);
  return rows.some((r) => r.length > 0);
}

/**
 * Libera espacio: borra del Blob los archivos viejos (reemplazados o de registros eliminados) que ya
 * no usa ningún registro. Llamar DESPUÉS de guardar. Nunca rompe el guardado si el borrado falla.
 */
export async function deleteUnusedBlobs(urls: (string | null | undefined)[]) {
  try {
    const unique = [...new Set(urls.filter(isBlobUrl))];
    const unused: string[] = [];
    for (const u of unique) if (!(await inUse(u))) unused.push(u);
    if (unused.length) await del(unused);
  } catch (e) {
    console.error("[blob] no se pudo borrar:", e instanceof Error ? e.message : e);
  }
}
