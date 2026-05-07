import { eq } from "drizzle-orm";
import type { DrizzleClient } from "#/db";
import { preferences } from "#/db/schema/preferences";

type PreferencesRow = typeof preferences.$inferSelect;

export class SettingsService {
  constructor(private readonly db: DrizzleClient) {}

  async findForUser(userId: string): Promise<PreferencesRow | undefined> {
    const rows = await this.db
      .select()
      .from(preferences)
      .where(eq(preferences.userId, userId))
      .limit(1);

    return rows[0];
  }

  async update(
    userId: string,
    input: { currency: string; comparisonItemName: string; comparisonItemPrice: number },
  ): Promise<PreferencesRow> {
    const existing = await this.findForUser(userId);

    if (existing) {
      const [updated] = await this.db
        .update(preferences)
        .set({
          currency: input.currency,
          comparisonItemName: input.comparisonItemName,
          comparisonItemPrice: input.comparisonItemPrice,
        })
        .where(eq(preferences.userId, userId))
        .returning();

      if (!updated) throw new Error("Failed to update preferences");
      return updated;
    }

    const [created] = await this.db
      .insert(preferences)
      .values({
        id: crypto.randomUUID(),
        userId,
        currency: input.currency,
        comparisonItemName: input.comparisonItemName,
        comparisonItemPrice: input.comparisonItemPrice,
      })
      .returning();

    if (!created) throw new Error("Failed to create preferences");
    return created;
  }
}
