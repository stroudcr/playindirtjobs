import { z } from "zod";
import { US_STATES } from "@/lib/constants";
import { WORKSHOP_LEVELS } from "@/lib/workshop-types";

export const publicWebUrl = z
  .string()
  .trim()
  .url("Enter a complete website URL.")
  .max(2000)
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        !url.port &&
        url.hostname.includes(".") &&
        !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/i.test(
          url.hostname,
        ) &&
        !/\.(local|internal|localhost)$/i.test(url.hostname)
      );
    } catch {
      return false;
    }
  }, "Use a public HTTP or HTTPS website.");
const optionalUrl = z.union([z.literal(""), publicWebUrl]).default("");
const optionalDate = z
  .string()
  .datetime({ offset: true })
  .nullable()
  .default(null);
export const workshopSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(8, "Enter a descriptive course title.")
      .max(140),
    organization: z.string().trim().min(2).max(140),
    instructor: z.string().trim().max(160).default(""),
    summary: z
      .string()
      .trim()
      .min(30, "Add a short introduction of at least 30 characters.")
      .max(240),
    description: z
      .string()
      .trim()
      .min(80, "Describe the workshop in at least 80 characters.")
      .max(8000),
    outcomes: z
      .array(z.string().trim().min(5).max(240))
      .min(2, "Add at least two learning outcomes.")
      .max(8),
    audience: z.string().trim().min(10).max(700),
    prerequisites: z.string().trim().max(700).default(""),
    topic: z.enum(["growing", "greenhouse", "livestock", "soil", "equipment"]),
    format: z.enum(["in-person", "live-online", "self-paced"]),
    level: z.enum(WORKSHOP_LEVELS),
    city: z.string().trim().max(100).default(""),
    state: z.string().trim().max(2).default(""),
    venue: z.string().trim().max(160).default(""),
    address: z.string().trim().max(200).default(""),
    postalCode: z.string().trim().max(12).default(""),
    startAt: optionalDate,
    endAt: optionalDate,
    registrationClosesAt: optionalDate,
    timeZone: z
      .string()
      .max(80)
      .refine((value) => {
        try {
          new Intl.DateTimeFormat("en-US", { timeZone: value });
          return true;
        } catch {
          return false;
        }
      }, "Choose a valid time zone."),
    scheduleNotes: z.string().trim().max(700).default(""),
    tuitionCents: z.number().int().min(0).max(10000000),
    priceNotes: z.string().trim().max(400).default(""),
    registrationUrl: publicWebUrl,
    organizerWebsite: optionalUrl,
    managementEmail: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
  })
  .superRefine((value, context) => {
    const issue = (path: string, message: string) =>
      context.addIssue({ code: "custom", path: [path], message });
    if (value.format !== "self-paced" && !value.startAt)
      issue("startAt", "Add the start date and time.");
    if (value.format === "self-paced" && (value.startAt || value.endAt))
      issue("startAt", "Self-paced courses should not have scheduled dates.");
    if (
      value.format === "in-person" &&
      (!value.city ||
        !US_STATES.some((state) => state.code === value.state) ||
        !value.venue ||
        !value.address)
    )
      issue("city", "Add a U.S. city, state, venue and street address.");
    if (
      value.endAt &&
      (!value.startAt || new Date(value.endAt) <= new Date(value.startAt))
    )
      issue("endAt", "The end must be after the start.");
    if (
      value.registrationClosesAt &&
      value.startAt &&
      new Date(value.registrationClosesAt) > new Date(value.startAt)
    )
      issue(
        "registrationClosesAt",
        "Registration must close by the course start.",
      );
  });
export type WorkshopInput = z.infer<typeof workshopSchema>;
export function validateUpcomingWorkshop(
  input: WorkshopInput,
  now = new Date(),
) {
  if (input.startAt && new Date(input.startAt) <= now)
    throw new Error("Choose a future course start date.");
  if (input.registrationClosesAt && new Date(input.registrationClosesAt) <= now)
    throw new Error("Registration must still be open.");
}

// Convert the organizer's wall-clock time, not the browser's time zone. Reject DST gaps.
export function localWorkshopDate(
  value: string,
  timeZone: string,
): string | null {
  if (!value) return null;
  const target = new Date(`${value}:00Z`);
  if (!Number.isFinite(target.getTime()))
    throw new Error("Enter a valid date and time.");
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  let result = target;
  for (let i = 0; i < 3; i++) {
    const displayed = new Date(
      `${formatter.format(result).replace(" ", "T")}:00Z`,
    );
    result = new Date(
      result.getTime() + target.getTime() - displayed.getTime(),
    );
  }
  if (formatter.format(result).replace(" ", "T") !== value)
    throw new Error(
      "That local time does not exist due to a daylight-saving change. Choose another time.",
    );
  return result.toISOString();
}
export function workshopWallTime(value: string | null, timeZone: string) {
  return value
    ? new Intl.DateTimeFormat("sv-SE", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .format(new Date(value))
        .replace(" ", "T")
    : "";
}
