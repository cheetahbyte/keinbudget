import { eq } from "drizzle-orm";

import type { DrizzleClient } from "#/db";
import { userPreferences } from "#/db";
import type { Preferences } from "#/lib/locale";
import { DEFAULT_PREFERENCES, isCurrency, isLocale } from "#/lib/locale";

export class PreferencesService {
  constructor(private readonly db: DrizzleClient) {}

  async find(userId: string): Promise<Preferences> {
    const [row] = await this.db
      .select({
        locale: userPreferences.locale,
        currency: userPreferences.currency,
      })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    if (!row) return DEFAULT_PREFERENCES;

    return {
      locale: isLocale(row.locale) ? row.locale : DEFAULT_PREFERENCES.locale,
      currency: isCurrency(row.currency)
        ? row.currency
        : DEFAULT_PREFERENCES.currency,
    };
  }

  async upsert(userId: string, input: Preferences): Promise<Preferences> {
    await this.db
      .insert(userPreferences)
      .values({ userId, ...input })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { locale: input.locale, currency: input.currency },
      });
    return input;
  }
}
