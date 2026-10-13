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
      <Field label="Email de contacto">
        <input name="contactEmail" type="email" defaultValue={data?.contactEmail ?? ""} className={inputCls} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Instagram (URL)">
          <input name="instagram" defaultValue={data?.instagram ?? ""} className={inputCls} />
        </Field>
        <Field label="X (URL)">
          <input name="x" defaultValue={data?.x ?? ""} className={inputCls} />
        </Field>
        <Field label="YouTube (URL)">
          <input name="youtube" defaultValue={data?.youtube ?? ""} className={inputCls} />
        </Field>
      </div>
    </ActionForm>
  );
}
