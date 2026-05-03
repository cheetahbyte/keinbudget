import {
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { StatsSection } from '#/sections/StatsSection'
import { ActiveSubscriptions } from '#/sections/SubscriptionsSection'
import {
  createCategoryFn,
  createSubscriptionFn,
  deleteCategoryFn,
  deleteSubscriptionFn,
  getDashboardDataFn,
} from '#/server/actions'

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(a: number): () => number {
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededHexColor(seedStr: string): string {
  const seed = xmur3(seedStr)()
  const rand = mulberry32(seed)
  const n = Math.floor(rand() * 0xffffff)
  return `#${n.toString(16).padStart(6, '0')}`
}

function toMonthlyPrice(
  price: number,
  billingInterval: 'monthly' | 'weekly' | 'yearly',
): number {
  if (billingInterval === 'weekly') {
    return (price * 52) / 12
  }

  if (billingInterval === 'yearly') {
    return price / 12
  }

  return price
}

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      return await getDashboardDataFn()
    } catch {
      throw redirect({ to: '/login' })
    }
  },
  component: Home,
})

function Home() {
  const { subscriptions, categories, stats } = Route.useLoaderData()
  const router = useRouter()

  const breakdownStats = subscriptions
    .map((subscription) => {
      const categoryName = subscription.category?.name ?? 'Uncategorized'

      return {
        name: subscription.name,
        category: categoryName,
        color: seededHexColor(`subscription-${subscription.id}`),
        categoryColor: seededHexColor(`category-${categoryName}`),
        value: toMonthlyPrice(subscription.price, subscription.billingInterval),
      }
    })
    .sort((a, b) => b.value - a.value)

  async function handleCreateSubscription(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim()
    const price = Number(formData.get('price'))
    const billingInterval = String(formData.get('billingInterval') ?? '').trim()
    const categoryValue = String(formData.get('categoryId') ?? '').trim()
    const categoryId = categoryValue ? Number(categoryValue) : null

    if (
      !name ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !['monthly', 'weekly', 'yearly'].includes(billingInterval) ||
      (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0))
    ) {
      return
    }

    await createSubscriptionFn({
      data: {
        name,
        price,
        billingInterval: billingInterval as 'monthly' | 'weekly' | 'yearly',
        categoryId,
      },
    })
    await router.invalidate()
  }

  async function handleCreateCategory(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim()
    const icon = String(formData.get('icon') ?? '').trim()

    if (!name || !icon) {
      return
    }

    await createCategoryFn({
      data: { name, icon },
    })
    await router.invalidate()
  }

  async function handleDeleteSubscription(formData: FormData) {
    const id = Number(formData.get('id'))

    if (!Number.isInteger(id) || id <= 0) {
      return
    }

    await deleteSubscriptionFn({
      data: { id },
    })
    await router.invalidate()
  }

  async function handleDeleteCategory(formData: FormData) {
    const id = Number(formData.get('id'))

    if (!Number.isInteger(id) || id <= 0) {
      return
    }

    await deleteCategoryFn({
      data: { id },
    })
    await router.invalidate()
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section id="stats">
        <StatsSection
          dailyCost={stats.dailyCost}
          avgPerSub={stats.averagePerSub}
          breakdownStats={breakdownStats}
        />
      </section>
      <div className="mb-5 mt-10" />
      <section className="space-y-6">
        <ActiveSubscriptions
          categories={categories}
          createCategoryAction={handleCreateCategory}
          createSubscriptionAction={handleCreateSubscription}
          deleteCategoryAction={handleDeleteCategory}
          deleteSubscriptionAction={handleDeleteSubscription}
          subscriptions={subscriptions}
        />
      </section>
    </main>
  )
}
