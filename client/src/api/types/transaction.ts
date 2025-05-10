import type { Category } from "./category";

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  toAccount: string;
  fromAccount: string;
  category: Category;
  createdAt: Date;
};
