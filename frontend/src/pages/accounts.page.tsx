import { createResource, Show, type Component } from "solid-js";
import type { Account as AccountType } from "../utils/types";

import Requestor from "../utils/requestor";
import Account from "../components/account";

const fetchAccounts = async () => Requestor.get<AccountType[]>("account");

const AccountPage: Component = () => {
    const [accounts] = createResource(fetchAccounts);

    return (
        <>
            <h1>Accounts Page</h1>
            <Show when={accounts.loading}>Loading...</Show>
            <Show when={accounts.error}>Error: {accounts.error.message}</Show>
            <Show when={accounts()} fallback={<div>No accounts found</div>}>
                <ul>
                    {accounts()!.map(account => <Account account={account} />)}
                </ul>
            </Show>
        </>
    )
}

export default AccountPage;