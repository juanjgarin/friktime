"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Img } from "./img";
import type { Film } from "@/db/schema";
import { statusLabels } from "@/lib/labels";

/**
 * Mobile: imagen alta arriba (con el logo encima) y título/botones DEBAJO, sobre fondo oscuro (como Blumhouse).
 * Desktop: imagen a pantalla casi completa con el texto superpuesto abajo a la izquierda.
 */
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
            const eager = i === 0 ? "eager" : "lazy";
            return (
              <article key={f.id} className="min-w-0 flex-[0_0_100%]">
                <div className="relative md:h-[90svh] md:min-h-[560px]">
                  {/* Imagen */}
                  <div className="relative h-[62svh] min-h-[380px] overflow-hidden md:absolute md:inset-0 md:h-auto">
                    {bg && (
                      <Img
                        src={bg}
                        loading={eager}
                        className={`absolute inset-0 h-full w-full object-cover ${f.bannerUrl ? "" : "scale-110 opacity-50 blur-xl"}`}
                      />
                    )}
                    {!f.bannerUrl && f.posterUrl && (
                      <Img
                        src={f.posterUrl}
                        loading={eager}
                        className="absolute inset-x-0 bottom-10 top-24 mx-auto h-[calc(100%-8.5rem)] w-auto rounded shadow-2xl shadow-black md:hidden"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-background" />
                    <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-transparent to-transparent md:block" />
                  </div>

                  {/* Texto */}
                  <div className="relative mx-auto -mt-10 max-w-7xl px-5 pb-12 sm:px-6 md:mt-0 md:flex md:h-full md:items-end md:gap-10 md:pb-24">
                    {!f.bannerUrl && f.posterUrl && (
                      <Img
                        src={f.posterUrl}
                        className="hidden h-[60%] w-auto rounded shadow-2xl shadow-black md:block"
                      />
                    )}
                    <div className="max-w-2xl">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-blood">
                        {statusLabels[f.status] ?? f.status}
                        {f.year ? ` · ${f.year}` : ""}
                      </p>
                      <h2 className="display text-6xl sm:text-7xl md:text-8xl">{f.title}</h2>
                      {f.tagline && <p className="mt-4 text-base text-foreground/80 sm:text-lg">{f.tagline}</p>}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={`/peliculas/${f.slug}`}
                          className="rounded bg-blood px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-700"
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
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 md:bottom-8">
          {films.map((f, i) => (
            <button
              key={f.id}
              onClick={() => go(i)}
              aria-label={`Ir a ${f.title}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-blood" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
