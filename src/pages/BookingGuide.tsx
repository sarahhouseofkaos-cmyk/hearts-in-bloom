import { Link } from 'react-router'
import { ArrowRight, CalendarCheck, Check, CloudSun, Flower2, MapPin, ShieldCheck } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'

const journey = [
  { number: '01', title: 'Share your plans', text: 'Send your date, venue, favourite pieces and the atmosphere you want to create. Sarah will usually reply within 24–48 hours.' },
  { number: '02', title: 'Receive your quotation', text: 'Your quotation is tailored to the styling, travel, setup and collection your celebration needs.' },
  { number: '03', title: 'Secure your date', text: 'A 30% non-refundable deposit and written acceptance of the Terms confirm your booking.' },
  { number: '04', title: 'Confirm the practicalities', text: 'Agree a suitable position, venue access, parking and the delivery, installation and collection arrangements.' },
  { number: '05', title: 'Complete your booking', text: 'The remaining balance is due no later than 14 days before your event. Then the agreed details are ready for the day.' },
]

const dayOfFlow = [
  { label: 'Arrival', title: 'Access at the agreed time', text: 'The team arrives within the arrangements agreed with you and your venue, with access and parking details already planned.' },
  { label: 'Installation', title: 'Positioned and styled', text: 'Your pieces are installed in the agreed position and the floral finishing details are carefully checked.' },
  { label: 'Your celebration', title: 'The setting is yours to enjoy', text: 'Once installation is complete, the setting is ready for your ceremony, portraits or time at the sweetheart table.' },
  { label: 'Collection', title: 'A quiet return', text: 'The team returns at the agreed time to collect the hired pieces, so you do not need to dismantle or move them.' },
]

const flowerGuides = [
  { name: 'Signature silk', price: 'Pre-dressed arch · £250', best: 'A considered look with a clear starting point', text: 'Our pre-dressed floral styling is the simplest route to a romantic heart arch. Choose the look and palette direction that feels closest to your day.' },
  { name: 'Higher-end bespoke', price: 'Styled arch + set-up · £350–£550+', best: 'A fuller shape and a more individual arrangement', text: 'A fuller, more bespoke arrangement gives greater scope around coverage, floral density and the overall shape of your setting.' },
  { name: 'Fresh flowers', price: 'Bespoke arch · £750–£2,000+', best: 'Seasonal flowers designed individually', text: 'Fresh-flower designs are quoted around your chosen flowers, coverage and season. A particular stem may need an equal-quality substitution.' },
]

export default function BookingGuide() {
  return (
    <>
      <PageMeta title="Practical Booking Guide" description="How Hearts in Bloom bookings work: deposits, final payment, venue access, setup, collection, outdoor weather planning, cancellations and care of your wedding styling." />
      <section className="page-hero booking-hero">
        <p className="eyebrow">The practical booking guide</p>
        <h1>Thoughtful details.<br /><em>A beautifully calm day.</em></h1>
        <p>From your first enquiry to the final collection, here is what to expect and what is useful to arrange with your venue.</p>
        <div className="page-hero-note"><CalendarCheck size={17} /> Your booking is confirmed with written acceptance and a 30% deposit</div>
      </section>

      <section className="booking-journey section-pad">
        <div className="section-heading horizontal-heading">
          <div><p className="eyebrow">From enquiry to event</p><h2>Your booking,<br /><em>step by step.</em></h2></div>
          <p>No confusing process and no unnecessary jargon. Every arrangement is confirmed personally for your celebration.</p>
        </div>
        <div className="booking-timeline">
          {journey.map((step) => (
            <article key={step.number} data-reveal>
              <span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="day-of-section section-pad">
        <div className="section-heading horizontal-heading">
          <div><p className="eyebrow">What happens on the day</p><h2>Quietly handled,<br /><em>from arrival to collection.</em></h2></div>
          <p>No fixed script and no last-minute guesswork. The timing and access details are agreed around your venue and celebration.</p>
        </div>
        <ol className="day-of-flow">
          {dayOfFlow.map((item, index) => (
            <li key={item.label} data-reveal>
              <span>0{index + 1} · {item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="booking-detail-grid section-pad">
        <article className="booking-detail" data-reveal>
          <MapPin size={23} />
          <p className="eyebrow">Before the day</p>
          <h2>Venue access &amp; setup</h2>
          <p>Please make sure your venue permits our team to deliver, install and collect your hired pieces at the agreed times.</p>
          <ul className="booking-checklist">
            <li><Check size={16} /> Provide venue contact and access details.</li>
            <li><Check size={16} /> Tell us about stairs, lifts, parking and level access.</li>
            <li><Check size={16} /> Agree a safe, suitable position and clear ground conditions.</li>
            <li><Check size={16} /> Confirm when the space is available for installation.</li>
          </ul>
          <p className="detail-note">Delivery, installation and collection take place on the event date unless otherwise agreed in writing.</p>
        </article>

        <article className="booking-detail" data-reveal>
          <CloudSun size={23} />
          <p className="eyebrow">Outdoor celebrations</p>
          <h2>A plan for the weather</h2>
          <p>The heart arch can be used outdoors, but it is not designed to withstand extreme weather. High winds, heavy rain and ground conditions all need to be considered.</p>
          <ul className="booking-checklist">
            <li><Check size={16} /> Discuss an indoor alternative with your venue.</li>
            <li><Check size={16} /> Choose a sheltered, level position where possible.</li>
            <li><Check size={16} /> Keep open flames and excessive heat away from hired pieces.</li>
          </ul>
          <p className="detail-note">You remain responsible for deciding whether outdoor conditions are suitable on the day.</p>
        </article>

        <article className="booking-detail" data-reveal>
          <ShieldCheck size={23} />
          <p className="eyebrow">During the hire</p>
          <h2>Looking after the pieces</h2>
          <p>Hired arches and equipment remain the property of Hearts in Bloom. Please take reasonable care of them throughout the agreed hire period.</p>
          <ul className="booking-checklist">
            <li><Check size={16} /> Only our team should move, alter or dismantle the arch.</li>
            <li><Check size={16} /> Avoid water damage, rough handling and unsafe placement.</li>
            <li><Check size={16} /> Ask us before changing the agreed arrangement.</li>
          </ul>
          <p className="detail-note">Loss or damage beyond fair wear and tear may be charged at the cost of repair or replacement.</p>
        </article>

        <article className="booking-detail" data-reveal>
          <Flower2 size={23} />
          <p className="eyebrow">Your chosen design</p>
          <h2>Flowers &amp; seasonal availability</h2>
          <p>We will make every effort to create the design discussed with you. Fresh-flower availability can vary with the seasons, so a particular stem may occasionally need to change.</p>
          <p>Any reasonable substitution will be of equal quality and similar appearance, keeping the agreed colour story and overall style at the centre of the design.</p>
          <p className="detail-note">If you prefer us not to take or use photographs of the styling at your event, please let us know in writing before the event date.</p>
        </article>
      </section>

      <section className="flower-guide section-pad">
        <div className="flower-guide-intro">
          <p className="eyebrow">Flowers, explained simply</p>
          <h2>Which finish feels<br /><em>right for your day?</em></h2>
          <p>You do not need to know the technical details before enquiring. Start with the look and level of styling you prefer; Sarah will confirm what suits your venue, date and design.</p>
          <Link to="/design-your-heart" className="text-link">Compare them in your moodboard <ArrowRight size={16} /></Link>
        </div>
        <div className="flower-guide-list">
          {flowerGuides.map((item) => (
            <article key={item.name} data-reveal>
              <div><h3>{item.name}</h3><strong>{item.price}</strong></div>
              <p className="flower-guide-best">{item.best}</p>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="changes-section section-pad" data-reveal>
        <div className="changes-intro">
          <p className="eyebrow">If your plans change</p>
          <h2>Changes, postponements<br /><em>&amp; cancellations.</em></h2>
          <p>Contact Sarah as soon as possible. A new event date is subject to availability, and any agreed changes should be confirmed in writing.</p>
          <Link to="/terms" className="text-link">Read the full Terms &amp; Conditions <ArrowRight size={16} /></Link>
        </div>
        <div className="cancellation-table">
          <div><span>More than 60 days before</span><p>The deposit is non-refundable; any balance already paid will be refunded.</p></div>
          <div><span>30–60 days before</span><p>50% of the total hire fee is payable.</p></div>
          <div><span>Less than 30 days before</span><p>The full hire fee is payable.</p></div>
          <small>Wedding insurance that covers floral and décor hire is strongly recommended.</small>
        </div>
      </section>

      <EnquiryBand
        eyebrow="Still planning the details?"
        title={<>Bring us your questions.<br />Keep the day feeling calm.</>}
        copy="You do not need to have every answer before getting in touch. Share what you know, and Sarah will help you work through the practical details."
        label="Check your date"
        to="/enquire"
      />
    </>
  )
}
