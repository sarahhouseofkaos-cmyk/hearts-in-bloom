import { Link } from 'react-router'
import * as Accordion from '@radix-ui/react-accordion'
import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react'
import { faqs, individualPrices, packages } from '../data'
import { EnquiryBand, JsonLd, PageMeta } from '../components/Layout'
import PackageComparison from '../components/PackageComparison'
import { asset } from '../lib/asset'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export default function Pricing() {
  return (
    <>
      <PageMeta title="Packages & Pricing" description="Heart arch hire from £150 and wedding packages from £400. Clear pricing, personal quotations and free local delivery from Hearts in Bloom." />
      <JsonLd id="faq-jsonld" data={faqSchema} />
      <section className="page-hero pricing-hero lookbook-page-hero">
        <div className="lookbook-page-copy">
          <p className="eyebrow">Packages &amp; pricing</p>
          <h1>Beautiful moments.<br /><em>Beautifully clear.</em></h1>
          <p>Start with a package or choose individual pieces. Every final quotation is prepared personally for your celebration, venue and style.</p>
          <div className="page-hero-note"><Check size={17} /> Local delivery, set-up and collection included</div>
        </div>
        <div className="pricing-hero-art">
          <img src={asset('/images/styling-detail.webp')} alt="Floral detail from a Hearts in Bloom signature heart arch" />
          <div><span>Individual arches</span><strong>From £150</strong></div>
        </div>
      </section>

      <section className="packages-section section-pad">
        <div className="section-heading horizontal-heading">
          <div><p className="eyebrow">Wedding packages</p><h2>Considered combinations.</h2></div>
          <p>Pre-dressed packages use our signature silk styling. Higher-end designs include a fuller, more bespoke arrangement.</p>
        </div>
        <div className="package-list editorial-package-list">
          {packages.map((item) => (
            <article key={item.name} data-reveal>
              <div><h3>{item.name}</h3><p>{item.description}</p><small>{item.detail}</small></div>
              <strong>{item.price}</strong>
              <Link to={`/enquire?package=${item.slug}`} aria-label={`Enquire about ${item.name}`}><span>Enquire</span><ArrowUpRight size={20} /></Link>
            </article>
          ))}
        </div>
      </section>

      <PackageComparison />

      <section className="individual-section section-pad" data-reveal>
        <div className="individual-intro">
          <p className="eyebrow">Individual pieces</p>
          <h2>Build your own<br /><em>beautiful setting.</em></h2>
          <p>Mix and match the pieces you need. If you are unsure what will work best, tell us about your venue and we will guide you.</p>
          <Link to="/collection" className="text-link">Explore the collection <ArrowRight size={16} /></Link>
        </div>
        <div className="price-table">
          {['Signature Heart Arch', 'Throne Chairs & Styling'].map((group) => (
            <div className="price-group" key={group}>
              <h3>{group}</h3>
              {individualPrices.filter((item) => item.group === group).map((item) => (
                <div className="price-row" key={item.name}><span>{item.name}</span><strong>{item.price}</strong></div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="included-strip">
        <div><Check size={18} /><span>Personal consultation</span></div>
        <div><Check size={18} /><span>Tailored quotation</span></div>
        <div><Check size={18} /><span>Delivery &amp; installation</span></div>
        <div><Check size={18} /><span>Collection afterwards</span></div>
      </section>

      <section className="booking-callout section-pad" data-reveal>
        <div><p className="eyebrow">Plan with confidence</p><h2>The practical side,<br /><em>made simple.</em></h2></div>
        <div><p>Read what to expect before booking, how to prepare your venue, and how setup, outdoor weather, final payment and cancellations work.</p><Link to="/booking-guide" className="text-link">Open the practical booking guide <ArrowRight size={16} /></Link></div>
      </section>

      <section className="faq-section section-pad">
        <div><p className="eyebrow">The practical details</p><h2>A few things you<br />may be wondering.</h2><p>Still unsure? Sarah will be happy to talk through your plans.</p></div>
        <Accordion.Root type="single" collapsible className="faq-list">
          {faqs.map((item, index) => (
            <Accordion.Item value={`item-${index}`} key={item.question}>
              <Accordion.Header>
                <Accordion.Trigger>{item.question}<Plus size={19} /></Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content><p>{item.answer}</p></Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
      <EnquiryBand
        eyebrow="A clear starting point, a personal proposal"
        title={<>Found your combination?<br />Check your date.</>}
        copy="Tell Sarah which package or individual pieces you are considering. Your final quotation will be prepared around your celebration and venue."
        label="Check your date"
        to="/enquire"
      />
    </>
  )
}
