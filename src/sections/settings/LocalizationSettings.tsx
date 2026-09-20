import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useTransition } from "react";

import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { updatePreferences } from "#/functions/preferences";
import { CURRENCIES, LOCALES } from "#/lib/locale";
import { createFormatters } from "#/lib/money";
import { preferencesQueryOptions } from "#/lib/settings/queries";
import { preferencesSchema } from "#/schemas";

import { SettingsSection } from "./SettingsSection";

const selectClassName =
  "h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function LocalizationSettings() {
  const queryClient = useQueryClient();
  const { data: preferences } = useSuspenseQuery(preferencesQueryOptions());
  const [draft, setDraft] = useState(preferences);
  const [isSaving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);

  const isDirty =
    draft.locale !== preferences.locale ||
    draft.currency !== preferences.currency;
  const preview = createFormatters(draft);

  function handleSubmit(formData: FormData) {
    const parsed = preferencesSchema.safeParse({
      locale: String(formData.get("locale") ?? ""),
      currency: String(formData.get("currency") ?? ""),
    });
    if (!parsed.success) return;
    setSaved(false);
    startSaving(async () => {
      const next = await updatePreferences({ data: parsed.data });
      queryClient.setQueryData(preferencesQueryOptions().queryKey, next);
      setSaved(true);
    });
  }

  return (
    <SettingsSection title="Localization">
      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="preferences-locale">Number format</Label>
            <select
              id="preferences-locale"
              name="locale"
              value={draft.locale}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  locale: event.target.value as typeof draft.locale,
                })
              }
              className={selectClassName}
            >
              {LOCALES.map((locale) => (
                <option key={locale.value} value={locale.value}>
                  {locale.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preferences-currency">Currency</Label>
            <select
              id="preferences-currency"
              name="currency"
              value={draft.currency}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  currency: event.target.value as typeof draft.currency,
                })
              }
              className={selectClassName}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Preview: <span className="amount">{preview.formatMoney(1234.5)}</span>
          {" · "}
          {preview.formatDate("2026-03-01")}
        </p>
        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" disabled={!isDirty || isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {saved && !isDirty && (
            <span className="text-sm text-muted-foreground">Saved.</span>
          )}
        </div>
      </form>
    </SettingsSection>
  );
}
