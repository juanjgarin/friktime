"use client";

import { saveNews } from "@/app/admin/actions";
import type { NewsItem } from "@/db/schema";
import { ActionForm, Field, ImageField, inputCls } from "./ui";

export function NewsForm({ item }: { item?: NewsItem }) {
  const date = (item?.publishedAt ?? new Date()).toISOString().slice(0, 10);
  return (
    <ActionForm action={saveNews.bind(null, item?.id ?? null)}>
      <Field label="Título *">
        <input name="title" required defaultValue={item?.title} className={inputCls} />
      </Field>
      <Field label="Resumen" hint="Se muestra en las tarjetas del listado">
        <textarea name="excerpt" rows={2} defaultValue={item?.excerpt ?? ""} className={inputCls} />
      </Field>
      <Field label="Contenido *">
        <textarea name="body" rows={12} required defaultValue={item?.body} className={inputCls} />
      </Field>
      <ImageField name="imageUrl" label="Imagen" defaultValue={item?.imageUrl} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Fecha de publicación">
          <input name="publishedAt" type="date" defaultValue={date} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={item?.published ?? true} className="accent-[#d90f1a]" />
          Publicada (visible en el sitio)
        </label>
      </div>
    </ActionForm>
  );
}
