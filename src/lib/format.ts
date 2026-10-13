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
