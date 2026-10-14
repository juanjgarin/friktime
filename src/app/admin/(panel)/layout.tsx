import { logoutAction } from "../actions";
import { requireAdmin } from "@/auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { getLogoUrl } from "@/lib/queries";

export const metadata = { title: "Panel", robots: { index: false } };

const links = [
  { href: "/admin/peliculas", label: "Contenido" },
  { href: "/admin/novedades", label: "Novedades" },
  { href: "/admin/nosotros", label: "Nosotros" },
  { href: "/admin/contacto", label: "Contacto" },
  { href: "/admin/logo", label: "Logo" },
  { href: "/admin/mensajes", label: "Mensajes" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <>
      <AdminHeader logo={await getLogoUrl()} links={links} email={session.user?.email} logoutAction={logoutAction} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </>
  );
}
