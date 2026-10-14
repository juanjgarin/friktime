"use client";

import { useActionState, useState, useTransition } from "react";
import type { FormState } from "@/app/admin/actions";
import { ImageCropper, type AspectId } from "./image-cropper";

export const inputCls =
  "w-full rounded border border-line bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-blood";
export const btnCls =
  "rounded bg-blood px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 disabled:opacity-50";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

/** Formulario con estado de error/pendiente para server actions. */
export function ActionForm({
  action,
  children,
  submitLabel = "Guardar",
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-5">
      {children}
      {state?.error && <p className="rounded border border-blood/60 bg-blood/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}
      <button disabled={pending} className={`${btnCls} w-full sm:w-auto`}>
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

let itemId = 0;
const makeItem = (value = "") => ({ id: itemId++, value });

/** Campo con varios valores: un input por valor (todos con el mismo name), con agregar/quitar. Los vacíos se ignoran al guardar. */
export function ListField({
  name,
  label,
  hint,
  defaultValue,
  type = "text",
  placeholder,
  addLabel = "+ Agregar",
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue: string[];
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  addLabel?: string;
}) {
  const [items, setItems] = useState(() => (defaultValue.length ? defaultValue : [""]).map(makeItem));

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex gap-2">
            <input
              name={name}
              type={type}
              value={it.value}
              placeholder={placeholder}
              onChange={(e) => setItems((l) => l.map((x) => (x.id === it.id ? { ...x, value: e.target.value } : x)))}
              className={inputCls}
            />
            <button
              type="button"
              aria-label="Quitar"
              onClick={() => setItems((l) => (l.length > 1 ? l.filter((x) => x.id !== it.id) : [makeItem()]))}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded border border-line text-muted hover:border-blood hover:text-blood"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setItems((l) => [...l, makeItem()])}
        className="mt-2 text-xs font-semibold uppercase tracking-widest text-white hover:text-blood"
      >
        {addLabel}
      </button>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </div>
  );
}

/** Subida de imagen (Vercel Blob) o URL pegada a mano. */
export function ImageField({
  name,
  label,
  defaultValue,
  aspect = "original",
  crop = true,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  /** Proporción sugerida al abrir el recorte (se puede cambiar ahí). */
  aspect?: AspectId;
  /** false = subir tal cual, sin recorte (p. ej. el logo con transparencia). */
  crop?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [pending, setPending] = useState<File | null>(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [error, setError] = useState("");
  const [uploading, startUpload] = useTransition();

  // GIF/SVG no se recortan: se perdería la animación / el vector.
  const croppable = (f: File) => crop && ["image/jpeg", "image/png", "image/webp"].includes(f.type);

  function onFile(file?: File) {
    if (!file) return;
    setError("");
    if (croppable(file)) setPending(file);
    else upload(file);
  }

  /** Reabre el recorte sobre la imagen ya cargada (se descarga y se sube de nuevo ya ajustada). */
  async function adjust() {
    setError("");
    setLoadingCurrent(true);
    try {
      const res = await fetch(value, { cache: "no-store" });
      const blob = await res.blob();
      if (!res.ok || !blob.type.startsWith("image/")) throw new Error();
      const file = new File([blob], value.split("?")[0].split("/").pop() || "imagen", { type: blob.type });
      if (!croppable(file)) throw new Error("Este formato no se puede ajustar");
      setPending(file);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "No se pudo abrir la imagen para ajustarla (puede venir de otro sitio). Subí el archivo de nuevo.",
      );
    } finally {
      setLoadingCurrent(false);
    }
  }

  function upload(file: File) {
    startUpload(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setValue(data.url);
      else setError(data.error ?? "Error al subir");
    });
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-28 w-auto max-w-40 rounded border border-line object-cover" />
        )}
        <div className="flex-1 space-y-2">
          <input type="hidden" name={name} value={value} />
          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex cursor-pointer items-center gap-2 rounded border border-line bg-zinc-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:border-blood hover:text-blood ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
              {uploading ? "Subiendo…" : value ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {value && crop && !uploading && (
              <button
                type="button"
                onClick={adjust}
                disabled={loadingCurrent}
                className="text-xs font-semibold uppercase tracking-widest text-white hover:text-blood disabled:opacity-50"
              >
                {loadingCurrent ? "Abriendo…" : "Ajustar"}
              </button>
            )}
            {value && !uploading && (
              <button type="button" onClick={() => setValue("")} className="text-xs text-muted hover:text-blood">
                Quitar
              </button>
            )}
          </div>
          <input
            className={`${inputCls} text-xs`}
            placeholder="…o pegá una URL de imagen (https://…)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
      {pending && (
        <ImageCropper
          file={pending}
          initialAspect={aspect}
          onCancel={() => setPending(null)}
          onDone={(f) => {
            setPending(null);
            upload(f);
          }}
        />
      )}
    </div>
  );
}

/** Archivar / desarchivar: reversible, por eso sin confirmación. */
export function ArchiveButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <form action={action}>
      <button className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground">{label}</button>
    </form>
  );
}

/** Filtro simple Activas / Todas por query string (?ver=todas). */
export function ArchiveFilter({ href, showAll }: { href: string; showAll: boolean }) {
  const cls = (on: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
      on ? "border-blood bg-blood text-white" : "border-line text-muted hover:text-foreground"
    }`;
  return (
    <div className="mb-4 flex gap-2">
      <a href={href} className={cls(!showAll)}>
        Activas
      </a>
      <a href={`${href}?ver=todas`} className={cls(showAll)}>
        Todas
      </a>
    </div>
  );
}

export function DeleteButton({ action, label = "Eliminar" }: { action: () => Promise<void>; label?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("¿Seguro? Esta acción no se puede deshacer.")) e.preventDefault();
      }}
    >
      <button className="text-xs font-semibold uppercase tracking-widest text-red-400 hover:text-red-300">{label}</button>
    </form>
  );
}
