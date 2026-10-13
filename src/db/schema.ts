import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
  year: integer("year"),
  // released | upcoming | production
  status: text("status").notNull().default("upcoming"),
  featured: boolean("featured").notNull().default(false),
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
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

// Fila única (id = 1): página "Nosotros" + datos de contacto/redes
export const about = pgTable("about", {
  id: integer("id").primaryKey().default(1),
  heading: text("heading").notNull().default("Nosotros"),
  body: text("body").notNull().default(""),
  imageUrl: text("image_url"),
  contactEmail: text("contact_email"),
  instagram: text("instagram"),
  x: text("x"),
  youtube: text("youtube"),
});

export type Film = typeof films.$inferSelect;
export type NewsItem = typeof news.$inferSelect;
export type About = typeof about.$inferSelect;
