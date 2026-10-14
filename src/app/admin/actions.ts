"use server";

import { AuthError } from "next-auth";
import { asc, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, signIn, signOut } from "@/auth";
import { getDb } from "@/db";
import { about, films, members, messages, news } from "@/db/schema";
import { slugify } from "@/lib/format";

export type FormState = { error?: string } | undefined;

const url = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Debe ser una URL http(s) válida")
  .transform((v) => v || null);
const optText = z
  .string()
  .trim()
  .transform((v) => v || null);

function fail(e: z.ZodError): FormState {
  return { error: e.issues[0]?.message ?? "Datos inválidos" };
}

const refresh = () => revalidatePath("/", "layout");

async function uniqueSlug(table: typeof films | typeof news, base: string) {
  const db = getDb();
  let slug = slugify(base);
  for (let i = 2; (await db.select({ id: table.id }).from(table).where(eq(table.slug, slug))).length; i++) {
    slug = `${slugify(base)}-${i}`;
  }
  return slug;
}

/* ---------- Auth ---------- */

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Email o contraseña incorrectos" };
    throw e; // el redirect de Next también es una excepción
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

/* ---------- Películas ---------- */

const filmSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  tagline: optText,
  synopsis: optText,
  posterUrl: url,
  bannerUrl: url,
  trailerUrl: url,
  year: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1900 && v <= 2100), "Año inválido"),
  status: z.enum(["released", "upcoming", "production"]),
  sortOrder: z
    .string()
    .trim()
    .transform((v) => Number(v || 0))
    .refine(Number.isInteger, "Orden inválido"),
});

export async function saveFilm(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = filmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const values = { ...parsed.data, featured: formData.get("featured") === "on" };
  const db = getDb();

  if (id) await db.update(films).set(values).where(eq(films.id, id));
  else await db.insert(films).values({ ...values, slug: await uniqueSlug(films, values.title) });

  refresh();
  redirect("/admin/peliculas");
}

export async function deleteFilm(id: number) {
  await requireAdmin();
  await getDb().delete(films).where(eq(films.id, id));
  refresh();
  redirect("/admin/peliculas");
}

export async function setFilmArchived(id: number, archived: boolean) {
  await requireAdmin();
  await getDb().update(films).set({ archived }).where(eq(films.id, id));
  refresh();
  redirect("/admin/peliculas");
}

/* ---------- Novedades ---------- */

const newsSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  excerpt: optText,
  body: z.string().trim().min(1, "El contenido es obligatorio"),
  imageUrl: url,
  publishedAt: z
    .string()
    .trim()
    .transform((v) => (v ? new Date(v) : new Date()))
    .refine((d) => !isNaN(d.getTime()), "Fecha inválida"),
});

export async function saveNews(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const values = { ...parsed.data, published: formData.get("published") === "on" };
  const db = getDb();

  if (id) await db.update(news).set(values).where(eq(news.id, id));
  else await db.insert(news).values({ ...values, slug: await uniqueSlug(news, values.title) });

  refresh();
  redirect("/admin/novedades");
}

export async function deleteNews(id: number) {
  await requireAdmin();
  await getDb().delete(news).where(eq(news.id, id));
  refresh();
  redirect("/admin/novedades");
}

export async function setNewsArchived(id: number, archived: boolean) {
  await requireAdmin();
  await getDb().update(news).set({ archived }).where(eq(news.id, id));
  refresh();
  redirect("/admin/novedades");
}

/* ---------- Nosotros ---------- */

const aboutSchema = z.object({
  heading: z.string().trim().min(1, "El título es obligatorio"),
  body: z.string().trim(),
  imageUrl: url,
});

export async function saveAbout(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = aboutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  await getDb()
    .insert(about)
    .values({ id: 1, ...parsed.data })
    .onConflictDoUpdate({ target: about.id, set: parsed.data });
  refresh();
  return undefined;
}

/* ---------- Contacto (datos de la página y redes) ---------- */

/** Valores repetidos del formulario (un input por valor): sin vacíos ni duplicados. */
const values = (fd: FormData, name: string) => [
  ...new Set(fd.getAll(name).map((v) => String(v).trim()).filter(Boolean)),
];

export async function saveContact(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const lists = {
    contactEmails: values(formData, "contactEmails"),
    phones: values(formData, "phones"),
    instagramUrls: values(formData, "instagramUrls"),
    xUrls: values(formData, "xUrls"),
    youtubeUrls: values(formData, "youtubeUrls"),
  };

  const badEmail = lists.contactEmails.find((e) => !z.string().email().safeParse(e).success);
  if (badEmail) return { error: `Email inválido: ${badEmail}` };
  const badPhone = lists.phones.find((p) => !/^\+?[\d\s().-]{6,}$/.test(p));
  if (badPhone) return { error: `Teléfono inválido: ${badPhone}` };
  const badUrl = [...lists.instagramUrls, ...lists.xUrls, ...lists.youtubeUrls].find((u) => !/^https?:\/\//i.test(u));
  if (badUrl) return { error: `La URL debe empezar con http:// o https://: ${badUrl}` };

  const data = { contactIntro: String(formData.get("contactIntro") ?? "").trim() || null, ...lists };
  await getDb()
    .insert(about)
    .values({ id: 1, ...data })
    .onConflictDoUpdate({ target: about.id, set: data });
  refresh();
  return undefined;
}

/* ---------- Equipo ---------- */

const memberSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  role: z.string().trim(),
  photoUrl: url,
});

export async function saveMember(id: number | null, _: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = memberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  const db = getDb();

  if (id) await db.update(members).set(parsed.data).where(eq(members.id, id));
  else {
    const [{ m }] = await db.select({ m: max(members.sortOrder) }).from(members);
    await db.insert(members).values({ ...parsed.data, sortOrder: (m ?? -1) + 1 });
  }

  refresh();
  redirect("/admin/nosotros");
}

export async function deleteMember(id: number) {
  await requireAdmin();
  await getDb().delete(members).where(eq(members.id, id));
  refresh();
  redirect("/admin/nosotros");
}

/** Sube o baja un miembro un lugar; renumera todo para que el orden siempre sea consistente. */
export async function moveMember(id: number, dir: -1 | 1) {
  await requireAdmin();
  const db = getDb();
  const list = await db.select({ id: members.id }).from(members).orderBy(asc(members.sortOrder), asc(members.id));
  const i = list.findIndex((m) => m.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((m, idx) => db.update(members).set({ sortOrder: idx }).where(eq(members.id, m.id))));
  refresh();
}

/* ---------- Logo ---------- */

export async function saveLogo(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z.object({ logoUrl: url }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error);
  await getDb()
    .insert(about)
    .values({ id: 1, ...parsed.data })
    .onConflictDoUpdate({ target: about.id, set: parsed.data });
  refresh();
  return undefined;
}

/* ---------- Mensajes de contacto ---------- */

export async function setMessageRead(id: number, read: boolean) {
  await requireAdmin();
  await getDb().update(messages).set({ read }).where(eq(messages.id, id));
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await getDb().delete(messages).where(eq(messages.id, id));
  revalidatePath("/admin", "layout");
}
