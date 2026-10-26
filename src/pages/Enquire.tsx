import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowRight, Check, LoaderCircle, Mail } from 'lucide-react'
import { collection, email } from '../data'
import { PageMeta } from '../components/Layout'
import { enquiryForm } from '../enquiryConfig'
import { EnquiryError, MESSAGE_MAX_LENGTH, isFormConfigured, submitEnquiry, todayIso } from '../lib/enquiry'

export default function Enquire() {
  const [params] = useSearchParams()
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const successRef = useRef<HTMLDivElement>(null)
  const [sending, setSending] = useState(false)
  const formReady = isFormConfigured(enquiryForm)
  const requestedStyle = params.get('style')
  const requestedPackage = params.get('package')
  const styleName = collection.find((item) => item.slug === requestedStyle)?.name ?? (requestedStyle === 'dark-romance' ? 'Dark Romance / not sure yet' : '')
  const packageName = requestedPackage ? requestedPackage.split('-').map((word) => word === 'the' ? 'The' : word[0].toUpperCase() + word.slice(1)).join(' ') : ''
  const minimumDate = todayIso()

  useEffect(() => {
    if (reference) successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [reference])

  const defaultService = useMemo(() => {
    if (requestedPackage) return 'Heart arch + throne chairs package'
    if (requestedStyle === 'dark-romance' || collection.some((item) => item.slug === requestedStyle)) return 'Heart arch with artificial flowers'
    return ''
  }, [requestedPackage, requestedStyle])

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)
    if (data.get('consent') !== 'on') {
      setError('Please confirm that we may use your details to respond to your enquiry.')
      return
    }
    setSending(true)
    try {
      const result = await submitEnquiry({
        config: enquiryForm,
        startedAt,
        values: {
          name: String(data.get('name') || ''),
          email: String(data.get('email') || ''),
          phone: String(data.get('phone') || ''),
          eventDate: String(data.get('date') || ''),
          venue: String(data.get('venue') || ''),
          service: String(data.get('service') || ''),
          packageName: String(data.get('packageName') || ''),
          style: String(data.get('style') || ''),
          coverage: String(data.get('coverage') || ''),
          message: String(data.get('message') || ''),
          website: String(data.get('website') || ''),
        },
      })
      setReference(result.reference)
    } catch (submissionError) {
      setError(submissionError instanceof EnquiryError ? submissionError.message : 'Your enquiry could not be sent. Please try again or email Sarah directly.')
    } finally {
      setSending(false)
    }
  }

  function startAnotherEnquiry() {
    setReference('')
    setError('')
    setStartedAt(Date.now())
  }

  return (
    <>
      <PageMeta title="Check Your Date" description="Tell Sarah about your wedding date, venue and styling ideas. Make a personal Hearts in Bloom enquiry for heart arches, throne chairs and wedding packages." />
      <section className="enquire-layout">
        <aside className="enquire-aside">
          <p className="eyebrow">Begin your enquiry</p>
          <h1>Tell us about<br /><em>your day.</em></h1>
          <p>Share as much as you can — your date, venue and the look you have in mind. Sarah will reply personally, usually within 24–48 hours.</p>
          <div className="enquire-steps">
            <div><span>1</span><p><strong>Your ideas</strong>Tell us what you are imagining.</p></div>
            <div><span>2</span><p><strong>Your proposal</strong>Receive a personal quotation.</p></div>
            <div><span>3</span><p><strong>Your date, secured</strong>Confirm with a 30% deposit.</p></div>
          </div>
          <Link to="/booking-guide" className="booking-guide-link">Read the practical booking guide <ArrowRight size={16} /></Link>
          <a href={`mailto:${email}`} className="direct-email"><Mail size={18} />{email}</a>
        </aside>

        <div className="enquire-form-wrap">
          {reference ? (
            <div className="enquiry-success" role="status" ref={successRef}>
              <span className="success-icon"><Check size={28} /></span>
              <p className="eyebrow">Enquiry received</p>
              <h2>Thank you.<br /><em>Your day is in our thoughts.</em></h2>
              <p>Your enquiry has been sent to Hearts in Bloom. Sarah will reply personally, usually within 24–48 hours.</p>
              <div className="enquiry-reference"><span>Your reference</span><strong>{reference}</strong></div>
              <p className="success-note">Keep this reference with your enquiry. If your plans change, you can reply to Sarah with it.</p>
              <button type="button" className="button button-outline" onClick={startAnotherEnquiry}>Send another enquiry <ArrowRight size={16} /></button>
            </div>
          ) : (
            <form className="enquire-form" onSubmit={sendEnquiry}>
              <div className="form-heading"><span>Wedding &amp; event enquiry</span><p>Fields marked * are required.</p></div>
              <div className="form-grid two-col">
                <label>Your name *<input name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" /></label>
                <label>Email address *<input name="email" type="email" autoComplete="email" required maxLength={320} placeholder="you@example.com" /></label>
                <label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Optional" /></label>
                <label>Wedding / event date *<input name="date" type="date" min={minimumDate} required /></label>
              </div>
              <label>Venue or location *<input name="venue" type="text" required minLength={2} maxLength={200} placeholder="Venue name, town or postcode" /></label>
              <label>What are you interested in? *
                <select name="service" required defaultValue={defaultService}>
                  <option value="" disabled>Please select</option>
                  <option>Heart arch (undressed)</option>
                  <option>Heart arch with artificial flowers</option>
                  <option>Heart arch with fresh flowers</option>
                  <option>Throne chairs</option>
                  <option>Heart arch + throne chairs package</option>
                  <option>Coordinating styling</option>
                  <option>Other / not sure yet</option>
                </select>
              </label>
              <div className="form-grid two-col">
                <label>Preferred floral style
                  <select name="style" defaultValue={styleName} key={styleName}>
                    <option value="">Not sure yet</option>
                    {collection.map((item) => <option key={item.slug}>{item.name}</option>)}
                    <option>Dark Romance / not sure yet</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label>Floral coverage
                  <select name="coverage" defaultValue="">
                    <option value="">Not sure yet</option>
                    <option>Top half only</option>
                    <option>Fuller top</option>
                    <option>Full arch</option>
                  </select>
                </label>
              </div>
              {requestedPackage && <label>Selected package<input name="packageName" value={packageName} readOnly /></label>}
              <label>Your vision<textarea name="message" rows={5} maxLength={MESSAGE_MAX_LENGTH} placeholder="Tell us about your colours, atmosphere, timings, venue access or anything else that matters to you." /></label>
              <label className="form-hp" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
              <label className="consent-field"><input name="consent" type="checkbox" required /><span>I’m happy for Hearts in Bloom to use these details to respond to my enquiry, as explained in the <Link to="/privacy">Privacy Policy</Link>. This does not sign me up to marketing emails. *</span></label>
              <p className="form-note">Your enquiry is sent securely to Hearts in Bloom through MailerLite, the service we use to receive and keep track of enquiries. Your email app does not need to open, and sending an enquiry does not subscribe you to any mailing list.</p>
              {!formReady && <div className="form-error" role="status"><p>Online enquiries are being set up and will be available very soon.</p><a href={`mailto:${email}`}>Email {email} in the meantime</a></div>}
              {error && <div className="form-error" role="alert"><p>{error}</p><a href={`mailto:${email}`}>Email {email} instead</a></div>}
              <button type="submit" className="button button-primary form-submit" disabled={sending || !formReady}>
                {sending ? <>Sending your enquiry <LoaderCircle className="spin" size={17} /></> : <>Send my enquiry <ArrowRight size={17} /></>}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
