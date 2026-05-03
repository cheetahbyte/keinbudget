import { queryOptions } from "@tanstack/react-query";
import { exportAccountData } from "#/features/account/account.actions";

export const settingsQueryKeys = {
  all: ["settings"] as const,
  export: () => [...settingsQueryKeys.all, "export"] as const,
};

export function exportDataQueryOptions() {
  return queryOptions({
    queryKey: settingsQueryKeys.export(),
    queryFn: () => exportAccountData(),
  });
}
