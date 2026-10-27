import { Link } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { email } from '../data'

export default function Planners() {
  return (
    <>
      <PageMeta title="For planners and venues" description="Heart arches and throne chairs for your couples, delivered, set up and collected across Newcastle and the North East. Talk to Hearts in Bloom about working together." />
      <section className="page-hero">
        <p className="eyebrow">For planners and venues</p>
        <h1>Statement pieces for<br /><em>your couples.</em></h1>
        <p>Signature heart arches and throne chairs, delivered, installed and collected, so the styling is one less thing for you to coordinate.</p>
        <div className="page-hero-note"><Check size={17} /> Personal service from Sarah, start to finish</div>
      </section>

      <section className="areas-section section-pad" data-reveal>
        <div>
          <p className="eyebrow">What we offer</p>
          <h2>Simple to include,<br /><em>easy to recommend.</em></h2>
          <p>Hearts in Bloom is a small, personal business. You will always deal with Sarah directly, from first message to final collection.</p>
        </div>
        <ul className="area-list single">
          <li><Check size={15} /> Heart arches, undressed or dressed in silk or fresh flowers</li>
          <li><Check size={15} /> Throne chairs and coordinating styling, including a Dark Romance collection</li>
          <li><Check size={15} /> Delivery, set-up and collection within approximately 40 miles of Newcastle</li>
          <li><Check size={15} /> Styling matched to the couple's palette and your venue</li>
          <li><Check size={15} /> Clear written terms and a 30% deposit to secure a date</li>
        </ul>
      </section>

      <section className="areas-section section-pad" data-reveal>
        <div>
          <p className="eyebrow">Working together</p>
          <h2>Tell us what<br /><em>you need.</em></h2>
          <p>Whether you are planning a single wedding or would like to be able to offer our pieces to couples regularly, get in touch and we will talk it through.</p>
        </div>
        <ul className="area-list single">
          <li><Check size={15} /> Planning a specific wedding? Send the date, venue and the couple's vision.</li>
          <li><Check size={15} /> Venue access, parking and timings are agreed in advance, as set out in the booking guide.</li>
          <li><Check size={15} /> Interested in an ongoing arrangement? Say so in your message and Sarah will reply personally.</li>
        </ul>
      </section>

      <section className="booking-callout section-pad" data-reveal>
        <div><p className="eyebrow">Get in touch</p><h2>Let's talk about<br /><em>your next wedding.</em></h2></div>
        <div>
          <p>Use the enquiry form and mention that you are a planner or venue, or email Sarah directly.</p>
          <Link to="/enquire" className="text-link">Start an enquiry <ArrowRight size={16} /></Link>
          <p className="areas-email"><a href={`mailto:${email}`}>{email}</a></p>
          <p className="areas-email"><Link to="/booking-guide" className="text-link">Read the practical booking guide <ArrowRight size={16} /></Link></p>
        </div>
      </section>
      <EnquiryBand />
    </>
  )
}
