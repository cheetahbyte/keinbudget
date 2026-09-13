import postgres from "postgres";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The postgres factory is mocked: tests exercise client creation, not the
// wire protocol. drizzle() reads client.options at construction.
const config = vi.hoisted(() => ({
  headers: {} as object,
  connect: undefined as unknown,
}));

vi.mock("postgres", () => ({
  default: vi.fn(() => ({
    options: { parsers: {}, serializers: {} },
    end: vi.fn(),
  })),
}));

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeaders: () => config.headers,
}));

const postgresFactory = vi.mocked(postgres);

async function loadDb() {
  vi.resetModules();
  return await import("./index");
}

function setWorkersRuntime(enabled: boolean) {
  if (enabled) vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" });
  else vi.unstubAllGlobals();
}

beforeEach(() => {
  postgresFactory.mockClear();
  config.headers = {};
  setWorkersRuntime(true);
  delete process.env.DATABASE_URL;
});

afterEach(() => {
  setWorkersRuntime(false);
  delete process.env.DATABASE_URL;
});

describe("getDb on Cloudflare Workers", () => {
  it("does not read env or create a client at module scope", async () => {
    const dbModule = await loadDb();
    expect(dbModule).toBeDefined();
    expect(postgresFactory).not.toHaveBeenCalled();
  });

  it("shares a single client within one request", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    config.headers = {};
    const { getDb } = await loadDb();

    const first = getDb();
    const second = getDb();

    expect(first).toBe(second);
    expect(postgresFactory).toHaveBeenCalledTimes(1);
  });

  it("creates a fresh client per sequential request", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    const { getDb } = await loadDb();

    config.headers = {};
    const firstRequest = getDb();
    config.headers = {};
    const secondRequest = getDb();

    expect(firstRequest).not.toBe(secondRequest);
    expect(postgresFactory).toHaveBeenCalledTimes(2);
  });

  it("does not share clients between concurrent requests", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    const { getDb } = await loadDb();

    const run = async (headers: object) => {
      config.headers = headers;
      const first = getDb();
      await Promise.resolve();
      // Restore this request's context before reading again, like the real
      // AsyncLocalStorage does when the request resumes.
      config.headers = headers;
      const second = getDb();
      return { first, second };
    };

    const [a, b] = await Promise.all([run({}), run({})]);

    expect(a.first).toBe(a.second);
    expect(b.first).toBe(b.second);
    expect(a.first).not.toBe(b.first);
    expect(postgresFactory).toHaveBeenCalledTimes(2);
  });

  it("trims the URL and configures idle/connect timeouts", async () => {
    process.env.DATABASE_URL = "  postgres://user:pass@localhost:5432/db  ";
    const { getDb } = await loadDb();

    getDb();

    expect(postgresFactory).toHaveBeenCalledWith(
      "postgres://user:pass@localhost:5432/db",
      expect.objectContaining({ idle_timeout: 30, connect_timeout: 5 }),
    );
  });

  it("throws a clear error when DATABASE_URL is missing", async () => {
    const { getDb } = await loadDb();

    expect(() => getDb()).toThrow("DATABASE_URL must be set");
    expect(postgresFactory).not.toHaveBeenCalled();
  });
});

describe("getDb on Node", () => {
  it("shares one client across requests (previous behavior)", async () => {
    setWorkersRuntime(false);
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    const { getDb } = await loadDb();

    config.headers = {};
    const firstRequest = getDb();
    config.headers = {};
    const secondRequest = getDb();

    expect(firstRequest).toBe(secondRequest);
    expect(postgresFactory).toHaveBeenCalledTimes(1);
  });
});
