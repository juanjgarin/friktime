import { getAbout } from "@/lib/queries";
import { LogoForm } from "./logo-form";

export default async function LogoAdmin() {
  const data = await getAbout();
  return (
    <>
      <h1 className="display mb-8 text-3xl sm:text-4xl">Logo</h1>
      <p className="mb-6 text-sm text-muted">
        Se muestra en el encabezado, el pie de página, la pantalla de entrada y el panel. Conviene un PNG o WebP con
        fondo transparente y texto claro (el sitio es oscuro). Si lo dejás vacío se usa el logo original.
      </p>
      <LogoForm logoUrl={data?.logoUrl} />
    </>
  );
}
