"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, requireAdmin, signIn, signOut } from "@/auth";
import { getDb } from "@/db";
import { about, films, messages, news } from "@/db/schema";
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

/* ---------- Nosotros ---------- */

const aboutSchema = z.object({
  heading: z.string().trim().min(1, "El título es obligatorio"),
  body: z.string().trim(),
  imageUrl: url,
  contactEmail: optText,
  instagram: url,
  x: url,
  youtube: url,
});

export async function saveAbout(_: FormState, formData: FormData): Promise<FormState> {
  if (!(await auth())) redirect("/admin/login");
  const parsed = aboutSchema.safeParse(Object.fromEntries(formData));
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
