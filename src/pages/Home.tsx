import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { asset } from '../lib/asset'
import { RealWeddings, Testimonials } from '../components/Proof'

export default function Home() {
  return (
    <>
      <PageMeta title="Wedding Styling & Luxury Hire in Newcastle upon Tyne" description="Romantic heart arches, throne chairs and personal wedding styling by Hearts in Bloom. Delivery, set-up and collection across Newcastle and the North East." />
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Romantic wedding styling · Newcastle upon Tyne</p>
          <h1>A beautiful setting<br />for <em>your love story.</em></h1>
          <p className="hero-intro">Hello, I’m Sarah. I create hand-styled heart arches and statement settings for couples who want their wedding to feel personal, romantic and entirely their own.</p>
          <div className="hero-actions">
            <Link to="/about" className="button button-primary">Discover our story <ArrowRight size={17} /></Link>
            <Link to="/collection" className="text-link">Explore the collection <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <div className="hero-visual">
          <picture>
            <source media="(min-width: 901px)" srcSet={asset('/images/ceremony-inspiration.webp')} />
            <img src={asset('/images/hero-heart-arch.webp')} alt="A couple embracing beneath a romantic floral heart arch" fetchPriority="high" />
          </picture>
          <div className="hero-caption"><span>Arches from £150</span><span>Free delivery within ~40 miles</span><span>Replies in 24–48 hours</span></div>
        </div>
      </section>

      <section className="manifesto section-pad" data-reveal>
        <p className="eyebrow">The Hearts in Bloom philosophy</p>
        <p className="manifesto-text">Not simply a backdrop, but the frame around a promise. <em>Romantic, considered and entirely personal.</em></p>
        <Link to="/about" className="text-link">Our approach <ArrowRight size={16} /></Link>
      </section>

      <section className="feature-split" data-reveal>
        <div className="feature-image mask-image">
          <img src={asset('/images/soft-blush-garden.webp')} alt="Soft blush floral arch in a garden" loading="lazy" />
          <span className="image-index">The Romantic Collection</span>
        </div>
        <div className="feature-copy">
          <p className="eyebrow">Soft light · Abundant florals</p>
          <h2>Romance,<br /><em>in full bloom.</em></h2>
          <p>From classic ivory to blush garden roses, cascading greenery and coastal pampas, our signature heart is a starting point — never a limitation.</p>
          <ul className="detail-list">
            <li><Check size={16} /> Tailored to your colour palette</li>
            <li><Check size={16} /> Silk and fresh-flower options</li>
            <li><Check size={16} /> Delivery, installation and collection</li>
          </ul>
          <Link to="/collection" className="text-link">Discover the romantic collection <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="feature-split feature-reverse dark-feature" data-reveal>
        <div className="feature-image mask-image">
          <img src={asset('/images/gothic-throne-portrait.webp')} alt="Hearts in Bloom Gothic throne chairs and candlelit wedding styling" loading="lazy" />
          <span className="image-index">The Dark Romance Collection</span>
        </div>
        <div className="feature-copy">
          <p className="eyebrow">Moody tones · Candlelit drama</p>
          <h2>For love with<br /><em>a little edge.</em></h2>
          <p>Gothic throne chairs, candlelit details and rich floral palettes. A collection for gothic souls, alternative celebrations and couples who dream in deeper tones.</p>
          <Link to="/dark-romance" className="button button-light">Enter Dark Romance <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="home-gallery section-pad" data-reveal>
        <div className="section-heading horizontal-heading">
          <div><p className="eyebrow">Details make the day</p><h2>A setting that feels<br /><em>like you.</em></h2></div>
          <p>Ceremony backdrop, portrait setting or sweetheart table — each piece is styled to belong naturally in your celebration.</p>
        </div>
        <div className="editorial-gallery">
          <figure className="gallery-tall"><img src={asset('/images/throne-chairs.webp')} alt="Hearts in Bloom gold throne chairs" loading="lazy" /><figcaption>Statement seating</figcaption></figure>
          <figure><img src={asset('/images/classic-ivory.webp')} alt="Ivory floral detail from a Hearts in Bloom heart arch" loading="lazy" /><figcaption>Considered details</figcaption></figure>
          <figure><img src={asset('/images/hero-heart-arch.webp')} alt="Couple framed by a Hearts in Bloom floral heart arch" loading="lazy" /><figcaption>Your moment, framed</figcaption></figure>
        </div>
      </section>

      <RealWeddings />
<Testimonials />

<section className="pricing-preview section-pad" data-reveal>
        <div className="pricing-preview-intro">
          <p className="eyebrow">Packages from £400</p>
          <h2>Beautifully simple.<br />Clearly priced.</h2>
          <p>Choose a considered package or individual pieces. Every quotation is prepared personally for your date, venue and style.</p>
          <Link to="/pricing" className="text-link">View packages &amp; pricing <ArrowRight size={16} /></Link>
        </div>
        <div className="pricing-lines">
          <div><span>The Classic</span><strong>From £400</strong></div>
          <div><span>The Ceremony</span><strong>From £550</strong></div>
          <div><span>The Statement</span><strong>From £650</strong></div>
          <div><span>The Full Look</span><strong>From £750</strong></div>
        </div>
      </section>

      <section className="process-section section-pad" data-reveal>
        <p className="eyebrow">From first idea to final petal</p>
        <h2>Calm, personal, taken care of.</h2>
        <div className="process-grid">
          <div><span>01</span><h3>Tell us your vision</h3><p>Share your date, venue, favourite pieces and the atmosphere you want to create.</p></div>
          <div><span>02</span><h3>Receive your proposal</h3><p>Sarah prepares a personal quotation and styling direction for your celebration.</p></div>
          <div><span>03</span><h3>Simply enjoy the moment</h3><p>We deliver, install and collect, with every practical detail taken care of.</p></div>
        </div>
      </section>

      <section className="about-preview" data-reveal>
        <div className="about-preview-image mask-image"><img src={asset('/images/lush-ivory-greenery.webp')} alt="Ivory floral heart arch styling by Hearts in Bloom" loading="lazy" /></div>
        <div className="about-preview-copy">
          <p className="eyebrow">The person behind the business</p>
          <h2>Hello, I’m Sarah.</h2>
          <p>I created Hearts in Bloom from a love of romantic details and beautifully styled moments. I’ll take the time to understand your venue, your colours and the feeling you want your day to hold.</p>
          <p>Nothing is off-the-shelf in spirit. Every arch is hand-styled with care, and every enquiry comes directly to me.</p>
          <Link to="/about" className="text-link">More about Hearts in Bloom <ArrowRight size={16} /></Link>
        </div>
      </section>

      <EnquiryBand />
    </>
  )
}
