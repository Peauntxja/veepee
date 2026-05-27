import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegistrationPage() {
  return (
    <AuthShell mode="register">
      <Suspense fallback={<div className="py-20 text-center text-sm text-white">Chargement…</div>}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
