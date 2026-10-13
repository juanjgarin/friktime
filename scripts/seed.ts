import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

async function main() {
  const { getDb } = await import("../src/db");
  const { users, about } = await import("../src/db/schema");
  const db = getDb();

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env.local");

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length) {
    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    console.log(`Contraseña actualizada para ${email}`);
  } else {
    await db.insert(users).values({ email, passwordHash });
    console.log(`Usuario admin creado: ${email}`);
  }

  await db
    .insert(about)
    .values({
      id: 1,
      heading: "Nosotros",
      body: "Somos Friktime, una productora de cine de terror.",
    })
    .onConflictDoNothing();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
