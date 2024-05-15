import { createResource, Show, type Component } from "solid-js";
import type { Account } from "../utils/types";
import Requestor from "../utils/requestor";
import { useParams } from "@solidjs/router";


const getAccount = async (id: string) => Requestor.get<Account>(`account/${id}`);

const AccountPage: Component = () => {
    let params = useParams();
    const [account] = createResource(params.id, getAccount);
    return (
        <>
            <Show when={account.loading}>Loading...</Show>
            <Show when={account.error}>Error: {account.error.message}</Show>
            <Show when={account()} fallback={<div>No account found</div>}>
                <h1>{account()!.name}</h1>
                <p>Balance: {account()!.balance}</p>
                <p>Last modified: {new Intl.DateTimeFormat(navigator.language).format(new Date(account()!.modified_at))}</p>
                <p>Created: {new Intl.DateTimeFormat(navigator.language).format(new Date(account()!.created_at))}</p>
            </Show>
        </>
    )
}

export default AccountPage;