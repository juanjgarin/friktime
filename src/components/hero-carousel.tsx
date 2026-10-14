"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Img } from "./img";
import type { Film } from "@/db/schema";
import { statusLabels } from "@/lib/labels";
import { filmLinks, safeUrl } from "@/lib/format";
import { useClipLoop } from "@/lib/use-clip-loop";

const SLIDE_MS = 7000;
const MAX_CLIP_MS = 15000;

/** Cuánto dura un slide: 7 s, o (con video) las vueltas completas del tramo que hagan falta para llegar a 7 s. */
function slideDelay(f: Film, durations: Record<number, number>) {
  if (!safeUrl(f.videoUrl)) return SLIDE_MS;
  const clip =
    f.videoStart != null && f.videoEnd != null ? f.videoEnd - f.videoStart : (durations[f.id] ?? SLIDE_MS / 1000);
  const clipMs = Math.min(Math.max(clip * 1000, 1000), MAX_CLIP_MS);
  return Math.ceil(SLIDE_MS / clipMs) * clipMs + 300; // +300 ms de margen para el arranque del video
}

/** Short en loop y sin sonido; solo corre el del slide activo (los demás quedan en pausa al inicio). */
function SlideVideo({
  src,
  start,
  end,
  active,
  eager,
  onDuration,
}: {
  src: string;
  start: number | null;
  end: number | null;
  active: boolean;
  eager: boolean;
  onDuration: (seconds: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (v.readyState >= 1) v.currentTime = start ?? 0; // al entrar o salir del slide, volver al principio del tramo
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active, start]);
  useClipLoop(ref, start, end, active);
  return (
    <video
      ref={ref}
      src={src}
      onLoadedMetadata={(e) => onDuration(e.currentTarget.duration)}
      muted
      loop
      playsInline
      autoPlay={eager}
      preload={eager ? "auto" : "metadata"}
      aria-hidden
      className="h-full w-full object-cover"
    />
  );
}

/**
 * Mobile: imagen alta arriba (con el logo encima) y título/botones DEBAJO, sobre fondo oscuro (como Blumhouse).
 * Desktop: imagen a pantalla casi completa con el texto superpuesto abajo a la izquierda.
 * Con video corto (vertical, 9:16): mobile lo muestra a pantalla completa del slide; desktop lo enmarca
 * vertical a la derecha, sobre la imagen de la película desenfocada.
 */
export function HeroCarousel({ films }: { films: Film[] }) {
  const [ref, api] = useEmblaCarousel({ loop: films.length > 1 });
  const [index, setIndex] = useState(0);
  const [durations, setDurations] = useState<Record<number, number>>({}); // duración real de cada video (segundos)

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Avance automático: 7 s por slide; con video, esperar a que termine una vuelta completa del tramo.
  useEffect(() => {
    if (!api || films.length < 2) return;
    const timer = setTimeout(() => api.scrollNext(), slideDelay(films[index], durations));
    return () => clearTimeout(timer);
  }, [api, films, index, durations]);

  const go = useCallback((i: number) => api?.scrollTo(i), [api]);

  return (
    <section className="relative">
      <div ref={ref} className="overflow-hidden">
        <div className="flex">
          {films.map((f, i) => {
            const bg = f.bannerUrl || f.posterUrl;
            const eager = i === 0 ? "eager" : "lazy";
            const video = safeUrl(f.videoUrl);
            return (
              <article key={f.id} className="min-w-0 flex-[0_0_100%]">
                <div className="relative md:h-[90svh] md:min-h-[560px]">
                  {/* Imagen */}
                  <div className="relative h-[62svh] min-h-[380px] overflow-hidden md:absolute md:inset-0 md:h-auto">
                    {bg && (
                      <Img
                        src={bg}
                        loading={eager}
                        className={`absolute inset-0 h-full w-full object-cover ${
                          f.bannerUrl && !video ? "" : "scale-110 opacity-50 blur-xl"
                        }`}
                      />
                    )}
                    {video && (
                      <div className="absolute inset-0 overflow-hidden bg-black md:inset-auto md:bottom-12 md:right-[10%] md:top-24 md:aspect-[9/16] md:rounded-lg md:shadow-2xl md:shadow-black">
                        <SlideVideo
                          src={video}
                          start={f.videoStart ?? null}
                          end={f.videoEnd ?? null}
                          active={i === index}
                          eager={i === 0}
                          onDuration={(d) => setDurations((m) => (m[f.id] === d ? m : { ...m, [f.id]: d }))}
                        />
                      </div>
                    )}
                    {!video && !f.bannerUrl && f.posterUrl && (
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
                    {!video && !f.bannerUrl && f.posterUrl && (
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
                          Más info
                        </Link>
                        {filmLinks(f).map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:border-white"
                          >
                            {l.label}
                          </a>
                        ))}
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
