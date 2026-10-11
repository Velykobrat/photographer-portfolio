import {
  contactLimits,
  shootTypes,
  type ContactRequest,
} from "../shared/contact";

type ValidationResult =
  | { data: ContactRequest; error?: never }
  | { error: string; data?: never };

export function validateContact(
  value: unknown,
  now = new Date(),
): ValidationResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { error: "Invalid request data" };
  }

  const body = value as Record<string, unknown>;
  const fields: Record<string, string> = {};
  for (const [field, limit] of Object.entries(contactLimits)) {
    const input = body[field];
    if (input !== undefined && typeof input !== "string")
      return { error: "Invalid input" };
    const text = typeof input === "string" ? input.trim() : "";
    if (text.length > limit) return { error: "Invalid input" };
    fields[field] = text;
  }

  if (!fields.name || !fields.contact)
    return { error: "Name and contact are required" };
  if (
    typeof body.shootType !== "string" ||
    !shootTypes.includes(body.shootType as ContactRequest["shootType"])
  ) {
    return { error: "Please choose a valid type of shoot" };
  }
  if (body.consent !== true) return { error: "Consent is required" };

  const date = fields.preferredDate;
  if (date) {
    const parsed = new Date(`${date}T00:00:00Z`);
    // ISO round-trip rejects impossible dates such as February 30.
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Kyiv",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date ||
      date < today
    ) {
      return { error: "Invalid preferred date" };
    }
  }

  return {
    data: {
      name: fields.name,
      contact: fields.contact,
      location: fields.location,
      message: fields.message,
      preferredDate: date,
      website: fields.website,
      shootType: body.shootType as ContactRequest["shootType"],
      consent: true,
    },
  };
}
