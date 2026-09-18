import { describe, expect, it, vi } from "vitest";

import { getRequestResource, isCloudflareWorkers } from "./request-store";

describe("getRequestResource", () => {
  it("returns the same resource within one request", () => {
    const headers = {};
    const create = vi.fn(() => ({ id: Math.random() }));

    const first = getRequestResource("db", create, headers);
    const second = getRequestResource("db", create, headers);

    expect(first).toBe(second);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("does not share resources across sequential requests", () => {
    const create = vi.fn(() => ({ id: Math.random() }));

    const firstRequest = getRequestResource("db", create, {});
    const secondRequest = getRequestResource("db", create, {});

    expect(firstRequest).not.toBe(secondRequest);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("does not share resources across concurrent requests", async () => {
    const create = vi.fn(() => ({ id: Math.random() }));
    const headersA = {};
    const headersB = {};

    const run = async (headers: object) => {
      const first = getRequestResource("db", create, headers);
      await Promise.resolve();
      const second = getRequestResource("db", create, headers);
      return { first, second };
    };

    const [a, b] = await Promise.all([run(headersA), run(headersB)]);

    expect(a.first).toBe(a.second);
    expect(b.first).toBe(b.second);
    expect(a.first).not.toBe(b.first);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("keeps different resource kinds separate within a request", () => {
    const headers = {};

    const db = getRequestResource("db", () => ({}), headers);
    const auth = getRequestResource("auth", () => ({}), headers);

    expect(db).not.toBe(auth);
  });
});

describe("isCloudflareWorkers", () => {
  it("detects the Workers runtime", () => {
    vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" });
    try {
      expect(isCloudflareWorkers()).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("returns false in Node", () => {
    expect(isCloudflareWorkers()).toBe(false);
  });
});
