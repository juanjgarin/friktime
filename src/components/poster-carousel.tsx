"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Img } from "./img";
import type { Film } from "@/db/schema";

export function PosterCarousel({ films }: { films: Film[] }) {
  const [ref, api] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });

  return (
    <div className="relative">
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-4">
          {films.map((f) => (
            <Link
              key={f.id}
              href={`/peliculas/${f.slug}`}
              className="group min-w-0 flex-[0_0_44%] sm:flex-[0_0_28%] md:flex-[0_0_20%] lg:flex-[0_0_16.5%]"
            >
              <div className="aspect-[2/3] overflow-hidden rounded bg-zinc-900">
                {f.posterUrl && (
                  <Img
                    src={f.posterUrl}
                    alt={f.title}
                    draggable={false}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide group-hover:text-blood">{f.title}</h3>
              {f.year && <p className="text-xs text-muted">{f.year}</p>}
            </Link>
          ))}
        </div>
      </div>
      {films.length > 4 && (
        <div className="mt-4 hidden justify-end gap-2 md:flex">
          {(["‹", "›"] as const).map((c, i) => (
            <button
              key={c}
              aria-label={i ? "Siguiente" : "Anterior"}
              onClick={() => (i ? api?.scrollNext() : api?.scrollPrev())}
              className="h-10 w-10 rounded-full border border-line text-xl hover:border-blood hover:text-blood"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
