import { SubscriptionRepo } from "./subscriptions.repo";

function toMonthlyCost(
  price: number,
  billingInterval: "monthly" | "weekly" | "yearly",
) {
  if (billingInterval === "weekly") {
    return (price * 52) / 12;
  }

  if (billingInterval === "yearly") {
    return price / 12;
  }

  return price;
}

export function normalizeMonthlyPrice(
  price: number,
  billingInterval: "monthly" | "weekly" | "yearly",
) {
  return toMonthlyCost(price, billingInterval);
}

export class SubscriptionService {
  constructor(private readonly repo: SubscriptionRepo) {}

  async findAll(userId: string) {
    const subscriptions = await this.repo.findAll(userId);

    return subscriptions.map((subscription) => ({
      ...subscription,
      category:
        subscription.category?.id == null
          ? null
          : {
              id: subscription.category.id,
              name: subscription.category.name,
              icon: subscription.category.icon,
            },
    }));
  }

  async calculateStats(userId: string) {
    const subscriptions = await this.repo.calculateStats(userId);
    const monthlyCost = subscriptions.reduce(
      (sum, s) => sum + toMonthlyCost(s.price, s.billingInterval ?? "monthly"),
      0,
    );

    return {
      averagePerSub:
        subscriptions.length === 0 ? 0 : monthlyCost / subscriptions.length,
      dailyCost: monthlyCost / 30,
    };
  }

  async calculateMonthlyCosts(userId: string) {
    const subscriptions = await this.findAll(userId);

    return subscriptions.map((subscription) => ({
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      billingInterval: subscription.billingInterval,
      monthlyPrice: normalizeMonthlyPrice(
        subscription.price,
        subscription.billingInterval ?? "monthly",
      ),
    }));
  }

  create(
    userId: string,
    input: {
      name: string;
      price: number;
      billingInterval: string;
      categoryId: number | null;
    },
  ) {
    return this.repo.create(userId, input);
  }

  remove(userId: string, id: number) {
    return this.repo.remove(userId, id);
  }
}
