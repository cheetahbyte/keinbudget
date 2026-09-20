import { useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";
import { useFormatters } from "#/lib/preferences-context";

import { SettingsSection } from "./SettingsSection";

interface PasskeyRow {
  id: string;
  name?: string | null;
  createdAt?: Date | string | null;
}

const passkeysQueryKey = ["passkeys"] as const;

export function PasskeySettings() {
  const { formatDate } = useFormatters();
  const queryClient = useQueryClient();
  const { data: passkeys = null } = useQuery({
    queryKey: passkeysQueryKey,
    queryFn: async (): Promise<PasskeyRow[]> => {
      const { data } = await authClient.passkey.listUserPasskeys();
      return (data as PasskeyRow[] | null) ?? [];
    },
  });
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, startAdding] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  function refresh() {
    return queryClient.invalidateQueries({ queryKey: passkeysQueryKey });
  }

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startAdding(async () => {
      const result = await authClient.passkey.addPasskey({
        name: name.trim() || undefined,
      });
      if (result?.error) {
        setError(result.error.message ?? "Could not register the passkey.");
        return;
      }
      setName("");
      await refresh();
    });
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    setError(null);
    const { error } = await authClient.passkey.deletePasskey({ id });
    if (error) setError(error.message ?? "Could not remove the passkey.");
    await refresh();
    setRemovingId(null);
  }

  return (
    <SettingsSection title="Passkeys">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Sign in with Touch ID, Face ID, Windows Hello or a security key instead
        of your password.
      </p>
      <ul className="divide-y divide-border">
        {passkeys === null ? (
          <li className="py-3 text-sm text-muted-foreground">Loading…</li>
        ) : passkeys.length === 0 ? (
          <li className="py-3 text-sm text-muted-foreground">
            No passkeys yet.
          </li>
        ) : (
          passkeys.map((passkey) => (
            <li
              key={passkey.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {passkey.name || "Unnamed passkey"}
                  </p>
                  {passkey.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      Added{" "}
                      {formatDate(
                        new Date(passkey.createdAt).toISOString().slice(0, 10),
                      )}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${passkey.name || "passkey"}`}
                disabled={removingId === passkey.id}
                onClick={() => handleRemove(passkey.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))
        )}
      </ul>
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="grid flex-1 gap-2">
          <Label htmlFor="passkey-name">Name (optional)</Label>
          <Input
            id="passkey-name"
            placeholder="MacBook, YubiKey..."
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <Button type="submit" size="lg" disabled={isAdding}>
          <KeyRound className="size-4" />
          {isAdding ? "Waiting for device…" : "Add passkey"}
        </Button>
      </form>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </SettingsSection>
  );
}
