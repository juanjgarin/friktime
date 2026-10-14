import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { films } from "@/db/schema";
import { deleteFilm, setFilmArchived } from "../../../actions";
import { FilmForm } from "@/components/admin/film-form";
import { ArchiveButton, DeleteButton } from "@/components/admin/ui";

export default async function EditFilm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "nuevo")
    return (
      <>
        <h1 className="display mb-8 text-3xl sm:text-4xl">Nuevo contenido</h1>
        <FilmForm />
      </>
    );

  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [film] = await getDb().select().from(films).where(eq(films.id, n));
  if (!film) notFound();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl sm:text-4xl">
          {film.title}
          {film.archived && <span className="ml-3 align-middle text-xs uppercase tracking-widest text-muted">Archivada</span>}
        </h1>
        <div className="flex items-center gap-6">
          <ArchiveButton
            action={setFilmArchived.bind(null, film.id, !film.archived)}
            label={film.archived ? "Desarchivar" : "Archivar"}
          />
          {film.archived && <DeleteButton action={deleteFilm.bind(null, film.id)} />}
        </div>
      </div>
      <FilmForm film={film} />
    </>
  );
}
