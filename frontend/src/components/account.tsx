import type { Component } from "solid-js";
import type { Account as AccountType } from "../utils/types";

interface AccountProps {
    account: AccountType;
}

const Account: Component<AccountProps> = (props: AccountProps) => {
    return (
        <>
            <li><a href={`/account/${props.account.id}`}>{props.account.name}</a></li>
        </>
    )
}

export default Account;