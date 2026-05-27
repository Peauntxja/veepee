import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function AuthenticationPage() {
  return (
    <AuthShell mode="login">
      <LoginForm />
    </AuthShell>
  );
}
