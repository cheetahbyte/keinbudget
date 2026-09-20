// Client ID Metadata Documents are fetched from client-chosen URLs. On
// Cloudflare Workers the runtime cannot reach private addresses, and the
// global_fetch_strictly_public flag removes same-zone origin shortcuts, so
// the remaining guards are the ones the CIMD draft asks for: https with a
// path, no credentials, no redirects, bounded time and size. Node deployments
// use @better-auth/cimd/node instead, which also pins DNS.

const FETCH_TIMEOUT_MS = 5_000;
const MAX_BODY_BYTES = 5 * 1024;

export function metadataUrlPolicy(input: string): URL | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password || url.hash) return null;
  if (url.pathname === "/") return null;
  if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) {
    return null;
  }
  return url;
}

async function readBounded(response: Response): Promise<Response> {
  const reader = response.body?.getReader();
  if (!reader) return response;
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("Metadata document too large");
    }
    chunks.push(value);
  }
  return new Response(new Blob(chunks as BlobPart[]), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export function createWorkersMetadataFetch(
  fetchImpl: typeof fetch = fetch,
): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
  return async (input, init) => {
    const target =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const url = metadataUrlPolicy(target);
    if (!url) throw new Error("Metadata URL is not allowed");
    const response = await fetchImpl(url, {
      ...init,
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    return readBounded(response);
  };
}
