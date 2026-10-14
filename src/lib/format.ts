export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(d);

export function slugify(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item"
  );
}

/** Solo permite http(s) para no renderizar enlaces `javascript:` cargados desde el panel. */
export function safeUrl(u?: string | null) {
  return u && /^https?:\/\//i.test(u) ? u : null;
}

const PLATFORMS = [
  { key: "instagramUrls", label: "Instagram" },
  { key: "xUrls", label: "X" },
  { key: "youtubeUrls", label: "YouTube" },
] as const;

/** @usuario a partir de la URL del perfil (en YouTube solo si es del tipo /@canal). */
function handleOf(u: string, platform: string) {
  try {
    const seg = new URL(u).pathname.split("/").filter(Boolean)[0];
    if (!seg) return null;
    if (platform === "YouTube") return seg.startsWith("@") ? seg : null;
    return seg.startsWith("@") ? seg : `@${seg}`;
  } catch {
    return null;
  }
}

/** Enlaces a redes para mostrar en el sitio. Con varios perfiles de una red se distinguen por @usuario (o número). */
export function socialLinks(
  about?: { instagramUrls: string[]; xUrls: string[]; youtubeUrls: string[] } | null,
): { label: string; href: string }[] {
  if (!about) return [];
  return PLATFORMS.flatMap(({ key, label }) => {
    const urls = about[key].filter((u) => safeUrl(u));
    return urls.map((href, i) => ({
      label: urls.length === 1 ? label : `${label} ${handleOf(href, label) ?? i + 1}`,
      href,
    }));
  });
}

export const phoneHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
