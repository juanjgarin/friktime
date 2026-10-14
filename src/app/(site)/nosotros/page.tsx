import type { Metadata } from "next";
import { Img } from "@/components/img";
import { getAbout, getMembers } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "Nosotros" };

export default async function AboutPage() {
  const [about, team] = await Promise.all([getAbout(), getMembers()]);
  return (
    <>
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-28 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="display text-5xl sm:text-7xl">{about?.heading ?? "Nosotros"}</h1>
        <div className="prose-fk mt-8">
          <p>{about?.body}</p>
        </div>
        {about?.contactEmails.map((e) => (
          <a key={e} href={`mailto:${e}`} className="block font-semibold text-blood hover:underline">
            {e}
          </a>
        ))}
      </div>
      {about?.imageUrl && <Img src={about.imageUrl} alt="" className="w-full rounded object-cover" />}
    </div>
    {team.length > 0 && (
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="display mb-8 text-3xl sm:text-4xl">Equipo</h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {team.map((m) => (
            <li key={m.id}>
              {m.photoUrl ? (
                <Img src={m.photoUrl} alt={m.name} className="aspect-[2/3] w-full rounded object-cover" />
              ) : (
                <div className="aspect-[2/3] w-full rounded bg-zinc-900" />
              )}
              <p className="mt-3 font-semibold">{m.name}</p>
              {m.role && <p className="text-sm text-muted">{m.role}</p>}
            </li>
          ))}
        </ul>
      </section>
    )}
    </>
  );
}
