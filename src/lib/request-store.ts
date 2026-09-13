import { getRequestHeaders } from "@tanstack/react-start/server";

// Detects the Cloudflare Workers runtime (present in workerd, Miniflare and
// workers.dev deployments, absent in Node). This matters because Workers
// closes TCP sockets when the request ends and only exposes environment
// variables inside the request lifecycle — state that spans requests is not
// allowed there, while Node keeps a process-wide pool.
export function isCloudflareWorkers(): boolean {
  return globalThis.navigator?.userAgent === "Cloudflare-Workers";
}

// Request-scoped resources. TanStack Start runs every request (SSR render,
// server functions, API route handlers) inside a single AsyncLocalStorage
// context whose headers object is stable for the whole request, so resources
// keyed by it are created once per request and never shared across requests,
// sequential or concurrent. The WeakMap lets the runtime garbage-collect a
// finished request's resources along with its headers object.
const resourcesByRequest = new WeakMap<object, Map<string, unknown>>();

export function getRequestResource<T>(
  key: string,
  create: () => T,
  headers: object = getRequestHeaders(),
): T {
  let resources = resourcesByRequest.get(headers);

  if (!resources) {
    resources = new Map();
    resourcesByRequest.set(headers, resources);
  }

  if (!resources.has(key)) {
    resources.set(key, create());
  }

  return resources.get(key) as T;
}
