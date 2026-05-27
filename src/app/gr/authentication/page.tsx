import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function AuthenticationPage() {
  return (
    <AuthShell mode="login">
      <Suspense fallback={<div className="py-20 text-center text-sm text-white">Chargement…</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
