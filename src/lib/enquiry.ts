/**
 * Enquiry submission for the static site.
 *
 * Enquiries are posted straight from the visitor's browser to the public
 * endpoint of a MailerLite embedded form, which stores them as a subscriber in
 * the "Website enquiries" group. There is no server, database or API token.
 * Enquiry consent is recorded in its own field and is never treated as
 * marketing consent.
 */

export const MESSAGE_MAX_LENGTH = 1000
export const MIN_FILL_MS = 800

export type EnquiryFormConfig = { accountId: string; formId: string }

export type EnquiryValues = {
  name: string
  email: string
  phone: string
  eventDate: string
  venue: string
  service: string
  packageName: string
  style: string
  coverage: string
  message: string
  /** Honeypot: real visitors never see or fill this field. */
  website: string
}

export type EnquiryResult = { reference: string; delivered: boolean }

export class EnquiryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnquiryError'
  }
}

export function isFormConfigured(config: EnquiryFormConfig): boolean {
  return /^\d+$/.test(config.accountId) && /^\d+$/.test(config.formId)
}

export function formEndpoint(config: EnquiryFormConfig): string {
  return `https://assets.mailerlite.com/jsonp/${config.accountId}/forms/${config.formId}/subscribe`
}

export function createReference(random: () => string = () => crypto.randomUUID()): string {
  return `HIB-${random().replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
export function todayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

/** Returns a visitor-friendly message for the first problem found, or null. */
export function validateEnquiry(values: EnquiryValues, now: Date = new Date()): string | null {
  if (values.name.trim().length < 2) return 'Please enter your name.'
  if (values.name.length > 100) return 'Your name is too long.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.length > 320) {
    return 'Please enter a valid email address.'
  }
  if (values.phone.length > 40) return 'Your phone number is too long.'
  if (!validDate(values.eventDate) || values.eventDate < todayIso(now)) {
    return 'Please choose today or a future date.'
  }
  if (values.venue.trim().length < 2) return 'Please enter your venue or location.'
  if (values.service.trim().length === 0) return 'Please tell us what you are interested in.'
  if (values.message.length > MESSAGE_MAX_LENGTH) {
    return `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`
  }
  return null
}

/**
 * Maps the enquiry onto the MailerLite form's field names. The custom fields
 * (event_date, venue, ...) must exist in MailerLite and be added to the form;
 * see README.md. MailerLite silently drops a submission (while still replying
 * success) if a field marked required on the form is missing, so optional
 * fields that were left blank are sent as NOT_PROVIDED instead of omitted.
 */
export const NOT_PROVIDED = 'Not provided'

export function buildPayload(values: EnquiryValues, reference: string, now: Date = new Date()): FormData {
  const data = new FormData()
  const add = (key: string, value: string) => {
    data.append(`fields[${key}]`, value.trim() === '' ? NOT_PROVIDED : value.trim())
  }
  add('email', values.email)
  add('name', values.name)
  add('phone', values.phone)
  add('event_date', values.eventDate)
  add('venue', values.venue)
  add('service', values.service)
  add('package', values.packageName)
  add('floral_style', values.style)
  add('floral_coverage', values.coverage)
  add('enquiry_message', values.message)
  add('enquiry_reference', reference)
  add('enquiry_consent', `Agreed to be contacted about this enquiry (not marketing) on ${now.toISOString()}`)
  data.append('ml-submit', '1')
  data.append('anticsrf', 'true')
  return data
}

type SubmitOptions = {
  values: EnquiryValues
  config: EnquiryFormConfig
  startedAt: number
  now?: Date
  reference?: string
  fetchFn?: typeof fetch
}

export async function submitEnquiry(options: SubmitOptions): Promise<EnquiryResult> {
  const { values, config, startedAt, fetchFn = fetch } = options
  const now = options.now ?? new Date()
  const reference = options.reference ?? createReference()

  const problem = validateEnquiry(values, now)
  if (problem) throw new EnquiryError(problem)

  // A filled honeypot means a bot: look successful, send nothing.
  if (values.website.trim() !== '') return { reference, delivered: false }

  if (now.getTime() - startedAt < MIN_FILL_MS) {
    throw new EnquiryError('Please take a moment to review your enquiry, then try again.')
  }
  if (!isFormConfigured(config)) {
    throw new EnquiryError('The enquiry form is not switched on yet. Please email Sarah directly.')
  }

  let response: Response
  try {
    response = await fetchFn(formEndpoint(config), { method: 'POST', body: buildPayload(values, reference, now) })
  } catch {
    throw new EnquiryError('Your enquiry could not be sent. Please check your connection or email Sarah directly.')
  }

  let body: { success?: boolean } | null = null
  try {
    body = (await response.json()) as { success?: boolean }
  } catch {
    body = null
  }
  if (!response.ok || body?.success !== true) {
    throw new EnquiryError('Your enquiry could not be sent. Please try again or email Sarah directly.')
  }
  return { reference, delivered: true }
}
