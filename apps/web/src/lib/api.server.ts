import { cookies } from "next/headers";
import { createClient } from "@keinbudget/contracts/client";

export async function getApi() {
  const cookieStore = await cookies();
  return createClient("http://localhost:4000/rpc", {
    Cookie: cookieStore.toString(),
  });
}
