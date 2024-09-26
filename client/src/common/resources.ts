import { createResource } from "solid-js";
import Requestor from "./requestor";

const fetchCurrentUser = async () => await Requestor.get("users/");
export const currentUser = createResource(fetchCurrentUser);