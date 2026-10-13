"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Img } from "./img";
import type { Film } from "@/db/schema";
import { statusLabels } from "@/lib/labels";

export function HeroCarousel({ films }: { films: Film[] }) {
  const [ref, api] = useEmblaCarousel({ loop: films.length > 1 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    const timer = films.length > 1 ? setInterval(() => api.scrollNext(), 7000) : undefined;
    return () => {
      api.off("select", onSelect);
      clearInterval(timer);
    };
  }, [api, films.length]);

  const go = useCallback((i: number) => api?.scrollTo(i), [api]);

  return (
    <section className="relative">
      <div ref={ref} className="overflow-hidden">
        <div className="flex">
          {films.map((f, i) => {
            const bg = f.bannerUrl || f.posterUrl;
            return (
              <article key={f.id} className="relative min-w-0 flex-[0_0_100%]">
                <div className="relative h-[80svh] min-h-[480px] w-full md:h-[88svh]">
                  {bg && (
                    <Img
                      src={bg}
                      loading={i === 0 ? "eager" : "lazy"}
                      className={`absolute inset-0 h-full w-full object-cover ${f.bannerUrl ? "" : "scale-110 blur-xl opacity-60"}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                  <div className="relative mx-auto flex h-full max-w-7xl items-end gap-10 px-4 pb-20 sm:px-6 md:pb-24">
                    {!f.bannerUrl && f.posterUrl && (
                      <Img
                        src={f.posterUrl}
                        className="hidden h-[60%] w-auto rounded shadow-2xl shadow-black md:block"
                      />
                    )}
                    <div className="max-w-2xl">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blood">
                        {statusLabels[f.status] ?? f.status}
                        {f.year ? ` · ${f.year}` : ""}
                      </p>
                      <h2 className="display text-5xl sm:text-7xl md:text-8xl">{f.title}</h2>
                      {f.tagline && <p className="mt-4 text-base text-foreground/80 sm:text-lg">{f.tagline}</p>}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={`/peliculas/${f.slug}`}
                          className="rounded bg-blood px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
                        >
                          Ver película
                        </Link>
                        {f.trailerUrl && (
                          <a
                            href={f.trailerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:border-white"
                          >
                            Tráiler
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {films.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {films.map((f, i) => (
            <button
              key={f.id}
              onClick={() => go(i)}
              aria-label={`Ir a ${f.title}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-blood" : "w-3 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
