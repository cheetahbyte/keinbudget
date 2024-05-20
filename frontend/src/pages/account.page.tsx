import { createResource, Show, type Component } from "solid-js";
import type { Account } from "../utils/types";
import Requestor from "../utils/requestor";
import { useParams } from "@solidjs/router";

const getAccount = async (id: string) => Requestor.get<Account>(`account/${id}`);

const getTransactions = async (id: string) => Requestor.get<any>(`account/${id}/transactions`)

const AccountPage: Component = () => {
    let params = useParams();
    const [account] = createResource(params.id, getAccount);
    const [transactions] = createResource(params.id, getTransactions);

    function handleClick() {
        console.log("Create transaction")
        window.location.href = "/transactions/new?sender=" + account()!.id
    }

    return (
        <>
            <Show when={account.loading}>Loading...</Show>
            <Show when={account.error}>Error: {account.error.message}</Show>
            <Show when={account()} fallback={<div>No account found</div>}>
                <h1>{account()!.name}</h1>
                <p>ID: {account()!.id}</p>
                <p>Balance: {account()!.balance}</p>
                <p>Last modified: {new Intl.DateTimeFormat("de-DE").format(new Date(account()!.modified_at))}</p>
                <p>Created: {new Intl.DateTimeFormat("de-DE").format(new Date(account()!.created_at))}</p>
                <br></br>

                <Show when={transactions.loading}><article aria-budy="true">Fetching transactions</article></Show>
                <Show when={transactions.error}>Error: {account.error.message}</Show>
                <Show when={transactions()}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Sender</th>
                                <th scope="col">Receiver</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions()!.map((transaction: any) => (
                                <tr>
                                    <td>{transaction.fr.id == params.id ? "(me)": transaction.fr.name}</td>
                                    <td>{transaction.to.id == params.id ? "(me)": transaction.fr.name}</td>
                                    <td>{transaction.fr.id == params.id ? transaction.amount * -1: transaction.amount}</td>
                                    <td>{new Intl.DateTimeFormat("de-DE").format(new Date(transaction.created_at))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Show>

                <button onclick={handleClick}>Create Transaction</button>
            </Show>
        </>
    )
}

export default AccountPage;