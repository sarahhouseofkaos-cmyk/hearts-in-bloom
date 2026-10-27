import { Link } from 'react-router'
import { ArrowRight, Check, MapPin } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { email } from '../data'

const areas = [
  'Newcastle upon Tyne', 'Gateshead', 'Tynemouth & Whitley Bay', 'South Shields', 'Sunderland', 'Washington',
  'Cramlington', 'Ponteland', 'Morpeth', 'Hexham', 'Durham', 'Chester-le-Street', 'Consett', 'Alnwick',
]

export default function Areas() {
  return (
    <>
      <PageMeta title="Where we deliver" description="Free delivery, set-up and collection of heart arches and throne chairs within approximately 40 miles of Newcastle upon Tyne. Tailored travel quotations further afield." />
      <section className="page-hero">
        <p className="eyebrow">Where we deliver</p>
        <h1>Newcastle and<br /><em>the North East.</em></h1>
        <p>Free delivery, set-up and collection within approximately 40 miles of Newcastle upon Tyne. Further afield? Ask for a tailored travel quotation.</p>
        <div className="page-hero-note"><MapPin size={17} /> Based in Newcastle upon Tyne</div>
      </section>

      <section className="areas-section section-pad" data-reveal>
        <div>
          <p className="eyebrow">Typical areas within range</p>
          <h2>Most of Tyneside, Wearside,<br /><em>Durham and Northumberland.</em></h2>
          <p>These are the areas we are usually asked about. The 40-mile range is measured from Newcastle, so most venues in the region are covered. If yours is not on the list, just ask.</p>
        </div>
        <ul className="area-list">
          {areas.map((area) => <li key={area}><Check size={15} /> {area}</li>)}
        </ul>
      </section>

      <section className="areas-section section-pad" data-reveal>
        <div>
          <p className="eyebrow">What to tell us</p>
          <h2>So we can plan<br /><em>your venue properly.</em></h2>
        </div>
        <ul className="area-list single">
          <li><Check size={15} /> Venue name and town or postcode</li>
          <li><Check size={15} /> Ceremony indoors or outdoors, and an indoor alternative for weather</li>
          <li><Check size={15} /> Parking and access for set-up, including stairs, lifts and ground conditions</li>
          <li><Check size={15} /> Your set-up and collection windows agreed with the venue</li>
        </ul>
      </section>

      <section className="booking-callout section-pad" data-reveal>
        <div><p className="eyebrow">Further afield</p><h2>Planning a little<br /><em>further away?</em></h2></div>
        <div>
          <p>We are happy to look at venues beyond the 40-mile range. Travel is quoted separately, so tell us where and when and Sarah will come back with a clear figure.</p>
          <Link to="/enquire" className="text-link">Tell me about your venue <ArrowRight size={16} /></Link>
          <p className="areas-email">Prefer email? <a href={`mailto:${email}`}>{email}</a></p>
        </div>
      </section>
      <EnquiryBand />
    </>
  )
}
