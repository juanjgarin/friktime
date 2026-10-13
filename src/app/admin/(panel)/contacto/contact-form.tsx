"use client";

import { saveContact } from "../../actions";
import type { About } from "@/db/schema";
import { ActionForm, Field, inputCls } from "@/components/admin/ui";

export function ContactForm({ data }: { data?: About }) {
  return (
    <ActionForm action={saveContact}>
      <Field label="Texto de la página" hint="Párrafo introductorio sobre el formulario. Vacío = texto por defecto.">
        <textarea name="contactIntro" rows={4} defaultValue={data?.contactIntro ?? ""} className={inputCls} />
      </Field>
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
