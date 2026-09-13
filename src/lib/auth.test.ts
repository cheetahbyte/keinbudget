import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const config = vi.hoisted(() => ({
  headers: {} as object,
  connect: undefined as unknown,
  db: { fake: true },
}));

vi.mock("better-auth", () => ({
  betterAuth: vi.fn(() => ({ api: {} })),
}));

vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: vi.fn(() => ({ adapter: true })),
}));

vi.mock("better-auth/tanstack-start", () => ({
  tanstackStartCookies: vi.fn(() => ({ plugin: true })),
}));

vi.mock("#/db", () => ({
  getDb: () => config.db,
}));

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeaders: () => config.headers,
}));

const betterAuthMock = vi.mocked(betterAuth);
const drizzleAdapterMock = vi.mocked(drizzleAdapter);

function setWorkersRuntime(enabled: boolean) {
  if (enabled) vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" });
  else vi.unstubAllGlobals();
}

beforeEach(() => {
  betterAuthMock.mockClear();
  drizzleAdapterMock.mockClear();
  config.headers = {};
  setWorkersRuntime(true);
  delete process.env.BETTER_AUTH_URL;
});

afterEach(() => {
  setWorkersRuntime(false);
  delete process.env.BETTER_AUTH_URL;
});

describe("getAuth on Cloudflare Workers", () => {
  it("shares one auth instance within a request", async () => {
    config.headers = {};
    const { getAuth } = await import("./auth");

    const first = getAuth();
    const second = getAuth();

    expect(first).toBe(second);
    expect(betterAuthMock).toHaveBeenCalledTimes(1);
  });

  it("creates a fresh auth instance per sequential request", async () => {
    const { getAuth } = await import("./auth");

    config.headers = {};
    const firstRequest = getAuth();
    config.headers = {};
    const secondRequest = getAuth();

    expect(firstRequest).not.toBe(secondRequest);
    expect(betterAuthMock).toHaveBeenCalledTimes(2);
  });

  it("does not share auth instances between concurrent requests", async () => {
    const { getAuth } = await import("./auth");

    const run = async (headers: object) => {
      config.headers = headers;
      const first = getAuth();
      await Promise.resolve();
      config.headers = headers;
      const second = getAuth();
      return { first, second };
    };

    const [a, b] = await Promise.all([run({}), run({})]);

    expect(a.first).toBe(a.second);
    expect(b.first).toBe(b.second);
    expect(a.first).not.toBe(b.first);
    expect(betterAuthMock).toHaveBeenCalledTimes(2);
  });

  it("wires the per-request DB client into the Drizzle adapter", async () => {
    const { getAuth } = await import("./auth");

    getAuth();

    expect(drizzleAdapterMock).toHaveBeenCalledWith(
      config.db,
      expect.objectContaining({ provider: "pg" }),
    );
  });

  it("defaults to localhost in non-production", async () => {
    const { getAuth } = await import("./auth");

    getAuth();

    expect(betterAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: "http://localhost:3000" }),
    );
  });
});

describe("getAuth on Node", () => {
  it("shares one auth instance across requests", async () => {
    setWorkersRuntime(false);
    const { getAuth } = await import("./auth");

    config.headers = {};
    const firstRequest = getAuth();
    config.headers = {};
    const secondRequest = getAuth();

    expect(firstRequest).toBe(secondRequest);
    expect(betterAuthMock).toHaveBeenCalledTimes(1);
  });
});

describe("getAuth env validation", () => {
  it("throws when BETTER_AUTH_URL is missing in production", async () => {
    setWorkersRuntime(false);
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      vi.resetModules();
      const { getAuth } = await import("./auth");
      expect(() => getAuth()).toThrow(
        "BETTER_AUTH_URL must be set in production",
      );
    } finally {
      process.env.NODE_ENV = nodeEnv;
    }
  });
});
