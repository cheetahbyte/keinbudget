import { getRequest } from "@tanstack/react-start/server"
import { createClient } from "@keinbudget/contracts/client"

export function getServerApi() {
  const req = getRequest()
  const apiUrl = process.env.API_URL ?? "http://localhost:4000"
  const requestUrl = new URL(req.url)
  const forwardedHeaders: Record<string, string> = {}

  for (const headerName of [
    "cookie",
    "origin",
    "user-agent",
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
    "x-forwarded-port",
    "x-real-ip",
  ]) {
    const value = req.headers.get(headerName)

    if (value) {
      forwardedHeaders[headerName] = value
    }
  }

  if (!forwardedHeaders.origin) {
    forwardedHeaders.origin = requestUrl.origin
  }

  if (!forwardedHeaders["x-forwarded-host"]) {
    const host = req.headers.get("host")

    if (host) {
      forwardedHeaders["x-forwarded-host"] = host
    }
  }

  if (!forwardedHeaders["x-forwarded-proto"]) {
    forwardedHeaders["x-forwarded-proto"] = requestUrl.protocol.replace(":", "")
  }

  return createClient(`${apiUrl}/rpc`, forwardedHeaders)
}
