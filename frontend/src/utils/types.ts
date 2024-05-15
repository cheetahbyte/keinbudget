type BaseAccount = {
    id: string,
    name: string,
    modified_at: string,
    created_at: string,
}

export type Account = BaseAccount & {balance: number}

export type ExternalAccount = BaseAccount;