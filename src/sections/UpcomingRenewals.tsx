import { Link } from "@tanstack/react-router";

import type { Subscription } from "#/lib/dashboard/types";
import { useFormatters } from "#/lib/preferences-context";
import {
  buildUpcomingRenewals,
  formatRelativeDays,
  todayIso,
} from "#/lib/renewals";

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  today?: string;
  withinDays?: number;
}

export function UpcomingRenewals({
  subscriptions,
  today = todayIso(),
  withinDays = 30,
}: UpcomingRenewalsProps) {
  const { formatMoney, formatDate } = useFormatters();
  const renewals = buildUpcomingRenewals(subscriptions, today, withinDays);
  const hasDated = subscriptions.some(
    (subscription) => subscription.nextBillingDate !== null,
  );

  return (
    <section className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-medium">Upcoming</h2>
        <p className="text-sm text-muted-foreground">Next {withinDays} days</p>
      </div>
      {renewals.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {hasDated
            ? "Nothing is due in this window."
            : "Set a next billing date on an entry to see renewals here."}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {renewals.map((renewal) => (
            <li
              key={renewal.entry.id}
              className="flex items-baseline gap-4 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{renewal.entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="capitalize">
                    {formatRelativeDays(renewal.daysUntil)}
                  </span>
                  {" · "}
                  {formatDate(renewal.date)}
                </p>
              </div>
              <p className="amount text-sm">
                {renewal.entry.category?.type === "income" ? "+" : ""}
                {formatMoney(renewal.entry.price)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/entries"
        className="w-fit text-sm text-pen underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
      >
        Manage entries
      </Link>
    </section>
  );
}
