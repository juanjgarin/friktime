import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Splash } from "@/components/splash";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Splash />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
