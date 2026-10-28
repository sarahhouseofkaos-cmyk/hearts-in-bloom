import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { RealWeddings, Testimonials } from '../components/Proof'
import { asset } from '../lib/asset'
import { packages } from '../data'

const pieces = [
  { name: 'Signature heart arch', copy: 'The heart of the setting: undressed, silk-styled, or bespoke fresh flowers.', price: 'From £150', image: '/images/lush-ivory-greenery.webp', alt: 'Ivory rose and hydrangea heart arch with cascading greenery' },
  { name: 'Throne chairs', copy: 'Statement seating for your vows, portraits and sweetheart table.', price: 'From £150 each', image: '/images/throne-chairs.webp', alt: 'A couple seated on gold throne chairs from Hearts in Bloom' },
  { name: 'Finishing touches', copy: 'Coordinating styling — candles, florals and details that tie it all together.', price: 'From £75', image: '/images/gothic-sweetheart-table.webp', alt: 'Candlelit sweetheart table styled with dark florals and throne seating' },
]

export default function Home() {
  return (
    <>
      <PageMeta title="Wedding Styling & Luxury Hire in Newcastle upon Tyne" description="Romantic heart arches, throne chairs and personal wedding styling by Hearts in Bloom. Delivery, set-up and collection across Newcastle and the North East." />

      <section className="story-hero">
        <div className="story-hero-copy">
          <p className="eyebrow">Romantic wedding styling · Newcastle upon Tyne</p>
          <h1>A beautiful setting<br />for <em>your love story.</em></h1>
          <p className="story-hero-intro">Hello, I’m Sarah. I create hand-styled heart arches and statement settings for couples who want their wedding to feel personal, romantic and entirely their own.</p>
          <div className="hero-actions">
            <Link to="/enquire" className="button button-primary">Check your date <ArrowRight size={17} /></Link>
            <Link to="/design-your-heart" className="text-link">Design your heart <ArrowUpRight size={16} /></Link>
          </div>
          <p className="story-hero-booking">Now taking bookings for 2027 weddings</p>
        </div>
        <div className="story-hero-photo">
          <img src={asset('/images/hero-heart-arch.webp')} alt="A couple sharing a moment beneath a Hearts in Bloom floral heart arch" fetchPriority="high" />
        </div>
        <p className="story-hero-strapline">Styled by hand · Delivery, set-up and collection included within about 40 miles of Newcastle</p>
      </section>

      <section className="story-sarah" data-reveal>
        <div className="story-sarah-photo">
          <img src={asset('/images/styling-detail.webp')} alt="Sarah’s careful floral styling on a Hearts in Bloom heart arch" loading="lazy" />
          <span>Every petal placed by hand</span>
        </div>
        <div className="story-sarah-copy">
          <p className="eyebrow">The heart behind Hearts in Bloom</p>
          <h2>By hand. By heart.<br /><em>By Sarah.</em></h2>
          <p>Hearts in Bloom began with my love of soft, romantic details and the beauty of a well-styled moment. What matters most to me is creating something that feels like a natural part of your celebration.</p>
          <p>I’ll take the time to listen, understand your venue and learn what you have been imagining. From our first conversation to the final collection, you’ll always know who is looking after you.</p>
          <p className="story-sarah-signoff">Every arch is styled by hand. Every enquiry comes directly to me.</p>
          <Link to="/about" className="button button-outline">Meet Sarah &amp; our approach <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="story-collections section-pad" data-reveal>
        <div className="story-collections-heading">
          <p className="eyebrow">Find the atmosphere that feels like you</p>
          <h2>Every love story<br /><em>has its own feeling.</em></h2>
          <p>Begin with the mood you are drawn to. We can shape the colours, flowers and finishing details around your day.</p>
        </div>
        <div className="story-collection-grid">
          <article className="story-collection-romantic">
            <Link to="/collection" className="story-collection-image" aria-label="Explore the Romantic collection">
              <img src={asset('/images/romantic-heart-arch.webp')} alt="Red, blush and ivory floral heart arch styled for an indoor wedding ceremony" loading="lazy" />
            </Link>
            <div className="story-collection-copy">
              <p className="eyebrow">Romantic collection</p>
              <h3>For the quietly <em>romantic.</em></h3>
              <p>Classic ivory, delicate blush, cascading greenery and gentle natural textures.</p>
              <Link to="/collection" className="text-link">Explore the Romantic collection <ArrowUpRight size={17} /></Link>
            </div>
          </article>
          <article className="story-collection-dark">
            <Link to="/dark-romance" className="story-collection-image" aria-label="Enter the Dark Romance collection">
              <img src={asset('/images/gothic-throne-portrait.webp')} alt="Gothic throne chairs and candlelit styling from Hearts in Bloom" loading="lazy" />
            </Link>
            <div className="story-collection-copy">
              <p className="eyebrow">Dark Romance</p>
              <h3>For love with <em>a little edge.</em></h3>
              <p>Deep florals, gothic seating and candlelit details for a more atmospheric celebration.</p>
              <Link to="/dark-romance" className="text-link">Enter Dark Romance <ArrowUpRight size={17} /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="story-design" data-reveal>
        <div>
          <p className="eyebrow">A gentle place to begin</p>
          <h2>Not sure which heart<br /><em>belongs in your story?</em></h2>
        </div>
        <div>
          <p>Choose the atmosphere, flowers and details you love. Design your heart will guide you to a starting point and gather your ideas into an enquiry for Sarah.</p>
          <Link to="/design-your-heart" className="button button-primary">Design your heart <ArrowRight size={17} /></Link>
          <small>A helpful starting point, not a final quotation or live availability.</small>
        </div>
      </section>

      <section className="story-process section-pad" data-reveal>
        <div className="story-process-intro">
          <p className="eyebrow">From our first conversation to your final photograph</p>
          <h2>Your story,<br /><em>taken care of.</em></h2>
          <p>You do not need to know exactly what you want yet. Bring the ideas you have, and we will shape the setting together.</p>
        </div>
        <ol className="story-process-list">
          <li><span>01</span><div><h3>Tell me what you’re imagining</h3><p>Share your date, venue, favourite pieces and the feeling you want your day to hold.</p></div></li>
          <li><span>02</span><div><h3>Receive your personal proposal</h3><p>I’ll prepare a styling direction and clear quotation around your celebration.</p></div></li>
          <li><span>03</span><div><h3>Be present for every moment</h3><p>We deliver, install and collect, with the practical details taken care of.</p></div></li>
        </ol>
      </section>

      <section className="home-pieces section-pad" data-reveal>
        <div className="home-pieces-heading">
          <p className="eyebrow">Pieces you can hire</p>
          <h2>Choose one piece,<br /><em>or the whole setting.</em></h2>
        </div>
        <ul className="home-pieces-list">
          {pieces.map((piece) => (
            <li key={piece.name}>
              <div className="home-piece-image"><img src={asset(piece.image)} alt={piece.alt} loading="lazy" /></div>
              <h3>{piece.name}</h3>
              <p>{piece.copy}</p>
              <strong>{piece.price}</strong>
            </li>
          ))}
        </ul>
        <Link to="/pricing" className="text-link">See every piece &amp; price <ArrowRight size={16} /></Link>
      </section>

      <section className="home-packages" data-reveal>
        <div className="home-packages-heading">
          <p className="eyebrow">Packages &amp; pricing</p>
          <h2>Clear prices,<br /><em>personally quoted.</em></h2>
          <p>Heart arches from £150 on their own. Every package includes delivery, set-up and collection locally.</p>
        </div>
        <ul className="home-package-list">
          {packages.map((item) => (
            <li key={item.slug}>
              <h3>{item.name}</h3>
              <strong>{item.price}</strong>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
        <Link to="/pricing" className="text-link">Compare packages &amp; what’s included <ArrowRight size={16} /></Link>
      </section>

      <RealWeddings />
      <Testimonials />
      <EnquiryBand />
    </>
  )
}
