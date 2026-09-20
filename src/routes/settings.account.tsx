import { createFileRoute } from "@tanstack/react-router";

import { AccountSettings } from "#/sections/settings/AccountSettings";

export const Route = createFileRoute("/settings/account")({
  component: AccountSettings,
  head: () => ({ meta: [{ title: "Account · Settings · keinbudget" }] }),
});
