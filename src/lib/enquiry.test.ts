import { describe, expect, it, vi } from 'vitest'
import {
  EnquiryError,
  MESSAGE_MAX_LENGTH,
  MIN_FILL_MS,
  buildPayload,
  createReference,
  formEndpoint,
  isFormConfigured,
  submitEnquiry,
  todayIso,
  validateEnquiry,
  type EnquiryValues,
} from './enquiry'

const now = new Date('2026-10-27T12:00:00')
const config = { accountId: '1234567', formId: '987654321' }

const valid: EnquiryValues = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '',
  eventDate: '2027-06-12',
  venue: 'Seaton Delaval Hall',
  service: 'Throne chairs',
  packageName: '',
  style: 'Classic Ivory',
  coverage: '',
  message: 'We love gold and ivory.',
  website: '',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

describe('form configuration', () => {
  it('needs numeric account and form IDs', () => {
    expect(isFormConfigured(config)).toBe(true)
    expect(isFormConfigured({ accountId: '', formId: '' })).toBe(false)
    expect(isFormConfigured({ accountId: 'abc', formId: '12' })).toBe(false)
  })

  it('builds the public MailerLite endpoint from the IDs', () => {
    expect(formEndpoint(config)).toBe('https://assets.mailerlite.com/jsonp/1234567/forms/987654321/subscribe')
  })
})

describe('createReference', () => {
  it('produces HIB- plus eight upper-case characters', () => {
    expect(createReference()).toMatch(/^HIB-[0-9A-F]{8}$/)
    expect(createReference(() => 'abcd1234-ffff')).toBe('HIB-ABCD1234')
  })
})

describe('todayIso', () => {
  it('formats the local date', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('validateEnquiry', () => {
  it('accepts a complete enquiry', () => {
    expect(validateEnquiry(valid, now)).toBeNull()
  })

  it('accepts today but rejects past or impossible dates', () => {
    expect(validateEnquiry({ ...valid, eventDate: '2026-10-27' }, now)).toBeNull()
    expect(validateEnquiry({ ...valid, eventDate: '2026-10-26' }, now)).toMatch(/future date/)
    expect(validateEnquiry({ ...valid, eventDate: '2027-02-31' }, now)).toMatch(/future date/)
    expect(validateEnquiry({ ...valid, eventDate: '' }, now)).toMatch(/future date/)
  })

  it('rejects bad names, emails, venues and over-long messages', () => {
    expect(validateEnquiry({ ...valid, name: 'J' }, now)).toMatch(/name/)
    expect(validateEnquiry({ ...valid, email: 'not-an-email' }, now)).toMatch(/email/)
    expect(validateEnquiry({ ...valid, venue: ' ' }, now)).toMatch(/venue/)
    expect(validateEnquiry({ ...valid, service: '' }, now)).toMatch(/interested/)
    expect(validateEnquiry({ ...valid, message: 'x'.repeat(MESSAGE_MAX_LENGTH + 1) }, now)).toMatch(/under/)
  })
})

describe('buildPayload', () => {
  it('maps the enquiry onto MailerLite field names and includes the form markers', () => {
    const data = buildPayload(valid, 'HIB-ABCD1234', now)
    expect(data.get('fields[email]')).toBe('jane@example.com')
    expect(data.get('fields[name]')).toBe('Jane Smith')
    expect(data.get('fields[event_date]')).toBe('2027-06-12')
    expect(data.get('fields[venue]')).toBe('Seaton Delaval Hall')
    expect(data.get('fields[service]')).toBe('Throne chairs')
    expect(data.get('fields[floral_style]')).toBe('Classic Ivory')
    expect(data.get('fields[enquiry_message]')).toBe('We love gold and ivory.')
    expect(data.get('fields[enquiry_reference]')).toBe('HIB-ABCD1234')
    expect(data.get('ml-submit')).toBe('1')
    expect(data.get('anticsrf')).toBe('true')
  })

  it('leaves out empty optional fields', () => {
    const data = buildPayload(valid, 'HIB-ABCD1234', now)
    expect(data.has('fields[phone]')).toBe(false)
    expect(data.has('fields[package]')).toBe(false)
    expect(data.has('fields[floral_coverage]')).toBe(false)
  })

  it('records enquiry consent separately and never marketing consent', () => {
    const data = buildPayload(valid, 'HIB-ABCD1234', now)
    const consent = String(data.get('fields[enquiry_consent]'))
    expect(consent).toMatch(/contacted about this enquiry/)
    expect(consent).toMatch(/not marketing/)
    expect([...data.keys()].some((key) => /marketing|newsletter|gdpr/i.test(key))).toBe(false)
  })

  it('never includes anything that looks like an API token', () => {
    const keys = [...buildPayload(valid, 'HIB-ABCD1234', now).keys()].join(' ')
    expect(keys).not.toMatch(/token|authorization|bearer/i)
  })
})

describe('submitEnquiry', () => {
  const startedAt = now.getTime() - 5000

  it('posts to MailerLite and returns the reference on success', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ success: true }))
    const result = await submitEnquiry({ values: valid, config, startedAt, now, reference: 'HIB-ABCD1234', fetchFn })
    expect(result).toEqual({ reference: 'HIB-ABCD1234', delivered: true })
    expect(fetchFn).toHaveBeenCalledTimes(1)
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe(formEndpoint(config))
    expect(init.method).toBe('POST')
    expect(init.body).toBeInstanceOf(FormData)
  })

  it('reports a failure when MailerLite rejects the submission', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ success: false }, 422))
    await expect(submitEnquiry({ values: valid, config, startedAt, now, fetchFn })).rejects.toThrow(EnquiryError)
  })

  it('treats a success status without success:true as a failure', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('<html></html>', { status: 200 }))
    await expect(submitEnquiry({ values: valid, config, startedAt, now, fetchFn })).rejects.toThrow(/could not be sent/)
  })

  it('reports network failures without leaking details', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('boom jane@example.com'))
    await expect(submitEnquiry({ values: valid, config, startedAt, now, fetchFn })).rejects.toThrow(/connection/)
    await expect(submitEnquiry({ values: valid, config, startedAt, now, fetchFn })).rejects.not.toThrow(/jane@example/)
  })

  it('does not send anything when the honeypot is filled', async () => {
    const fetchFn = vi.fn()
    const result = await submitEnquiry({ values: { ...valid, website: 'http://spam.example' }, config, startedAt, now, fetchFn })
    expect(result.delivered).toBe(false)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('rejects submissions that arrive implausibly fast', async () => {
    const fetchFn = vi.fn()
    await expect(
      submitEnquiry({ values: valid, config, startedAt: now.getTime() - (MIN_FILL_MS - 100), now, fetchFn }),
    ).rejects.toThrow(/take a moment/)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('refuses to send while the form is not configured', async () => {
    const fetchFn = vi.fn()
    await expect(
      submitEnquiry({ values: valid, config: { accountId: '', formId: '' }, startedAt, now, fetchFn }),
    ).rejects.toThrow(/not switched on/)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('validates before sending', async () => {
    const fetchFn = vi.fn()
    await expect(
      submitEnquiry({ values: { ...valid, email: 'nope' }, config, startedAt, now, fetchFn }),
    ).rejects.toThrow(/email/)
    expect(fetchFn).not.toHaveBeenCalled()
  })
})
