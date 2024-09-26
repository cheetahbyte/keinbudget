import { createResource } from "solid-js";
import Requestor from "./requestor";
import { Account } from "./types";

const fetchAccounts = async(): Promise<Account[]> => await Requestor.get<Account[]>("accounts/")
export const accounts = createResource(fetchAccounts)