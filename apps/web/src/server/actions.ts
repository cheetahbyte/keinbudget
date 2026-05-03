import { createServerFn } from "@tanstack/react-start"

import { getServerApi } from "#/lib/api.server"

type BillingInterval = "monthly" | "weekly" | "yearly"

export const createSubscriptionFn = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      name: string
      price: number
      billingInterval: BillingInterval
      categoryId: number | null
    }) => input,
  )
  .handler(async ({ data }) => {
    const { name, price, billingInterval, categoryId } = data

    if (
      !name ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !["monthly", "weekly", "yearly"].includes(billingInterval) ||
      (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0))
    ) {
      return
    }

    const api = getServerApi()
    await api.subscriptions.create({
      name,
      price,
      billingInterval,
      categoryId,
    })
  })

export const createCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; icon: string }) => input)
  .handler(async ({ data }) => {
    const { name, icon } = data

    if (!name || !icon) {
      return
    }

    const api = getServerApi()
    await api.categories.create({
      name,
      icon,
    })
  })

export const deleteSubscriptionFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    if (!Number.isInteger(data.id) || data.id <= 0) {
      return
    }

    const api = getServerApi()
    await api.subscriptions.remove({ id: data.id })
  })

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    if (!Number.isInteger(data.id) || data.id <= 0) {
      return
    }

    const api = getServerApi()
    await api.categories.remove({ id: data.id })
  })

export const getDashboardDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const api = getServerApi()

    const [subscriptions, categories, stats] = await Promise.all([
      api.subscriptions.all(),
      api.categories.all(),
      api.subscriptions.stats(),
    ])

    return { subscriptions, categories, stats }
  },
)
