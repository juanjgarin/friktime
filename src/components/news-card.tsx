import Link from "next/link";
import { Img } from "./img";
import type { NewsItem } from "@/db/schema";
import { formatDate } from "@/lib/format";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/novedades/${item.slug}`} className="group block">
      <div className="aspect-video overflow-hidden rounded bg-zinc-900">
        {item.imageUrl && (
          <Img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-blood">{formatDate(item.publishedAt)}</p>
      <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-blood">{item.title}</h3>
      {item.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{item.excerpt}</p>}
    </Link>
  );
}
