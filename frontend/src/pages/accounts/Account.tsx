import { accounts as getAccounts } from "../../lib/accounts";
import { For } from "solid-js"
function Accounts() {

    const [accounts, { refetch, mutate }] = getAccounts;

    return (
        <>
        <h1>Your Accounts</h1>
        <ul>
        <For each={accounts()}>
        {(item, index) =>
            <p>{item.accountName}</p>
        }
        </For>
        </ul>
        <button onclick={() => refetch()}>Refetch</button>
        </>
    )
}

export default Accounts;