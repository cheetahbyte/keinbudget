import { cookies } from "next/headers";
import { createClient } from "@keinbudget/contracts/client";

export async function getApi() {
  const cookieStore = await cookies();
  const apiUrl = process.env.API_URL ?? "http://localhost:4000";
  return createClient(`${apiUrl}/rpc`, {
    Cookie: cookieStore.toString(),
  });
}
