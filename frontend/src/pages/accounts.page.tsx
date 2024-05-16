import { createResource, Show, type Component } from "solid-js";
import type { Account as AccountType, ExternalAccount } from "../utils/types";

import Requestor from "../utils/requestor";
import Account from "../components/account";

const fetchAccounts = async () => Requestor.get<AccountType[]>("account");
const fetchExternalAccounts = async () => Requestor.get<ExternalAccount[]>("external-account");

const AccountPage: Component = () => {
    const [accounts] = createResource(fetchAccounts);
    const [externalAccounts] = createResource(fetchExternalAccounts);

    const handleClick = () => window.location.href = "/accounts/new";

    return (
        <>
            <h1>Accounts Page</h1>
            <h2>Accounts</h2>
            <Show when={accounts.loading}>Loading...</Show>
            <Show when={accounts.error}>Error: {accounts.error.message}</Show>
            <Show when={accounts()} fallback={<div>No accounts found</div>}>
                <ul>
                    {accounts()!.map(account => <Account account={account} />)}
                </ul>
                <button onClick={handleClick}>Create Account</button>
            </Show>
            <h2>External Accounts</h2>
            <Show when={externalAccounts.loading}>Loading...</Show>
            <Show when={externalAccounts.error}>Error: {accounts.error.message}</Show>
            <Show when={externalAccounts()} fallback={<div>No external accounts found</div>}>
                <ul>
                    {externalAccounts()!.map(account => <Account account={account as AccountType} />)}
                </ul>
                <button onClick={handleClick}>Create External Account</button>
            </Show>
        </>
    )
}

export default AccountPage;