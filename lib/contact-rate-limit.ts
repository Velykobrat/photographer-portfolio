import { createHash } from "node:crypto";
import { isIP } from "node:net";

const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 5;
const MAX_KEYS = 5000;
type Bucket = { count: number; expiresAt: number };
// Best-effort fallback only: serverless processes do not share this map.
const buckets = new Map<string, Bucket>();

const script = `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('TTL', KEYS[1])}`;

export async function checkContactRateLimit(request: Request) {
  // Vercel overwrites x-forwarded-for with the connecting client IP.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (!ip || !isIP(ip)) {
    if (process.env.VERCEL === "1") throw new Error("Missing client IP");
    return { allowed: true, retryAfter: 0 };
  }
  const key = `contact:${createHash("sha256").update(ip).digest("hex")}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url || token) {
    if (!url || !token) throw new Error("Incomplete rate limit configuration");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", script, "1", key, String(WINDOW_SECONDS)]),
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) throw new Error("Rate limit unavailable");
    const payload = await response.json();
    const result: unknown = payload.result;
    if (
      !Array.isArray(result) ||
      result.length !== 2 ||
      !result.every(
        (value) => typeof value === "number" && Number.isFinite(value),
      ) ||
      result[0] < 1 ||
      result[1] < 0
    )
      throw new Error("Invalid rate limit response");
    return {
      allowed: result[0] <= MAX_REQUESTS,
      retryAfter: Math.max(1, result[1]),
    };
  }

  const now = Date.now();
  for (const [id, bucket] of buckets) {
    if (bucket.expiresAt <= now) buckets.delete(id);
  }
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_KEYS)
      return { allowed: false, retryAfter: WINDOW_SECONDS };
    bucket = { count: 0, expiresAt: now + WINDOW_SECONDS * 1000 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return {
    allowed: bucket.count <= MAX_REQUESTS,
    retryAfter: Math.max(1, Math.ceil((bucket.expiresAt - now) / 1000)),
  };
}
