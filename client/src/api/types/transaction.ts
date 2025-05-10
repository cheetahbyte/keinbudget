export type Transaction = {
  id: string;
  amount: number;
  description: string;
  toAccount: string;
  fromAccount: string;
  category: string;
  createdAt: Date;
};
