import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      setError(error.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    queryClient.clear();

    await navigate({ to: "/" });

    await router.invalidate();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="w-full max-w-sm rounded-md bg-card p-6 ring-1 ring-border">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pen underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
