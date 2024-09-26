export interface Ok {
  ok: number;
}


export type Account = {
  id: string,
  userId: string,
  accountName: string
  balance: number
  createdAt: Date
}