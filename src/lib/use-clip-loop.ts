import { useEffect, type RefObject } from "react";

/**
 * Reproduce en loop solo el tramo [start, end] de un video (recorte "virtual": el archivo no se modifica).
 * Sin tramo (null) no hace nada y se usa el `loop` normal del <video>.
 */
export function useClipLoop(
  ref: RefObject<HTMLVideoElement | null>,
  start: number | null,
  end: number | null,
  active = true,
) {
  useEffect(() => {
    const v = ref.current;
    if (!v || !active || start == null || end == null) return;

    const toStart = () => {
      v.currentTime = start;
    };
    if (v.readyState >= 1) toStart();
    else v.addEventListener("loadedmetadata", toStart, { once: true });

    let id = requestAnimationFrame(function tick() {
      // Pasó el final del tramo, o el `loop` nativo reinició el archivo desde 0: volver al inicio del tramo.
      if (v.currentTime >= end || v.currentTime < start - 0.1) v.currentTime = start;
      id = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(id);
      v.removeEventListener("loadedmetadata", toStart);
    };
  }, [ref, start, end, active]);
}
