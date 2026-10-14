import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { news } from "@/db/schema";
import { deleteNews, setNewsArchived } from "../../../actions";
import { NewsForm } from "@/components/admin/news-form";
import { ArchiveButton, DeleteButton } from "@/components/admin/ui";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "nuevo")
    return (
      <>
        <h1 className="display mb-8 text-3xl sm:text-4xl">Nueva novedad</h1>
        <NewsForm />
      </>
    );

  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [item] = await getDb().select().from(news).where(eq(news.id, n));
  if (!item) notFound();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl sm:text-4xl">
          {item.title}
          {item.archived && <span className="ml-3 align-middle text-xs uppercase tracking-widest text-muted">Archivada</span>}
        </h1>
        <div className="flex items-center gap-6">
          <ArchiveButton
            action={setNewsArchived.bind(null, item.id, !item.archived)}
            label={item.archived ? "Desarchivar" : "Archivar"}
          />
          {item.archived && <DeleteButton action={deleteNews.bind(null, item.id)} />}
        </div>
      </div>
      <NewsForm item={item} />
    </>
  );
}
