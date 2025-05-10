export type Transaction = {
	id: string;
	amount: number;
	description: string;
	toAccount: string;
	fromAccount: string;
	createdAt: Date;
};
