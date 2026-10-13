# Friktime

Sitio informativo de la productora + panel privado (`/admin`) para gestionar películas, novedades y "Nosotros".

**Stack:** Next.js (App Router) · Auth.js (credenciales) · Neon Postgres + Drizzle · Vercel Blob (imágenes) · Tailwind.

## Puesta en marcha

1. Crear una base Neon (Vercel → Storage → Neon, o neon.tech) y copiar `.env.example` a `.env.local`.
2. Completar `DATABASE_URL`, `AUTH_SECRET` (`npx auth secret`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   y, opcionalmente, `BLOB_READ_WRITE_TOKEN` (sin él se pueden pegar URLs de imagen).
3. ```bash
   npm run db:push   # crea las tablas
   npm run db:seed   # crea el usuario admin
   npm run dev
   ```
4. Panel: http://localhost:3000/admin

## Deploy en Vercel

Importar el repo, definir las mismas variables de entorno (menos `ADMIN_*`) y deployar.
Para crear el admin en producción, correr `db:seed` localmente con el `DATABASE_URL` de producción.
