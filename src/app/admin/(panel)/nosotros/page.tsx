import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { about } from "@/db/schema";
import { AboutForm } from "./about-form";

export default async function AboutAdmin() {
  const [data] = await getDb().select().from(about).where(eq(about.id, 1));
  return (
    <>
      <h1 className="display mb-8 text-4xl">Nosotros</h1>
      <AboutForm data={data} />
    </>
  );
}
