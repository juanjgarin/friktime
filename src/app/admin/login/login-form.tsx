"use client";

import { ActionForm, Field, inputCls } from "@/components/admin/ui";
import { loginAction } from "../actions";

export function LoginForm() {
  return (
    <ActionForm action={loginAction} submitLabel="Ingresar">
      <Field label="Email">
        <input name="email" type="email" required autoComplete="username" className={inputCls} />
      </Field>
      <Field label="Contraseña">
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </Field>
    </ActionForm>
  );
}
