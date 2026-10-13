import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { news } from "@/db/schema";
import { deleteNews } from "../../../actions";
import { NewsForm } from "@/components/admin/news-form";
import { DeleteButton } from "@/components/admin/ui";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "nuevo")
    return (
      <>
        <h1 className="display mb-8 text-4xl">Nueva novedad</h1>
        <NewsForm />
      </>
    );

  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [item] = await getDb().select().from(news).where(eq(news.id, n));
  if (!item) notFound();

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">{item.title}</h1>
        <DeleteButton action={deleteNews.bind(null, item.id)} />
      </div>
      <NewsForm item={item} />
    </>
  );
}
