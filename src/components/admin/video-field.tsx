"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useClipLoop } from "@/lib/use-clip-loop";
import { inputCls } from "./ui";

const MAX_MB = 30;
const MAX_CLIP = 10; // segundos
const MIN_CLIP = 0.5;
const RECOMMENDED_MAX = 20; // segundos: más que esto pesa de más aunque solo se muestre un tramo
const TYPES = ["video/mp4", "video/webm"];

type Range = { start: number; end: number };
const sec = (n: number) => `${n.toFixed(1)} s`;

/** Duración de un archivo local, para avisar antes de subirlo. null si el navegador no puede leerla. */
function readDuration(file: File) {
  return new Promise<number | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    const done = (d: number | null) => {
      URL.revokeObjectURL(url);
      resolve(d);
    };
    v.preload = "metadata";
    v.onloadedmetadata = () => done(Number.isFinite(v.duration) ? v.duration : null);
    v.onerror = () => done(null);
    v.src = url;
  });
}

/**
 * Subida directa de video (Vercel Blob) o URL a mano, con recorte "virtual": se elige el tramo (máx. 10 s)
 * y el sitio reproduce solo ese tramo en loop. El archivo no se modifica, así que el tramo se puede reajustar.
 */
export function VideoField({
  name,
  startName,
  endName,
  label,
  defaultValue,
  defaultStart,
  defaultEnd,
}: {
  name: string;
  startName: string;
  endName: string;
  label: string;
  defaultValue?: string | null;
  defaultStart?: number | null;
  defaultEnd?: number | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [duration, setDuration] = useState<number | null>(null);
  const [range, setRange] = useState<Range | null>(
    defaultStart != null && defaultEnd != null ? { start: defaultStart, end: defaultEnd } : null,
  );
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [localDuration, setLocalDuration] = useState<number | null>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const uploading = progress !== null;
  const longBy = duration ?? localDuration;
  const tooLong = longBy !== null && longBy > RECOMMENDED_MAX;

  useClipLoop(preview, range?.start ?? null, range?.end ?? null, !!value);

  function changeVideo(url: string) {
    setLocalDuration(null);
    setValue(url);
    setDuration(null);
    setRange(null); // se recalcula al cargar los metadatos del video nuevo
  }

  function onMeta(d: number) {
    setDuration(d);
    setRange((r) => r ?? { start: 0, end: Math.min(MAX_CLIP, d) });
  }

  function setStart(start: number) {
    if (!range || duration == null) return;
    const end = Math.min(duration, Math.max(range.end, start + MIN_CLIP), start + MAX_CLIP);
    setRange({ start, end });
  }
  function setEnd(end: number) {
    if (!range) return;
    setRange({ start: Math.max(range.start, end - MAX_CLIP), end });
  }

  // Si el tramo abarca todo el video no hace falta guardarlo.
  const whole = !range || (duration != null && range.start <= 0.05 && range.end >= duration - 0.05);
  const saved = whole ? null : range;

  async function onFile(file?: File) {
    if (!file) return;
    setError("");
    if (!TYPES.includes(file.type)) return setError("Formato no soportado: subí un MP4 o WebM.");
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Pesa demasiado: máximo ${MAX_MB} MB. Conviene comprimirlo.`);

    setLocalDuration(await readDuration(file)); // el aviso aparece antes de subir
    setProgress(0);
    try {
      const blob = await upload(`friktime/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload/video",
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      changeVideo(blob.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el video");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
      <input type="hidden" name={name} value={value} />
      <input type="hidden" name={startName} value={value && saved ? saved.start.toFixed(2) : ""} />
      <input type="hidden" name={endName} value={value && saved ? saved.end.toFixed(2) : ""} />

      {value && (
        <video
          ref={preview}
          key={value}
          src={value}
          muted
          loop
          autoPlay
          playsInline
          onLoadedMetadata={(e) => onMeta(e.currentTarget.duration)}
          className="mb-3 max-h-72 rounded border border-line bg-black"
        />
      )}

      {value && range && duration != null && (
        <div className="mb-3 space-y-2 rounded border border-line p-3">
          <p className="text-xs uppercase tracking-widest text-muted">
            Tramo que se muestra:{" "}
            <span className="font-bold text-white">
              {sec(range.start)} → {sec(range.end)}
            </span>{" "}
            ({sec(range.end - range.start)}, máx. {MAX_CLIP} s · el video dura {sec(duration)})
          </p>
          <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
            <span className="w-12">Inicio</span>
            <input
              type="range"
              min={0}
              max={Math.max(0, duration - MIN_CLIP)}
              step={0.1}
              value={range.start}
              onChange={(e) => setStart(Number(e.target.value))}
              className="flex-1 accent-[#d90f1a]"
            />
          </label>
          <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
            <span className="w-12">Fin</span>
            <input
              type="range"
              min={MIN_CLIP}
              max={duration}
              step={0.1}
              value={range.end}
              onChange={(e) => setEnd(Math.max(Number(e.target.value), range.start + MIN_CLIP))}
              className="flex-1 accent-[#d90f1a]"
            />
          </label>
        </div>
      )}

      {tooLong && (
        <p role="alert" className="mb-3 rounded border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          ⚠ Este video dura {sec(longBy)}. Conviene mantener los videos por debajo de {RECOMMENDED_MAX} segundos: el archivo se
          descarga completo aunque solo se muestre el tramo elegido, y pesa de más en el celular y en tu cuota de almacenamiento.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded border border-line bg-zinc-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:border-blood hover:text-blood ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
          {uploading ? `Subiendo… ${progress}%` : value ? "Cambiar video" : "Subir video"}
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {value && !uploading && (
          <button type="button" onClick={() => changeVideo("")} className="text-xs text-muted hover:text-blood">
            Quitar
          </button>
        )}
      </div>
      {uploading && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded bg-zinc-800">
          <div className="h-full bg-blood transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <input
        className={`${inputCls} mt-3 text-xs`}
        placeholder="…o pegá una URL de video (https://… .mp4)"
        value={value}
        onChange={(e) => changeVideo(e.target.value)}
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <p className="mt-2 text-xs text-muted">
        Ideal: vertical 9:16 y de menos de {RECOMMENDED_MAX} segundos. MP4 o WebM, hasta {MAX_MB} MB. Se reproduce sin sonido y en
        loop; elegí qué tramo mostrar (máx. {MAX_CLIP} s).
      </p>
    </div>
  );
}
