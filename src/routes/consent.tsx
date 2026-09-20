import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { getOAuthClientInfo } from "#/functions/connected-apps";
import { authClient } from "#/lib/auth-client";
import { MCP_READ_SCOPE, MCP_WRITE_SCOPE } from "#/lib/mcp-scopes";
import { sessionQueryOptions } from "#/lib/session-query";

const SCOPE_LABELS: Record<string, string> = {
  openid: "Confirm who you are",
  profile: "See your name",
  email: "See your email address",
  offline_access: "Stay connected without signing in again",
  [MCP_READ_SCOPE]: "Read your entries, categories and totals",
  [MCP_WRITE_SCOPE]: "Add, change and delete entries and categories",
};

export const Route = createFileRoute("/consent")({
  validateSearch: (search: Record<string, unknown>) => ({
    client_id: typeof search.client_id === "string" ? search.client_id : "",
    scope: typeof search.scope === "string" ? search.scope : "",
  }),
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.ensureQueryData({
      ...sessionQueryOptions(),
      revalidateIfStale: true,
    });
    if (!session) {
      // The signed authorize query is preserved so login can resume the flow
      throw redirect({ href: `/login${location.searchStr}` });
    }
  },
  loaderDeps: ({ search }) => ({ clientId: search.client_id }),
  loader: ({ deps }) =>
    getOAuthClientInfo({ data: { clientId: deps.clientId } }),
  head: () => ({ meta: [{ title: "Authorize · keinbudget" }] }),
  component: ConsentPage,
});

function ConsentPage() {
  const { client_id: clientId, scope } = Route.useSearch();
  const client = Route.useLoaderData();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"accept" | "deny" | null>(null);
  const scopes = scope.split(" ").filter(Boolean);

  async function respond(accept: boolean) {
    setPending(accept ? "accept" : "deny");
    setError(null);
    const { data, error } = await authClient.$fetch<{ url: string }>(
      "/oauth2/consent",
      { method: "POST", body: { accept } },
    );
    if (error || !data?.url) {
      setError(error?.message ?? "Could not complete the authorization.");
      setPending(null);
      return;
    }
    window.location.assign(data.url);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="w-full max-w-md rounded-md bg-card p-6 ring-1 ring-border">
        <h1 className="text-2xl font-bold tracking-tight">Allow access?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {client?.name || "An unnamed application"}
          </span>{" "}
          wants to connect to your keinbudget account.
        </p>
        <p className="mt-1 text-xs break-all text-muted-foreground">
          {client?.uri ?? clientId}
        </p>
        {client === null ? (
          <p className="mt-3 text-sm text-destructive">
            This client is not registered. Deny unless you expected this.
          </p>
        ) : null}
        <ul className="mt-6 flex flex-col gap-2 text-sm">
          {scopes.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{SCOPE_LABELS[item] ?? item}</span>
            </li>
          ))}
        </ul>
        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : null}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={pending !== null}
            onClick={() => respond(false)}
          >
            {pending === "deny" ? "Denying…" : "Deny"}
          </Button>
          <Button
            className="flex-1"
            disabled={pending !== null}
            onClick={() => respond(true)}
          >
            {pending === "accept" ? "Allowing…" : "Allow"}
          </Button>
        </div>
      </div>
    </main>
  );
}
