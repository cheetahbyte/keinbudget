import { redirect } from "next/navigation";
import {
  createCategory,
  createSubscription,
  deleteCategory,
  deleteSubscription,
} from "@/app/actions";
import { getApi } from "@/lib/api.server";
import { StatsSection } from "@/sections/StatsSection";
import { ActiveSubscriptions } from "@/sections/SubscriptionsSection";

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

// mulberry32: seed -> [0,1)
function mulberry32(a: number): () => number {
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededHexColor(seedStr: string): string {
  const seed = xmur3(seedStr)();
  const rand = mulberry32(seed);
  const n = Math.floor(rand() * 0xffffff);
  return `#${n.toString(16).padStart(6, "0")}`;
}

function toMonthlyPrice(
  price: number,
  billingInterval: "monthly" | "weekly" | "yearly",
): number {
  if (billingInterval === "weekly") {
    return (price * 52) / 12;
  }

  if (billingInterval === "yearly") {
    return price / 12;
  }

  return price;
}

export default async function Home() {
  const api = await getApi();

  let subscriptions: Awaited<ReturnType<typeof api.subscriptions.all>>;
  let categories: Awaited<ReturnType<typeof api.categories.all>>;
  let stats: Awaited<ReturnType<typeof api.subscriptions.stats>>;
  try {
    [subscriptions, categories, stats] = await Promise.all([
      api.subscriptions.all(),
      api.categories.all(),
      api.subscriptions.stats(),
    ]);
  } catch {
    redirect("/login");
  }

  const breakdownStats = subscriptions
    .map((subscription) => {
      const categoryName = subscription.category?.name ?? "Uncategorized";

      return {
        name: subscription.name,
        category: categoryName,
        color: seededHexColor(`subscription-${subscription.id}`),
        categoryColor: seededHexColor(`category-${categoryName}`),
        value: toMonthlyPrice(subscription.price, subscription.billingInterval),
      };
    })
    .sort((a, b) => b.value - a.value);

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
          createCategoryAction={createCategory}
          createSubscriptionAction={createSubscription}
          deleteCategoryAction={deleteCategory}
          deleteSubscriptionAction={deleteSubscription}
          subscriptions={subscriptions}
        />
      </section>
    </main>
  );
}
