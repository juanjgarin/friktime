"use client";

import { useActionState } from "react";
import { sendMessage } from "./actions";

const inputCls =
  "w-full rounded border border-line bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-blood";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, undefined);

  if (state?.ok)
    return (
      <div className="rounded border border-line bg-black/40 p-8">
        <p className="display text-3xl">¡Mensaje enviado!</p>
        <p className="mt-3 text-muted">Gracias por escribirnos. Te respondemos a la brevedad.</p>
      </div>
    );

  return (
    <form action={action} className="space-y-4">
      <input name="name" required maxLength={100} placeholder="Nombre" autoComplete="name" className={inputCls} />
      <input name="email" type="email" required maxLength={200} placeholder="Email" autoComplete="email" className={inputCls} />
      <textarea name="body" required minLength={10} maxLength={5000} rows={7} placeholder="Tu mensaje" className={inputCls} />
      {/* honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        disabled={pending}
        className="rounded bg-blood px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
