export type BillingInterval = "monthly" | "weekly" | "yearly";

export type Subscription = {
  id: number;
  name: string;
  price: number;
  billingInterval: BillingInterval;
  category: {
    id: number;
    name: string;
    icon: string;
  } | null;
};

export type CreateSubscriptionInput = {
  name: string;
  price: number;
  billingInterval: BillingInterval;
  categoryId: number | null;
};

export type RemoveSubscriptionInput = {
  id: number;
};

export interface ISubscriptionRepo {
  findAll(): Promise<Subscription[]>;
}
