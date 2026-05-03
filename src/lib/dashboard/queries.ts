import { queryOptions } from "@tanstack/react-query";
import { getCategories } from "#/features/categories/categories.actions";
import {
  getMonthlyCosts,
  getSubscriptionStats,
  getSubscriptions,
} from "#/features/subscriptions/subscriptions.actions";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  subscriptions: () => [...dashboardQueryKeys.all, "subscriptions"] as const,
  categories: () => [...dashboardQueryKeys.all, "categories"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  monthlyCosts: () => [...dashboardQueryKeys.all, "monthly-costs"] as const,
};

export function subscriptionsQueryOptions() {
  return queryOptions({
    queryKey: dashboardQueryKeys.subscriptions(),
    queryFn: () => getSubscriptions(),
  });
}

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: dashboardQueryKeys.categories(),
    queryFn: () => getCategories(),
  });
}

export function subscriptionStatsQueryOptions() {
  return queryOptions({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => getSubscriptionStats(),
  });
}

export function monthlyCostsQueryOptions() {
  return queryOptions({
    queryKey: dashboardQueryKeys.monthlyCosts(),
    queryFn: () => getMonthlyCosts(),
  });
}
