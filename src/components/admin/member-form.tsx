"use client";

import { saveMember } from "@/app/admin/actions";
import type { Member } from "@/db/schema";
import { ActionForm, Field, ImageField, inputCls } from "./ui";

export function MemberForm({ member }: { member?: Member }) {
  return (
    <ActionForm action={saveMember.bind(null, member?.id ?? null)}>
      <Field label="Nombre *">
        <input name="name" required defaultValue={member?.name} className={inputCls} />
      </Field>
      <Field label="Rol" hint="Ej.: Dirección, Guion, Producción">
        <input name="role" defaultValue={member?.role ?? ""} className={inputCls} />
      </Field>
      <ImageField name="photoUrl" label="Foto" defaultValue={member?.photoUrl} aspect="2:3" />
    </ActionForm>
  );
}
