"use server";

import { z } from "zod";
import { getDb } from "@/db";
import { messages } from "@/db/schema";

export type ContactState = { ok?: boolean; error?: string } | undefined;

const schema = z.object({
  name: z.string().trim().min(1, "Ingresá tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(200),
  body: z.string().trim().min(10, "El mensaje es muy corto").max(5000),
});

export async function sendMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: los bots completan este campo oculto
  if (formData.get("website")) return { ok: true };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  try {
    await getDb().insert(messages).values(parsed.data);
  } catch (e) {
    console.error("[contact]", e);
    return { error: "No pudimos enviar tu mensaje. Probá de nuevo en un rato." };
  }
  return { ok: true };
}
