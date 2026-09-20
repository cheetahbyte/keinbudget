import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Unplug } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { revokeConnectedApp } from "#/functions/connected-apps";
import { MCP_READ_SCOPE, MCP_WRITE_SCOPE } from "#/lib/mcp-scopes";
import { useFormatters } from "#/lib/preferences-context";
import { connectedAppsQueryOptions } from "#/lib/settings/queries";

import { SettingsSection } from "./SettingsSection";

const SCOPE_LABELS: Record<string, string> = {
  [MCP_READ_SCOPE]: "read",
  [MCP_WRITE_SCOPE]: "write",
  offline_access: "stays connected",
};

export function ConnectedAppsSettings() {
  const queryClient = useQueryClient();
  const { formatDate } = useFormatters();
  const { data: apps } = useSuspenseQuery(connectedAppsQueryOptions());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRevoke(id: string) {
    setPendingId(id);
    setError(null);
    try {
      await revokeConnectedApp({ data: { id } });
      await queryClient.invalidateQueries(connectedAppsQueryOptions());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not revoke access.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <SettingsSection title="Connected apps">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Assistants you have allowed to use your budget through MCP. Revoking
        cuts them off immediately; they have to sign in and ask again.
      </p>
      {apps.length === 0 ? (
        <p className="py-4 text-sm leading-6 text-muted-foreground">
          No apps are connected.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {apps.map((app) => {
            const permissions = app.scopes
              .map((scope) => SCOPE_LABELS[scope])
              .filter(Boolean);
            return (
              <li
                key={app.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-medium wrap-anywhere">
                    {app.name || app.clientId}
                  </p>
                  <p className="text-sm leading-6 wrap-anywhere text-muted-foreground">
                    {[
                      app.uri ?? app.clientId,
                      permissions.join(", "),
                      app.updatedAt
                        ? `granted ${formatDate(app.updatedAt.slice(0, 10))}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="self-start sm:self-auto"
                  disabled={pendingId === app.id}
                  onClick={() => handleRevoke(app.id)}
                >
                  <Unplug data-icon="inline-start" />
                  {pendingId === app.id ? "Revoking…" : "Revoke"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </SettingsSection>
  );
}
