import { boolean, integer, pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  synopsis: text("synopsis"),
  posterUrl: text("poster_url"),
  bannerUrl: text("banner_url"),
  trailerUrl: text("trailer_url"),
  shortUrl: text("short_url"),
  teaserUrl: text("teaser_url"),
  backstageUrl: text("backstage_url"),
  year: integer("year"),
  // released | upcoming | production
  status: text("status").notNull().default("upcoming"),
  featured: boolean("featured").notNull().default(false),
  // Short vertical (≤10 s) que se reproduce en loop en el carrusel principal.
  videoUrl: text("video_url"),
  // Tramo (en segundos) que se reproduce en loop; null = el video entero.
  videoStart: real("video_start"),
  videoEnd: real("video_end"),
  archived: boolean("archived").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: text("body").notNull().default(""),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(true),
  archived: boolean("archived").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

// Fila única (id = 1): página "Nosotros" + datos de contacto/redes
export const about = pgTable("about", {
  id: integer("id").primaryKey().default(1),
  heading: text("heading").notNull().default("Nosotros"),
  body: text("body").notNull().default(""),
  imageUrl: text("image_url"),
  logoUrl: text("logo_url"),
  contactIntro: text("contact_intro"),
  contactEmail: text("contact_email"),
  instagram: text("instagram"),
  x: text("x"),
  youtube: text("youtube"),
  // Listas (se pueden cargar varios). Reemplazan a contactEmail/instagram/x/youtube, que quedan solo por compatibilidad.
  contactEmails: text("contact_emails").array().notNull().default([]),
  phones: text("phones").array().notNull().default([]),
  instagramUrls: text("instagram_urls").array().notNull().default([]),
  xUrls: text("x_urls").array().notNull().default([]),
  youtubeUrls: text("youtube_urls").array().notNull().default([]),
});

// Equipo de la página "Nosotros"
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Member = typeof members.$inferSelect;
export type Film = typeof films.$inferSelect;
export type NewsItem = typeof news.$inferSelect;
export type About = typeof about.$inferSelect;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = typeof messages.$inferSelect;
