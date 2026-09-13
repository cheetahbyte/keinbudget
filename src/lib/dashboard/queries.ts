import { queryOptions } from "@tanstack/react-query";
import { getCategories } from "#/functions/categories";
import {
  getMonthlyCosts,
  getMonthlyProjections,
  getSubscriptions,
} from "#/functions/subscriptions";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  subscriptions: () => [...dashboardQueryKeys.all, "subscriptions"] as const,
  categories: () => [...dashboardQueryKeys.all, "categories"] as const,
  projections: () => [...dashboardQueryKeys.all, "projections"] as const,
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

export function monthlyProjectionsQueryOptions() {
  return queryOptions({
    queryKey: dashboardQueryKeys.projections(),
    queryFn: () => getMonthlyProjections(),
  });
}

export function monthlyCostsQueryOptions() {
  return queryOptions({
    queryKey: dashboardQueryKeys.monthlyCosts(),
    queryFn: () => getMonthlyCosts(),
  });
}
