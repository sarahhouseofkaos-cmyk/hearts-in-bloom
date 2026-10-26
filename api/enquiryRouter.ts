import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { createEnquiry } from "./queries/enquiries";
import { syncEnquiryToMailerLite } from "./services/mailerlite";
import { log } from "./lib/logger";

const services = [
  "Heart arch (undressed)",
  "Heart arch with artificial flowers",
  "Heart arch with fresh flowers",
  "Throne chairs",
  "Heart arch + throne chairs package",
  "Coordinating styling",
  "Other / not sure yet",
] as const;

function validEventDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
  return value >= new Date().toISOString().slice(0, 10);
}

const enquiryInput = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(320),
  phone: z.string().trim().max(40),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(validEventDate, "Please choose today or a future date"),
  venue: z.string().trim().min(2, "Please enter your venue or location").max(200),
  service: z.enum(services),
  packageName: z.string().trim().max(100),
  style: z.string().trim().max(100),
  coverage: z.string().trim().max(100),
  message: z.string().trim().max(3000),
  consent: z.literal(true),
  website: z.string().max(0),
  startedAt: z.number().int().positive(),
});

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(key: string) {
  const now = Date.now();
  if (attempts.size > 1000) {
    for (const [ip, entry] of attempts) if (entry.resetAt <= now) attempts.delete(ip);
  }
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  current.count += 1;
  if (current.count > MAX_ATTEMPTS) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many enquiries were sent from this connection. Please wait ten minutes or email Sarah directly." });
  }
}

export const enquiryRouter = createRouter({
  submit: publicQuery.input(enquiryInput).mutation(async ({ ctx, input }) => {
    const elapsed = Date.now() - input.startedAt;
    if (elapsed < 800 || elapsed < 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Please take a moment to review your enquiry, then try again." });
    }
    const forwarded = ctx.req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    checkRateLimit(forwarded || ctx.req.headers.get("x-real-ip") || "unknown");

    const reference = `HIB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await createEnquiry({
      reference,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      eventDate: input.eventDate,
      venue: input.venue,
      service: input.service,
      packageName: input.packageName || null,
      style: input.style || null,
      coverage: input.coverage || null,
      message: input.message || null,
    });

    let mailerLiteStatus: "synced" | "not-configured" | "failed" = "not-configured";
    try {
      mailerLiteStatus = await syncEnquiryToMailerLite({
        reference,
        name: input.name,
        email: input.email,
        phone: input.phone,
        eventDate: input.eventDate,
        venue: input.venue,
        service: input.service,
        packageName: input.packageName,
        style: input.style,
        coverage: input.coverage,
        message: input.message,
      });
    } catch (error) {
      // The database is the system of record: an external outage must not lose the enquiry.
      mailerLiteStatus = "failed";
      log.warn("Enquiry saved but MailerLite sync failed", {
        reference,
        error: error instanceof Error ? error.message : "Unknown MailerLite error",
      });
    }

    return { reference, mailerLiteStatus };
  }),
});
