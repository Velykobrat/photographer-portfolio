import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../api/contact";
import { validateContact } from "../lib/contact-validation";
import { checkContactRateLimit } from "../lib/contact-rate-limit";

vi.mock("../lib/contact-rate-limit", () => ({
  checkContactRateLimit: vi.fn(),
}));
const valid = {
  name: "Anna",
  contact: "@anna",
  shootType: "Portrait",
  consent: true,
};
const request = (body: unknown, headers = {}) =>
  new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token");
  vi.stubEnv("TELEGRAM_CHAT_ID", "test-chat");
  vi.stubEnv("BREVO_API_KEY", "");
  vi.stubEnv("CONTACT_EMAIL_TO", "");
  vi.stubEnv("CONTACT_EMAIL_FROM", "");
  vi.mocked(checkContactRateLimit).mockResolvedValue({
    allowed: true,
    retryAfter: 0,
  });
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("contact validation", () => {
  it.each([
    null,
    [],
    42,
    { ...valid, name: 42 },
    { ...valid, location: {} },
    { ...valid, consent: "true" },
    { ...valid, shootType: "Unknown" },
    { ...valid, contact: " " },
    { ...valid, message: "a".repeat(3001) },
  ])("rejects malformed input %j", (input) => {
    expect(validateContact(input)).toHaveProperty("error");
  });
  it("accepts and trims valid fields", () => {
    expect(
      validateContact({ ...valid, name: " Anna ", message: " hello " }).data,
    ).toMatchObject({ name: "Anna", message: "hello" });
  });
  it.each(["2026-02-30", "2026-13-01", "2026-1-01", "2026-10-10"])(
    "rejects invalid or past date %s",
    (date) => {
      expect(
        validateContact(
          { ...valid, preferredDate: date },
          new Date("2026-10-11T12:00:00Z"),
        ),
      ).toHaveProperty("error");
    },
  );
  it("uses the Kyiv date near UTC midnight", () => {
    const now = new Date("2026-10-10T22:30:00Z");
    expect(
      validateContact({ ...valid, preferredDate: "2026-10-10" }, now),
    ).toHaveProperty("error");
    expect(
      validateContact({ ...valid, preferredDate: "2026-10-11" }, now),
    ).toHaveProperty("data");
  });
});

describe("contact endpoint", () => {
  it("returns 400 for malformed JSON without notifying anyone", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const response = await POST(
      new Request("https://example.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    );
    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects wrong field types with 400", async () => {
    expect((await POST(request({ ...valid, name: 42 }))).status).toBe(400);
  });
  it("limits streamed request size", async () => {
    expect(
      (await POST(request({ ...valid, message: "a".repeat(17000) }))).status,
    ).toBe(413);
  });
  it("rejects cross-site submissions", async () => {
    expect(
      (await POST(request(valid, { Origin: "https://unrelated.example" })))
        .status,
    ).toBe(403);
  });
  it("requires JSON content type", async () => {
    expect(
      (await POST(request(valid, { "Content-Type": "text/plain" }))).status,
    ).toBe(415);
  });
  it("silently accepts the honeypot without delivery", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const response = await POST(request({ website: "spam.example" }));
    expect(await response.json()).toEqual({ success: true });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("returns 429 with Retry-After before notifying", async () => {
    vi.mocked(checkContactRateLimit).mockResolvedValue({
      allowed: false,
      retryAfter: 60,
    });
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const response = await POST(request(valid));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("reports missing notification configuration", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    expect((await POST(request(valid))).status).toBe(503);
  });
  it("does not bypass a configured rate limiter outage", async () => {
    vi.mocked(checkContactRateLimit).mockRejectedValue(
      new Error("Unavailable"),
    );
    expect((await POST(request(valid))).status).toBe(503);
  });
  it("reports confirmed Telegram delivery and applies a deadline", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetch);
    const response = await POST(request(valid));
    expect(await response.json()).toEqual({ success: true });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
  it("succeeds when email works and Telegram fails", async () => {
    vi.stubEnv("BREVO_API_KEY", "test-key");
    vi.stubEnv("CONTACT_EMAIL_TO", "to@example.com");
    vi.stubEnv("CONTACT_EMAIL_FROM", "from@example.com");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValueOnce(new Error("Timeout"))
        .mockResolvedValueOnce(new Response(null, { status: 201 })),
    );
    expect((await POST(request(valid))).status).toBe(200);
  });
  it("rejects Telegram application errors even on HTTP 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ ok: false })),
    );
    expect((await POST(request(valid))).status).toBe(502);
  });
  it("reports delivery failure without leaking provider credentials into logs", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValue(new Error("https://api.telegram.org/bottest-token")),
    );
    expect((await POST(request(valid))).status).toBe(502);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(
      "test-token",
    );
  });
});
