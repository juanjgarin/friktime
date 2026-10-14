"use client";

import { saveContact } from "../../actions";
import type { About } from "@/db/schema";
import { ActionForm, Field, ListField, inputCls } from "@/components/admin/ui";

export function ContactForm({ data }: { data?: About }) {
  return (
    <ActionForm action={saveContact}>
      <Field label="Texto de la página" hint="Párrafo introductorio sobre el formulario. Vacío = texto por defecto.">
        <textarea name="contactIntro" rows={4} defaultValue={data?.contactIntro ?? ""} className={inputCls} />
      </Field>
      <ListField
        name="contactEmails"
        label="Emails de contacto"
        type="email"
        placeholder="contacto@friktime.com"
        defaultValue={data?.contactEmails ?? []}
        addLabel="+ Agregar email"
        hint="Lo que quede vacío no se muestra en el sitio."
      />
      <ListField
        name="phones"
        label="Teléfonos"
        type="tel"
        placeholder="+54 9 11 1234 5678"
        defaultValue={data?.phones ?? []}
        addLabel="+ Agregar teléfono"
      />
      <ListField
        name="instagramUrls"
        label="Instagram (URLs)"
        type="url"
        placeholder="https://instagram.com/…"
        defaultValue={data?.instagramUrls ?? []}
        addLabel="+ Agregar Instagram"
      />
      <ListField
        name="xUrls"
        label="X (URLs)"
        type="url"
        placeholder="https://x.com/…"
        defaultValue={data?.xUrls ?? []}
        addLabel="+ Agregar X"
      />
      <ListField
        name="youtubeUrls"
        label="YouTube (URLs)"
        type="url"
        placeholder="https://youtube.com/…"
        defaultValue={data?.youtubeUrls ?? []}
        addLabel="+ Agregar YouTube"
      />
    </ActionForm>
  );
}
