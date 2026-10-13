"use client";

import { useActionState, useState, useTransition } from "react";
import type { FormState } from "@/app/admin/actions";

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
      <button disabled={pending} className={btnCls}>
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

/** Subida de imagen (Vercel Blob) o URL pegada a mano. */
export function ImageField({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState("");
  const [uploading, startUpload] = useTransition();

  function onFile(file?: File) {
    if (!file) return;
    setError("");
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
          <input
            className={inputCls}
            placeholder="https://… (URL de imagen)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex items-center gap-3 text-xs text-muted">
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            {uploading && <span>Subiendo…</span>}
            {value && (
              <button type="button" onClick={() => setValue("")} className="hover:text-blood">
                Quitar
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
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
