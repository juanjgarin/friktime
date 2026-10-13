import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { films } from "@/db/schema";
import { deleteFilm } from "../../../actions";
import { FilmForm } from "@/components/admin/film-form";
import { DeleteButton } from "@/components/admin/ui";

export default async function EditFilm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "nuevo")
    return (
      <>
        <h1 className="display mb-8 text-4xl">Nueva película</h1>
        <FilmForm />
      </>
    );

  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [film] = await getDb().select().from(films).where(eq(films.id, n));
  if (!film) notFound();

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">{film.title}</h1>
        <DeleteButton action={deleteFilm.bind(null, film.id)} />
      </div>
      <FilmForm film={film} />
    </>
  );
}
