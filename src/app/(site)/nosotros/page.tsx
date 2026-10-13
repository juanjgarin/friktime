import type { Metadata } from "next";
import { Img } from "@/components/img";
import { getAbout } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "Nosotros" };

export default async function AboutPage() {
  const about = await getAbout();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="display text-5xl sm:text-7xl">{about?.heading ?? "Nosotros"}</h1>
        <div className="prose-fk mt-8">
          <p>{about?.body}</p>
        </div>
        {about?.contactEmail && (
          <a href={`mailto:${about.contactEmail}`} className="font-semibold text-blood hover:underline">
            {about.contactEmail}
          </a>
        )}
      </div>
      {about?.imageUrl && <Img src={about.imageUrl} alt="" className="w-full rounded object-cover" />}
    </div>
  );
}
