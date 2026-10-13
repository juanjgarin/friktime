import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { getPublishedNews } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "Novedades" };

export default async function NewsPage() {
  const news = await getPublishedNews();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="display mb-10 text-5xl sm:text-7xl">Novedades</h1>
      {news.length === 0 && <p className="text-muted">Todavía no hay novedades.</p>}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}
      </div>
    </div>
  );
}
