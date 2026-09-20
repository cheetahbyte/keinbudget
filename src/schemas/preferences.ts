import { z } from "zod";

import { CURRENCIES, LOCALES } from "#/lib/locale";

export const preferencesSchema = z.object({
  locale: z.enum(LOCALES.map((locale) => locale.value)),
  currency: z.enum(CURRENCIES),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
