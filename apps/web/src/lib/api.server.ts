import { getRequest } from "@tanstack/react-start/server"
import { createClient } from "@keinbudget/contracts/client"

export function getServerApi() {
  const req = getRequest()
  const apiUrl = process.env.API_URL ?? "http://localhost:4000"
  const cookie = req.headers.get("cookie") ?? req.headers.get("Cookie") ?? ""

  return createClient(`${apiUrl}/rpc`, {
    Cookie: cookie,
  })
}
