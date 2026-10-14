"use client";

import { saveLogo } from "../../actions";
import { ActionForm, ImageField } from "@/components/admin/ui";

export function LogoForm({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <ActionForm action={saveLogo}>
      <ImageField name="logoUrl" label="Logo del sitio" defaultValue={logoUrl} />
    </ActionForm>
  );
}
