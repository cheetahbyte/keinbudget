import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCategory,
  deleteCategory,
} from "#/features/categories/categories.actions";
import {
  createSubscription,
  deleteSubscription,
} from "#/features/subscriptions/subscriptions.actions";
import {
  parseCreateCategoryFormData,
  parseCreateSubscriptionFormData,
  parseEntityIdFormData,
} from "#/lib/dashboard/mutations";
import { dashboardQueryKeys } from "#/lib/dashboard/queries";
import type { CreateCategoryInput, CreateSubscriptionInput } from "#/schemas";

export function useDashboardActions() {
  const queryClient = useQueryClient();
  const createSubscriptionMutation = useMutation({
    mutationFn: (input: CreateSubscriptionInput) =>
      createSubscription({ data: input }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.stats(),
        }),
      ]);
    },
  });
  const createCategoryMutation = useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.categories(),
      });
    },
  });
  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: number) => deleteSubscription({ data: { id } }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.stats(),
        }),
      ]);
    },
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteCategory({ data: { id } }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.categories(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
      ]);
    },
  });

  async function createSubscription(formData: FormData) {
    const input = parseCreateSubscriptionFormData(formData);

    if (!input) {
      return;
    }

    await createSubscriptionMutation.mutateAsync(input);
  }

  async function createCategory(formData: FormData) {
    const input = parseCreateCategoryFormData(formData);

    if (!input) {
      return;
    }

    await createCategoryMutation.mutateAsync(input);
  }

  async function deleteSubscription(formData: FormData) {
    const input = parseEntityIdFormData(formData);

    if (!input) {
      return;
    }

    await deleteSubscriptionMutation.mutateAsync(input.id);
  }

  async function deleteCategory(formData: FormData) {
    const input = parseEntityIdFormData(formData);

    if (!input) {
      return;
    }

    await deleteCategoryMutation.mutateAsync(input.id);
  }

  return {
    createCategory,
    createSubscription,
    deleteCategory,
    deleteSubscription,
  };
}
