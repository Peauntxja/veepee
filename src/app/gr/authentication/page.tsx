import { SiteShell } from "@/components/layout/SiteShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function AuthenticationPage() {
  return (
    <SiteShell>
      <LoginForm />
    </SiteShell>
  );
}
