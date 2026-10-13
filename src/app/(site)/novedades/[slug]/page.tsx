import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/img";
import { getNewsBySlug } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsBySlug((await params).slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt ?? undefined,
    openGraph: item.imageUrl ? { images: [item.imageUrl] } : undefined,
  };
}

export default async function NewsItemPage({ params }: Props) {
  const item = await getNewsBySlug((await params).slug);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/novedades" className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-blood">
        ← Novedades
      </Link>
      <p className="mt-8 text-xs uppercase tracking-widest text-blood">{formatDate(item.publishedAt)}</p>
      <h1 className="display mt-2 text-4xl sm:text-6xl">{item.title}</h1>
      {item.imageUrl && <Img src={item.imageUrl} alt={item.title} loading="eager" className="mt-8 w-full rounded" />}
      <div className="prose-fk mt-8">
        <p>{item.body}</p>
      </div>
    </article>
  );
}
