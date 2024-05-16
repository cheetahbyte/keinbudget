import { useSearchParams } from "@solidjs/router";
import { Show, createResource, createSignal, type Component } from "solid-js";
import type { Account, ExternalAccount } from "../utils/types";
import Requestor, { RequestorError } from "../utils/requestor";

type FormInputData = {
    sender: string;
    receiver: string;
    amount: number;
    description?: string;
}

const getAllAccounts = async () => Requestor.getAllAccounts();

const TransactionsCreatePage: Component = () => {
    let [searchParams, _] = useSearchParams();
    const [accounts] = createResource(getAllAccounts);

    const [sender, setSender] = createSignal<string>("");
    const [receiver, setReceiver] = createSignal<string>("");
    const [amount, setAmount] = createSignal<number>(0.00);
    const [description, setDescription] = createSignal<string>("");
    const [error, setError] = createSignal<string | null>(null);

    const fn = async (form: any) => {
        form.preventDefault();
        try {
            await Requestor.post<any>("transaction", { fr: sender(), to: receiver(), amount: amount(), description: description(), currency: "EUR" })
            window.location.href = "/accounts"
        } catch (error) {
            setError((error as Error).message)
        }

    }

    const isAccount = (acc: Account | ExternalAccount): acc is Account => 'balance' in acc;
    return (
        <>

            <Show when={accounts.loading}><article aria-busy="true">Fetching Data...</article></Show>
            <Show when={accounts.error}>Error: {accounts.error.message}</Show>
            <Show when={accounts() && !accounts.loading} fallback={<div>No accounts found</div>}>
                <datalist id="all-accounts">
                    {accounts()!.map((account: any) => account.map((acc: Account | ExternalAccount) => <option value={acc.id}>{acc.name} {isAccount(acc) ? "(Account)" : "(External Account"}</option>))}
                </datalist>
                <form onSubmit={fn}>
                    <h1>Create Transaction</h1>
                    <label for="sender">Sender</label>
                    <input type="text" id="sender" name="sender" value={sender()} onInput={(e) => setSender(e.currentTarget.value)} list="all-accounts" required />
                    <label for="receiver">Receiver</label>
                    <input type="text" id="receiver" name="receiver" value={receiver()} onInput={(e) => setReceiver(e.currentTarget.value)} list="all-accounts" required />
                    <label for="amount">Amount</label>
                    <input type="number" id="amount" name="amount" value={amount()} onInput={(e) => setAmount(Number(e.currentTarget.value) ?? 0)} required />
                    <label for="description">Description</label>
                    <input type="text" id="description" name="description" value={description()} onInput={(e) => setDescription(e.currentTarget.value)} />
                    <input type="submit" id="submit" value="Create" />

                    <Show when={error()}>
                        <article style="background-color: #fb8500;">{error()}</article>
                    </Show>
                </form>
            </Show>
        </>
    )
}

export default TransactionsCreatePage;