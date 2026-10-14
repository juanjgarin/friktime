"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

const btnCls =
  "rounded bg-blood px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 disabled:opacity-50";

export const ASPECTS = [
  { id: "2:3", label: "Vertical 2:3", ratio: 2 / 3 },
  { id: "16:9", label: "Horizontal 16:9", ratio: 16 / 9 },
  { id: "1:1", label: "Cuadrada 1:1", ratio: 1 },
  { id: "original", label: "Original", ratio: 0 },
] as const;
export type AspectId = (typeof ASPECTS)[number]["id"];

const MAX_SIDE = 2000; // evita subir fotos de celular de 10+ MB

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = src;
  });
}

/** Recorta `src` al área elegida y devuelve un archivo listo para subir (PNG si tenía transparencia posible, JPEG si no). */
async function cropToFile(src: string, area: Area, file: File): Promise<File> {
  const img = await loadImage(src);
  const scale = Math.min(1, MAX_SIDE / Math.max(area.width, area.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);

  const keepAlpha = file.type === "image/png" || file.type === "image/webp";
  const type = keepAlpha ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.9));
  if (!blob) throw new Error("No se pudo procesar la imagen");
  const base = file.name.replace(/\.[^.]+$/, "") || "imagen";
  return new File([blob], `${base}.${keepAlpha ? "png" : "jpg"}`, { type });
}

export function ImageCropper({
  file,
  initialAspect,
  onCancel,
  onDone,
}: {
  file: File;
  initialAspect: AspectId;
  onCancel: () => void;
  onDone: (cropped: File) => void;
}) {
  const [src] = useState(() => URL.createObjectURL(file));
  const [aspectId, setAspectId] = useState<AspectId>(initialAspect);
  const [natural, setNatural] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const opt = ASPECTS.find((a) => a.id === aspectId)!;
  const aspect = opt.ratio || natural;

  const onComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  async function apply() {
    if (!area) return;
    setBusy(true);
    setError("");
    try {
      const cropped = await cropToFile(src, area, file);
      URL.revokeObjectURL(src);
      onDone(cropped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al recortar");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="flex max-h-full w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded border border-line bg-zinc-950 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {ASPECTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setAspectId(a.id);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                a.id === aspectId ? "border-blood bg-blood text-white" : "border-line text-muted hover:text-white"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="relative h-[50vh] min-h-64 w-full overflow-hidden rounded bg-black">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onComplete}
            onMediaLoaded={(m) => setNatural(m.naturalWidth / m.naturalHeight)}
            objectFit="contain"
          />
        </div>

        <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
          Zoom
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#d90f1a]"
          />
        </label>
        <p className="text-xs text-muted">Arrastrá la imagen para elegir qué parte mostrar.</p>
        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex flex-wrap items-center justify-end gap-4">
          <button type="button" onClick={() => {
              URL.revokeObjectURL(src);
              onCancel();
            }} disabled={busy} className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-white">
            Cancelar
          </button>
          <button type="button" onClick={apply} disabled={busy || !area} className={btnCls}>
            {busy ? "Procesando…" : "Recortar y subir"}
          </button>
        </div>
      </div>
    </div>
  );
}
