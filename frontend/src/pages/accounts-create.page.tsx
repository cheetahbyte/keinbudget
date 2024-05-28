import { useSearchParams } from "@solidjs/router";
import { Show, createResource, createSignal, type Component } from "solid-js";
import type { Account, ExternalAccount } from "../utils/types";
import Requestor, { RequestorError } from "../utils/requestor";


const AccountsCreatePage: Component = () => {
    let [searchParams, _] = useSearchParams();

    const [name, setName] = createSignal<string>("");
    const [balance, setBalance] = createSignal<number>(0.00);
    const [error, setError] = createSignal<string | null>(null);
    const [isExternal, setIsExternal] = createSignal<boolean>(false);

    const fn = async (form: any) => {
        form.preventDefault();
        try {
            let acc: Account| ExternalAccount;
            if (isExternal()) {
                acc = await Requestor.post<any>("external_account", {
                    name: name()
                })
            } else {
                acc = await Requestor.post<any>("account", {
                    name: name(),
                    balance: balance()
                })
            }
            if (!isExternal()) 
                window.location.href = "/account/" + acc.id 
            else
                window.location.href = "/accounts"
        } catch (error) {
            setError((error as Error).message)
        }

    }

    return (
        <>
            <form onSubmit={fn}>
                <h1>Create Account</h1>
                <label for="name">Name</label>
                <input type="text" id="sender" name="sender" value={name()} onInput={(e) => setName(e.currentTarget.value)} required />
                <label for="balance">Balance</label>
                <input type="number" id="balance" name="balance" value={balance()} onInput={(e) => setBalance(Number(e.currentTarget.value) ?? 0)} required disabled={isExternal()}/>
                <input type="checkbox" id="external" name="External Account" checked={isExternal()} onInput={(e) => setIsExternal(e.currentTarget.checked)} />
                <label for="external" data-tooltip="Account that is not owned by the user. This account represents someone the user transfers money to or gets money from.">External Account</label>
                <br/>
                <br/>
                <input type="submit" id="submit" value="Create" />

                <Show when={error()}>
                    <article style="background-color: #fb8500;">{error()}</article>
                </Show>
            </form>
        </>
    )
}

export default AccountsCreatePage;