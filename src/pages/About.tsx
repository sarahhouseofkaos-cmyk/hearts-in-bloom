import { Link } from 'react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { asset } from '../lib/asset'

export default function About() {
  return (
    <>
      <PageMeta title="About Sarah" description="Meet Sarah, the personal wedding stylist behind Hearts in Bloom in Newcastle upon Tyne. Romantic details, thoughtful service and hand-styled heart arches." />
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">The person behind the petals</p>
          <h1>Hello,<br /><em>I’m Sarah.</em></h1>
          <p>The stylist behind Hearts in Bloom — a small wedding-styling business built on romantic details, thoughtful choices and genuinely personal care.</p>
        </div>
        <div className="about-hero-images">
          <img className="about-image-main" src={asset('/images/styling-detail.webp')} alt="Carefully arranged wedding florals" />
          <img className="about-image-small" src={asset('/images/throne-chairs.webp')} alt="Hearts in Bloom statement seating" />
        </div>
      </section>

      <section className="story-section section-pad" data-reveal>
        <div><p className="eyebrow">My story</p><h2>A love of the<br /><em>beautifully personal.</em></h2></div>
        <div className="story-copy">
          <p>Hearts in Bloom began with a simple love of soft, romantic details and the beauty of a well-styled moment. Based in Newcastle upon Tyne, I create signature heart arches and luxury hire pieces designed to frame the most meaningful parts of your day.</p>
          <p>Every arch is styled by hand, whether you prefer classic ivory, soft blush, lush greenery or something deeper and more atmospheric. My approach is personal and considered: I take time to understand your vision, your venue and the feeling you want to create.</p>
          <p>From our first conversation to the moment I finish setting up, everything is handled with calm and care. The finished look should feel like a natural part of your celebration — never something simply added on top.</p>
        </div>
      </section>

      <section className="values-section section-pad">
        <article data-reveal><span>Timeless</span><h2>Made to age beautifully.</h2><p>I favour sculptural forms and considered finishes that will still feel beautiful in your photographs years from now.</p></article>
        <article data-reveal><span>Personal</span><h2>Your story sets the style.</h2><p>Your colours, venue and atmosphere guide the design. No two celebrations should feel exactly the same.</p></article>
        <article data-reveal><span>Thoughtful</span><h2>Care in every detail.</h2><p>From the first email to the final collection, you will always know who is looking after you.</p></article>
      </section>

      <section className="location-section" data-reveal>
        <MapPin size={25} strokeWidth={1.25} />
        <p className="eyebrow">Based in Newcastle upon Tyne</p>
        <h2>Local hearts,<br />beautifully looked after.</h2>
        <p>Free delivery, set-up and collection within approximately 40 miles. Planning a little further afield? Ask for a tailored travel quotation.</p>
        <Link to="/enquire" className="text-link">Tell me about your venue <ArrowRight size={16} /></Link>
      </section>
      <EnquiryBand />
    </>
  )
}
