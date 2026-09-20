import { createFileRoute } from "@tanstack/react-router";

import { PasskeySettings } from "#/sections/settings/PasskeySettings";

export const Route = createFileRoute("/settings/security")({
  component: PasskeySettings,
  head: () => ({ meta: [{ title: "Security · Settings · keinbudget" }] }),
});
