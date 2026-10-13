"use client";

import { saveAbout } from "../../actions";
import type { About } from "@/db/schema";
import { ActionForm, Field, ImageField, inputCls } from "@/components/admin/ui";

export function AboutForm({ data }: { data?: About }) {
  return (
    <ActionForm action={saveAbout}>
      <Field label="Título">
        <input name="heading" required defaultValue={data?.heading ?? "Nosotros"} className={inputCls} />
      </Field>
      <Field label="Texto">
        <textarea name="body" rows={12} defaultValue={data?.body ?? ""} className={inputCls} />
      </Field>
      <ImageField name="imageUrl" label="Imagen" defaultValue={data?.imageUrl} />
    </ActionForm>
  );
}
