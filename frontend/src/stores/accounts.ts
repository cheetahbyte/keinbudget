import {ref, computed} from "vue";
import { defineStore } from "pinia";
import type { Account, ExternalAccount } from "@/utils/types";
import Requestor from "@/utils/requestor";

export const useAccountStore = defineStore("accounts", () => {
    const accounts = ref<Array<Account>>([{id: "1", name: "John Doe", balance: 1000, modified_at: "n", created_at: "n"}]);

    function add(account: Account) {
        accounts.value.push(account);
    }

    async function fetch() {
        let resp = await Requestor.get<Account[]>("account");
        accounts.value = resp;
    }

    fetch();

    return { accounts, add, fetch };
});

export const useExternalAccountStore = defineStore("externalAccounts", () => {
    const externalAccounts = ref(Array<ExternalAccount>());
    function add(account: Account) {
        externalAccounts.value.push(account);
    }

    async function fetch() {
        let resp = await Requestor.get<ExternalAccount[]>("external-account");
        externalAccounts.value = resp;
    }

    fetch();

    return { externalAccounts, add, fetch };
});