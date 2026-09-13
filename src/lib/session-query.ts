import { queryOptions } from "@tanstack/react-query";
import { getSession } from "#/lib/auth.functions";

export const sessionQueryKey = ["session"] as const;

export function sessionQueryOptions() {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: () => getSession(),
    // beforeLoad runs on every navigation; avoid a server round trip each time
    staleTime: 5 * 60 * 1000,
  });
}
