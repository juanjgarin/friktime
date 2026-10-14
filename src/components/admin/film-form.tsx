"use client";

import { saveFilm } from "@/app/admin/actions";
import type { Film } from "@/db/schema";
import { ActionForm, Field, ImageField, inputCls } from "./ui";
import { VideoField } from "./video-field";

export function FilmForm({ film }: { film?: Film }) {
  return (
    <ActionForm action={saveFilm.bind(null, film?.id ?? null)}>
      <Field label="Título *">
        <input name="title" required defaultValue={film?.title} className={inputCls} />
      </Field>
      <Field label="Frase / tagline">
        <input name="tagline" defaultValue={film?.tagline ?? ""} className={inputCls} />
      </Field>
      <Field label="Sinopsis">
        <textarea name="synopsis" rows={6} defaultValue={film?.synopsis ?? ""} className={inputCls} />
      </Field>
      <ImageField name="posterUrl" label="Portada (vertical, 2:3)" defaultValue={film?.posterUrl} aspect="2:3" />
      <ImageField name="bannerUrl" label="Banner (horizontal, opcional — se usa en el carrusel principal)" defaultValue={film?.bannerUrl} aspect="16:9" />
      <VideoField
        name="videoUrl"
        startName="videoStart"
        endName="videoEnd"
        label="Video corto en loop (opcional — se muestra en el carrusel principal)"
        defaultValue={film?.videoUrl}
        defaultStart={film?.videoStart}
        defaultEnd={film?.videoEnd}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Short (URL)" hint="Botón «Ver short»">
          <input name="shortUrl" defaultValue={film?.shortUrl ?? ""} placeholder="https://instagram.com/reel/…" className={inputCls} />
        </Field>
        <Field label="Tráiler (URL)" hint="Botón «Ver tráiler»">
          <input name="trailerUrl" defaultValue={film?.trailerUrl ?? ""} placeholder="https://youtube.com/…" className={inputCls} />
        </Field>
        <Field label="Adelanto (URL)" hint="Botón «Ver adelanto»">
          <input name="teaserUrl" defaultValue={film?.teaserUrl ?? ""} placeholder="https://…" className={inputCls} />
        </Field>
        <Field label="Backstage (URL)" hint="Botón «Ver backstage»">
          <input name="backstageUrl" defaultValue={film?.backstageUrl ?? ""} placeholder="https://…" className={inputCls} />
        </Field>
      </div>
      <p className="-mt-3 text-xs text-muted">Los botones solo aparecen si cargás el link. «Más info» siempre está.</p>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Año">
          <input name="year" type="number" defaultValue={film?.year ?? ""} className={inputCls} />
        </Field>
        <Field label="Estado">
          <select name="status" defaultValue={film?.status ?? "upcoming"} className={inputCls}>
            <option value="released">Estrenada</option>
            <option value="upcoming">Próximamente</option>
            <option value="production">En producción</option>
          </select>
        </Field>
        <Field label="Orden" hint="Menor = primero">
          <input name="sortOrder" type="number" defaultValue={film?.sortOrder ?? 0} className={inputCls} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={film?.featured} className="accent-[#d90f1a]" />
        Destacar en el carrusel principal del inicio
      </label>
    </ActionForm>
  );
}
