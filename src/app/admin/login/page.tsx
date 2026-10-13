import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Img } from "@/components/img";
import { LoginForm } from "./login-form";

export const metadata = { title: "Ingresar", robots: { index: false } };

export default async function LoginPage() {
  if (await auth()) redirect("/admin");
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Img src="/logo-stacked.webp" alt="Friktime" loading="eager" className="mx-auto mb-8 h-24 w-auto" />
        <LoginForm />
      </div>
    </div>
  );
}
