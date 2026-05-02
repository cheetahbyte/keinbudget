// apps/web/src/lib/api.ts
import { createClient } from "@keinbudget/contracts/client";

export const api = createClient("http://localhost:4000/rpc");
