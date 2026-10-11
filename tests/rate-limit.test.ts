import { afterEach, beforeEach, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("VERCEL", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const request = (ip = "192.0.2.1") =>
  new Request("https://example.com/api/contact", {
    headers: { "x-forwarded-for": ip },
  });

it("limits a local bucket and resets after its window", async () => {
  vi.useFakeTimers();
  const { checkContactRateLimit } = await import("../lib/contact-rate-limit");
  for (let i = 0; i < 5; i++)
    expect((await checkContactRateLimit(request())).allowed).toBe(true);
  expect((await checkContactRateLimit(request())).allowed).toBe(false);
  expect((await checkContactRateLimit(request("192.0.2.2"))).allowed).toBe(
    true,
  );
  vi.advanceTimersByTime(600000);
  expect((await checkContactRateLimit(request())).allowed).toBe(true);
});

it("uses an atomic shared Redis counter without storing a raw IP", async () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test");
  const fetch = vi.fn().mockResolvedValue(Response.json({ result: [6, 42] }));
  vi.stubGlobal("fetch", fetch);
  const { checkContactRateLimit } = await import("../lib/contact-rate-limit");
  expect(await checkContactRateLimit(request())).toEqual({
    allowed: false,
    retryAfter: 42,
  });
  const body = fetch.mock.calls[0][1].body;
  expect(JSON.parse(body)[0]).toBe("EVAL");
  expect(body).not.toContain("192.0.2.1");
});

it("rejects incomplete shared limiter configuration", async () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
  const { checkContactRateLimit } = await import("../lib/contact-rate-limit");
  await expect(checkContactRateLimit(request())).rejects.toThrow();
});

it("rejects malformed Redis responses", async () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ result: null })),
  );
  const { checkContactRateLimit } = await import("../lib/contact-rate-limit");
  await expect(checkContactRateLimit(request())).rejects.toThrow();
});

it("requires a trusted proxy IP on Vercel", async () => {
  vi.stubEnv("VERCEL", "1");
  const { checkContactRateLimit } = await import("../lib/contact-rate-limit");
  await expect(checkContactRateLimit(request(""))).rejects.toThrow();
});
