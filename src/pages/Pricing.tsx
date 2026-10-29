import { Link } from 'react-router'
import * as Accordion from '@radix-ui/react-accordion'
import { ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { faqs, individualPrices, packages, thrones } from '../data'
import { EnquiryBand, JsonLd, PageMeta } from '../components/Layout'
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

/** Photographs and plain-English inclusions for each package. */
const packageDetails: Record<string, { image: string; alt: string; includes: [string, boolean][] }> = {
  'the-classic': {
    image: '/images/arch-white-hydrangea.webp',
    alt: 'White hydrangea and rose heart arch',
    includes: [['Pre-dressed silk heart arch', true], ['Delivery, set-up & collection', true], ['Throne chairs', false], ['Coordinating styling', false]],
  },
  'the-ceremony': {
    image: '/images/throne-white-garden.webp',
    alt: 'A pair of carved white throne chairs in a country house garden',
    includes: [['Pre-dressed silk heart arch', true], ['A pair of throne chairs', true], ['Delivery, set-up & collection', true], ['Coordinating styling', false]],
  },
  'the-statement': {
    image: '/images/arch-pink-hydrangea.webp',
    alt: 'Full pink hydrangea and rose heart arch',
    includes: [['Fuller, bespoke-styled heart arch', true], ['A pair of throne chairs', true], ['Delivery, set-up & collection', true], ['Coordinating styling', false]],
  },
  'the-full-look': {
    image: '/images/gothic-sweetheart-table.webp',
    alt: 'Candlelit sweetheart table with gothic thrones and dark florals',
    includes: [['Fuller, bespoke-styled heart arch', true], ['A pair of throne chairs', true], ['Coordinating styling', true], ['Delivery, set-up & collection', true]],
  },
}

const archOptions = individualPrices.filter((item) => item.group === 'Signature Heart Arch')
const chairPrices = individualPrices.filter((item) => item.group === 'Throne Chairs & Styling' && item.name.toLowerCase().includes('throne'))
const stylingPrice = individualPrices.find((item) => item.name === 'Coordinating styling')?.price ?? 'From £75'

export default function Pricing() {
  return (
    <>
      <PageMeta title="Packages & Pricing" description="Heart arch hire from £150 and wedding packages from £400. Clear pricing, personal quotations and free local delivery from Hearts in Bloom." />
      <JsonLd id="faq-jsonld" data={faqSchema} />

      <section className="pr-hero">
        <div className="pr-hero-copy">
          <p className="eyebrow">Packages &amp; pricing</p>
          <h1>Clear prices.<br /><em>Beautiful settings.</em></h1>
          <p>Choose a package, or pick individual pieces. Every quotation is prepared personally by Sarah for your date, venue and style.</p>
          <ul className="pr-hero-facts">
            <li><strong>£150</strong><span>Heart arches from</span></li>
            <li><strong>£400</strong><span>Packages from</span></li>
            <li><strong>Free</strong><span>Delivery within ~40 miles</span></li>
          </ul>
          <div className="pr-hero-actions">
            <a href="#packages" className="button button-primary">See the packages <ArrowRight size={17} /></a>
            <Link to="/design-your-heart" className="text-link">Design your heart <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="pr-hero-photos" aria-hidden="true">
          <img src={asset('/images/arch-country-house-ivory.webp')} alt="" />
          <img src={asset('/images/throne-gold-garden.webp')} alt="" />
        </div>
      </section>

      <section className="pr-packages section-pad" id="packages">
        <div className="pr-head">
          <p className="eyebrow">Wedding packages</p>
          <h2>Four ways to <em>frame your day.</em></h2>
          <p>Every package includes delivery, set-up and collection locally, and can be styled in any of our Romantic or Dark Romance looks, or your own colours.</p>
        </div>
        <div className="pr-package-grid">
          {packages.map((item, index) => {
            const detail = packageDetails[item.slug]
            return (
              <article key={item.slug} className="pr-package">
                <div className="pr-package-image">
                  <img src={asset(detail.image)} alt={detail.alt} loading="lazy" />
                  <span>0{index + 1}</span>
                </div>
                <div className="pr-package-body">
                  <h3>{item.name}</h3>
                  <p className="pr-package-price"><small>From</small>{item.price.replace('From ', '')}</p>
                  <p className="pr-package-for">{item.bestFor}</p>
                  <ul>
                    {detail.includes.map(([label, included]) => (
                      <li key={label} className={included ? '' : 'not-included'}>
                        {included ? <Check size={15} aria-hidden="true" /> : <Minus size={15} aria-hidden="true" />}
                        <span>{label}{included ? '' : <em> (add from {label.startsWith('Throne') ? '£150' : '£75'})</em>}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/enquire?package=${item.slug}`} className="button button-outline">Enquire about {item.name.replace('The ', '')} <ArrowRight size={15} /></Link>
                </div>
              </article>
            )
          })}
        </div>
        <p className="pr-note">Bespoke fresh-flower arches and travel beyond about 40 miles of Newcastle are quoted individually.</p>
      </section>

      <section className="pr-pieces section-pad">
        <div className="pr-head">
          <p className="eyebrow">Individual pieces</p>
          <h2>Or choose <em>just what you need.</em></h2>
          <p>Mix and match. If you’re not sure what will suit your venue, Sarah will guide you.</p>
        </div>
        <div className="pr-piece-grid">
          <article className="pr-piece">
            <img src={asset('/images/arch-garden-blush.webp')} alt="Blush and ivory rose heart arch by a garden wall" loading="lazy" />
            <div>
              <h3>Signature heart arch</h3>
              <dl>
                {archOptions.map((option) => (
                  <div key={option.name}><dt>{option.name.replace(' + set-up', '')}</dt><dd>{option.price}</dd></div>
                ))}
              </dl>
              <Link to="/collection" className="text-link">See the arch looks <ArrowRight size={15} /></Link>
            </div>
          </article>
          <article className="pr-piece">
            <div className="pr-piece-thrones">
              {thrones.map((throne) => <img key={throne.name} src={asset(throne.image)} alt={`${throne.name} throne chairs`} loading="lazy" />)}
            </div>
            <div>
              <h3>Throne chairs</h3>
              <p>Gold, gothic black, white or our unique crown pair.</p>
              <dl>
                {chairPrices.map((option) => (
                  <div key={option.name}><dt>{option.name}</dt><dd>{option.price}</dd></div>
                ))}
              </dl>
              <Link to="/collection#thrones" className="text-link">See all four styles <ArrowRight size={15} /></Link>
            </div>
          </article>
          <article className="pr-piece">
            <img src={asset('/images/arch-candlelit-blush.webp')} alt="Heart arch surrounded by candles and blush florals" loading="lazy" />
            <div>
              <h3>Finishing touches</h3>
              <p>Coordinating styling that ties the setting together: candles, florals and small details matched to your arch.</p>
              <dl><div><dt>Coordinating styling</dt><dd>{stylingPrice}</dd></div></dl>
              <Link to="/enquire" className="text-link">Ask about styling <ArrowRight size={15} /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="pr-steps section-pad">
        <div className="pr-head">
          <p className="eyebrow">How booking works</p>
          <h2>Simple, personal, <em>taken care of.</em></h2>
        </div>
        <ol>
          <li><span>1</span><h3>Tell Sarah your plans</h3><p>Share your date, venue and the look you love, or send your Design your heart moodboard.</p></li>
          <li><span>2</span><h3>Receive your quotation</h3><p>A personal proposal for your celebration, with a clear price.</p></li>
          <li><span>3</span><h3>Secure your date</h3><p>A 30% deposit confirms your booking. The balance is due 14 days before your wedding.</p></li>
          <li><span>4</span><h3>Enjoy your day</h3><p>We deliver, set up and collect, so you don’t lift a thing.</p></li>
        </ol>
        <Link to="/booking-guide" className="text-link">Read the full booking guide <ArrowRight size={16} /></Link>
      </section>

      <section className="faq-section section-pad">
        <div><p className="eyebrow">Good to know</p><h2>Questions couples<br />often ask.</h2><p>Still unsure? Sarah will be happy to talk through your plans.</p></div>
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
        eyebrow="Now taking bookings for 2027 weddings"
        title={<>Found your favourite?<br />Check your date.</>}
        copy="Tell Sarah which package or pieces you’re considering, and she’ll prepare a personal quotation for your celebration."
        label="Check your date"
        to="/enquire"
      />
    </>
  )
}
