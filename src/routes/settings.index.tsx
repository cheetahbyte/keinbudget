import { createFileRoute } from "@tanstack/react-router";

import { preferencesQueryOptions } from "#/lib/settings/queries";
import { LocalizationSettings } from "#/sections/settings/LocalizationSettings";

export const Route = createFileRoute("/settings/")({
  component: LocalizationSettings,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(preferencesQueryOptions()),
});
