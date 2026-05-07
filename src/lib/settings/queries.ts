import { queryOptions } from "@tanstack/react-query";
import { exportAccountData } from "#/functions/account";
import { getSettings } from "#/functions/settings";

export const settingsQueryKeys = {
  all: ["settings"] as const,
  export: () => [...settingsQueryKeys.all, "export"] as const,
  current: () => [...settingsQueryKeys.all, "current"] as const,
};

export function exportDataQueryOptions() {
  return queryOptions({
    queryKey: settingsQueryKeys.export(),
    queryFn: () => exportAccountData(),
  });
}

export function settingsQueryOptions() {
  return queryOptions({
    queryKey: settingsQueryKeys.current(),
    queryFn: () => getSettings(),
  });
}
