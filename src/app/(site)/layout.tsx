import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Splash } from "@/components/splash";
import { getLogoUrl } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const logo = await getLogoUrl();
  return (
    <>
      <Splash logo={logo} />
      <SiteHeader logo={logo} />
      <main>{children}</main>
      <SiteFooter logo={logo} />
    </>
  );
}
