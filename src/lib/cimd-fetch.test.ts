import { describe, expect, it, vi } from "vitest";

import {
  createWorkersMetadataFetch,
  metadataUrlPolicy,
} from "#/lib/cimd-fetch";

describe("metadataUrlPolicy", () => {
  it.each([
    "http://example.com/client.json",
    "https://user:pw@example.com/client.json",
    "https://example.com/client.json#frag",
    "https://example.com/",
    "https://localhost/client.json",
    "https://app.localhost/client.json",
    "not a url",
  ])("rejects %s", (url) => {
    expect(metadataUrlPolicy(url)).toBeNull();
  });

  it("accepts https URLs with a path", () => {
    expect(metadataUrlPolicy("https://claude.ai/oauth/client.json")?.host).toBe(
      "claude.ai",
    );
  });
});

describe("createWorkersMetadataFetch", () => {
  it("never follows redirects and caps the body size", async () => {
    const calls: RequestInit[] = [];
    const impl = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      calls.push(init ?? {});
      return new Response("x".repeat(6 * 1024));
    });

    await expect(
      createWorkersMetadataFetch(impl)("https://example.com/client.json"),
    ).rejects.toThrow("too large");
    expect(calls[0].redirect).toBe("manual");
  });

  it("passes small documents through unchanged", async () => {
    const impl = vi.fn(async () => new Response('{"client_id":"x"}'));
    const response = await createWorkersMetadataFetch(impl)(
      "https://example.com/client.json",
    );
    await expect(response.text()).resolves.toBe('{"client_id":"x"}');
  });

  it("refuses disallowed URLs before any network call", async () => {
    const impl = vi.fn();
    await expect(
      createWorkersMetadataFetch(impl)("http://example.com/client.json"),
    ).rejects.toThrow("not allowed");
    expect(impl).not.toHaveBeenCalled();
  });
});
