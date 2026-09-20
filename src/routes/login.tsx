import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";
import { oauthResumeUrl } from "#/lib/oauth-resume";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  async function finishSignIn() {
    // An OAuth client (e.g. an MCP client) sent us here: resume its flow
    const resume = oauthResumeUrl(window.location.search);
    if (resume) {
      window.location.assign(resume);
      return;
    }
    queryClient.clear();
    await navigate({ to: "/" });
    await router.invalidate();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setError(error.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    await finishSignIn();
  }

  async function handlePasskey() {
    setPasskeyLoading(true);
    setError(null);
    const result = await authClient.signIn.passkey();
    if (result?.error) {
      setError(result.error.message ?? "Passkey sign-in failed.");
      setPasskeyLoading(false);
      return;
    }
    await finishSignIn();
  }

  useEffect(() => {
    // Conditional UI: offers saved passkeys in the browser's autofill
    if (
      typeof PublicKeyCredential === "undefined" ||
      !PublicKeyCredential.isConditionalMediationAvailable
    ) {
      return;
    }
    void PublicKeyCredential.isConditionalMediationAvailable().then(
      async (available) => {
        if (!available) return;
        const result = await authClient.signIn.passkey({ autoFill: true });
        if (result?.data) await finishSignIn();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="w-full max-w-sm rounded-md bg-card p-6 ring-1 ring-border">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username webauthn"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password webauthn"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            disabled={passkeyLoading}
            onClick={handlePasskey}
          >
            <KeyRound className="size-4" />
            {passkeyLoading ? "Waiting for device…" : "Sign in with a passkey"}
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          New here?{" "}
          <Link
            to="/signup"
            className="text-pen underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
