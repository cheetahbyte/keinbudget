import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { updateSettings } from "#/functions/settings";
import {
  settingsQueryKeys,
  settingsQueryOptions,
} from "#/lib/settings/queries";
import { SettingsSection } from "./SettingsSection";

const LOCALE = "en-US";

const CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "JPY",
  "CAD",
  "AUD",
  "SEK",
  "NOK",
  "DKK",
] as const;

const COMPARISON_PRESETS = [
  { label: "Burger", name: "burger", price: 8 },
  { label: "Coffee", name: "coffee", price: 4 },
  { label: "Döner", name: "döner", price: 5 },
  { label: "Beer", name: "beer", price: 6 },
  { label: "Pizza", name: "pizza", price: 12 },
  { label: "Avocado Toast", name: "avocado toast", price: 14 },
  { label: "Custom", name: "", price: 0 },
] as const;

export function LocalizationSettings() {
  const queryClient = useQueryClient();
  const { data: preferences } = useSuspenseQuery(settingsQueryOptions());
  const currency = preferences?.currency ?? "EUR";
  const savedItemName = preferences?.comparisonItemName ?? "burger";
  const savedItemPrice = preferences?.comparisonItemPrice ?? 8;

  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [itemName, setItemName] = useState(savedItemName);
  const [itemPrice, setItemPrice] = useState(String(savedItemPrice));
  const [isSaving, setIsSaving] = useState(false);

  const selectedPreset =
    COMPARISON_PRESETS.find(
      (p) => p.name === itemName && p.price === Number(itemPrice),
    ) ?? COMPARISON_PRESETS.find((p) => p.label === "Custom")!;

  function handlePresetChange(label: string) {
    const preset = COMPARISON_PRESETS.find((p) => p.label === label);
    if (!preset || preset.label === "Custom") return;
    setItemName(preset.name);
    setItemPrice(String(preset.price));
  }

  const hasChanges =
    selectedCurrency !== currency ||
    itemName !== savedItemName ||
    Number(itemPrice) !== savedItemPrice;

  const mutation = useMutation({
    mutationFn: (data: {
      currency: string;
      comparisonItemName: string;
      comparisonItemPrice: number;
    }) => updateSettings({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.current() });
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  function handleSave() {
    if (!hasChanges) return;
    setIsSaving(true);
    mutation.mutate({
      currency: selectedCurrency,
      comparisonItemName: itemName,
      comparisonItemPrice: Number(itemPrice),
    });
  }

  function handleReset() {
    setSelectedCurrency(currency);
    setItemName(savedItemName);
    setItemPrice(String(savedItemPrice));
  }

  return (
    <SettingsSection title="Localization Settings">
      <div className="space-y-6 px-5 py-5 sm:px-6">
        <div className="grid gap-2">
          <Label htmlFor="locale">Locale</Label>
          <Input
            id="locale"
            value={LOCALE}
            disabled
            className="h-12 rounded-xl border-[#d8c9b6] bg-[#f5f0e8] text-base text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Currently only en-US is supported.
          </p>
        </div>

        <Separator className="bg-[#efe4d7]" />

        <div className="grid gap-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="h-12 rounded-xl border border-[#d8c9b6] bg-white px-4 text-base text-[#2e241d] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Used to display prices throughout the dashboard.
          </p>
        </div>

        <Separator className="bg-[#efe4d7]" />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="comparison-preset">Comparison Item</Label>
            <select
              id="comparison-preset"
              value={selectedPreset.label}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="h-12 rounded-xl border border-[#d8c9b6] bg-white px-4 text-base text-[#2e241d] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {COMPARISON_PRESETS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label === "Custom"
                    ? "Custom"
                    : `${p.label} (~${p.price})`}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Used to show spending in relatable terms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="item-name">Name</Label>
              <Input
                id="item-name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="burger"
                className="h-12 rounded-xl border-[#d8c9b6] text-base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-price">Price</Label>
              <Input
                id="item-price"
                type="number"
                min="0.01"
                step="0.01"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="8"
                className="h-12 rounded-xl border-[#d8c9b6] text-base"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!hasChanges || isSaving}
            onClick={handleReset}
            className="h-10 rounded-lg border-[#cfbda7] bg-white px-4 text-[#2e241d] hover:bg-[#f8f1e7]"
          >
            Reset
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
            className="h-10 rounded-lg bg-[#2e241d] px-4 text-white hover:bg-[#433226]"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}
