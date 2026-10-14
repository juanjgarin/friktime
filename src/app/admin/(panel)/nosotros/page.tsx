import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { about } from "@/db/schema";
import { getMembers } from "@/lib/queries";
import { AboutForm } from "./about-form";
import { TeamList } from "./team-list";

export default async function AboutAdmin() {
  const [[data], team] = await Promise.all([getDb().select().from(about).where(eq(about.id, 1)), getMembers()]);
  return (
    <>
      <h1 className="display mb-8 text-3xl sm:text-4xl">Nosotros</h1>
      <AboutForm data={data} />
      <TeamList list={team} />
    </>
  );
}
