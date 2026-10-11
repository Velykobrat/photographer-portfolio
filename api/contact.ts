import { validateContact } from "../lib/contact-validation";
import { checkContactRateLimit } from "../lib/contact-rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const DELIVERY_TIMEOUT_MS = 8000;

const reply = (
  body: Record<string, unknown>,
  status = 200,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    (origin && origin !== new URL(request.url).origin)
  ) {
    return reply({ error: "Request origin is not allowed" }, 403);
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return reply({ error: "Please submit JSON data" }, 415);
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return reply(
      {
        error:
          error instanceof RangeError
            ? "Request is too large"
            : "Invalid JSON data",
      },
      error instanceof RangeError ? 413 : 400,
    );
  }

  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.trim()
  ) {
    return reply({ success: true });
  }
  const validation = validateContact(body);
  if ("error" in validation) return reply({ error: validation.error }, 400);
  const data = validation.data;

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailFrom = process.env.CONTACT_EMAIL_FROM;
  if (
    !(telegramToken && telegramChatId) &&
    !(brevoApiKey && emailTo && emailFrom)
  ) {
    console.error("Contact notifications are not configured");
    return reply(
      {
        error:
          "The request service is temporarily unavailable. Please contact me directly.",
      },
      503,
    );
  }

  try {
    const limit = await checkContactRateLimit(request);
    if (!limit.allowed) {
      return reply(
        {
          error:
            "Too many requests. Please try again later or contact me directly.",
        },
        429,
        { "Retry-After": String(limit.retryAfter) },
      );
    }
  } catch {
    console.error("Contact rate limit service is unavailable");
    return reply(
      {
        error:
          "The request service is temporarily unavailable. Please contact me directly.",
      },
      503,
    );
  }

  const text = [
    "📷 NEW PHOTOGRAPHY REQUEST",
    "",
    `Name: ${data.name}`,
    `Contact: ${data.contact}`,
    `Type: ${data.shootType}`,
    "",
    `Preferred date: ${data.preferredDate || "—"}`,
    `Location: ${data.location || "—"}`,
    "",
    "Message:",
    data.message || "—",
  ].join("\n");

  const tasks: Promise<boolean>[] = [];
  if (telegramToken && telegramChatId) {
    tasks.push(
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramChatId, text }),
        signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      }).then(
        async (response) => response.ok && (await response.json()).ok === true,
      ),
    );
  }
  if (brevoApiKey && emailTo && emailFrom) {
    tasks.push(
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "MK Photography", email: emailFrom },
          to: [{ email: emailTo }],
          subject: `New photography request — ${data.name}`,
          textContent: text,
        }),
        signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      }).then((response) => response.ok),
    );
  }
  const results = await Promise.allSettled(tasks);
  const delivered = results.some(
    (result) => result.status === "fulfilled" && result.value,
  );
  if (!delivered) {
    // Never log provider URLs, credentials or client request data.
    console.error("Contact notification delivery failed");
    return reply(
      {
        error:
          "Your request could not be sent. Please try again or contact me directly.",
      },
      502,
    );
  }
  return reply({ success: true });
}
