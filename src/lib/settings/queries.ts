import { queryOptions } from "@tanstack/react-query";

import { exportAccountData } from "#/functions/account";
import { getPreferences } from "#/functions/preferences";

export const settingsQueryKeys = {
  all: ["settings"] as const,
  export: () => [...settingsQueryKeys.all, "export"] as const,
  preferences: () => [...settingsQueryKeys.all, "preferences"] as const,
};

export function exportDataQueryOptions() {
  return queryOptions({
    queryKey: settingsQueryKeys.export(),
    queryFn: () => exportAccountData(),
  });
}

export function preferencesQueryOptions() {
  return queryOptions({
    queryKey: settingsQueryKeys.preferences(),
    queryFn: () => getPreferences(),
    staleTime: 5 * 60 * 1000,
  });
}
