import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";

const MAX = 30 * 1024 * 1024;

/** El navegador pide acá un token y sube el video directo al Blob (sin pasar por la función). */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const res = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await auth())) throw new Error("No autorizado");
        return {
          allowedContentTypes: ["video/mp4", "video/webm"],
          maximumSizeInBytes: MAX,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(res);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Error al subir" }, { status: 400 });
  }
}
