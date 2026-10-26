import { describe, expect, it, vi } from "vitest";
import { syncEnquiryToMailerLite, type MailerLiteEnquiry } from "./mailerlite";

const enquiry: MailerLiteEnquiry = {
  reference: "HIB-TEST1234",
  name: "Test Person",
  email: "test@example.com",
  phone: "07123 456789",
  eventDate: "2027-06-12",
  venue: "Test Venue",
  service: "Throne chairs",
  packageName: "Dark Romance",
  style: "Gothic Throne",
  coverage: "Full arch",
  message: "Test enquiry",
};

describe("syncEnquiryToMailerLite", () => {
  it("does not call the API when no token is configured", async () => {
    const fetchMock = vi.fn();
    await expect(syncEnquiryToMailerLite(enquiry, {}, fetchMock)).resolves.toBe("not-configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("upserts the enquiry with server-side authentication and its group", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 201 }));
    await expect(syncEnquiryToMailerLite(enquiry, { token: "private-token", groupId: "12345" }, fetchMock)).resolves.toBe("synced");

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://connect.mailerlite.com/api/subscribers");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer private-token");
    const body = JSON.parse(options.body);
    expect(body.email).toBe(enquiry.email);
    expect(body.groups).toEqual(["12345"]);
    expect(body.fields).toMatchObject({
      name: enquiry.name,
      event_date: enquiry.eventDate,
      enquiry_reference: enquiry.reference,
      enquiry_message: enquiry.message,
    });
  });

  it("accepts an existing-subscriber response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    await expect(syncEnquiryToMailerLite(enquiry, { token: "private-token" }, fetchMock)).resolves.toBe("synced");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty("groups");
  });

  it("fails safely without including the token or API response in the error", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("sensitive response", { status: 401 }));
    await expect(syncEnquiryToMailerLite(enquiry, { token: "private-token" }, fetchMock)).rejects.toThrow("MailerLite request failed with HTTP 401");
    await expect(syncEnquiryToMailerLite(enquiry, { token: "private-token" }, fetchMock)).rejects.not.toThrow(/private-token|sensitive response/);
  });
});
