import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { userPreferences } from "#/db/schema/preferences";
import { CURRENCIES, LOCALES } from "#/lib/locale";

export const preferencesSchema = createInsertSchema(userPreferences, {
  locale: z.enum(LOCALES.map((locale) => locale.value)),
  currency: z.enum(CURRENCIES),
}).pick({ locale: true, currency: true });

export type PreferencesInput = z.infer<typeof preferencesSchema>;
