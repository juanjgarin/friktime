import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX = 8 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await auth())) return Response.json({ error: "No autorizado" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return Response.json(
      { error: "Falta BLOB_READ_WRITE_TOKEN. Pegá una URL de imagen mientras tanto." },
      { status: 501 },
    );

  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/"))
    return Response.json({ error: "Archivo inválido" }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "Máximo 8 MB" }, { status: 400 });

  const blob = await put(`friktime/${file.name}`, file, { access: "public", addRandomSuffix: true });
  return Response.json({ url: blob.url });
}
