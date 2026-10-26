const MAILERLITE_SUBSCRIBERS_URL = "https://connect.mailerlite.com/api/subscribers";
const REQUEST_TIMEOUT_MS = 10_000;

export type MailerLiteEnquiry = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  venue: string;
  service: string;
  packageName: string;
  style: string;
  coverage: string;
  message: string;
};

export type MailerLiteConfig = {
  token?: string;
  groupId?: string;
};

type FetchLike = typeof fetch;

/**
 * Stores enquiry details against a subscriber for enquiry management only.
 * This does not add separate marketing consent or send transactional email.
 */
export async function syncEnquiryToMailerLite(
  enquiry: MailerLiteEnquiry,
  config: MailerLiteConfig = {
    token: process.env.MAILERLITE_API_TOKEN,
    groupId: process.env.MAILERLITE_GROUP_ID,
  },
  fetchImpl: FetchLike = fetch,
): Promise<"synced" | "not-configured"> {
  const token = config.token?.trim();
  if (!token) return "not-configured";

  const response = await fetchImpl(MAILERLITE_SUBSCRIBERS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: enquiry.email,
      fields: {
        name: enquiry.name,
        phone: enquiry.phone,
        event_date: enquiry.eventDate,
        venue: enquiry.venue,
        service: enquiry.service,
        package: enquiry.packageName,
        floral_style: enquiry.style,
        floral_coverage: enquiry.coverage,
        enquiry_message: enquiry.message,
        enquiry_reference: enquiry.reference,
      },
      ...(config.groupId?.trim() ? { groups: [config.groupId.trim()] } : {}),
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  // MailerLite returns 201 for a new subscriber and 200 for an upsert.
  if (!response.ok) {
    throw new Error(`MailerLite request failed with HTTP ${response.status}`);
  }

  return "synced";
}
