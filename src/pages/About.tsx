import { Link } from 'react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { asset } from '../lib/asset'

export default function About() {
  return (
    <>
      <PageMeta title="About Sarah" description="Meet Sarah, the personal wedding stylist behind Hearts in Bloom in Newcastle upon Tyne. Romantic details, thoughtful service and hand-styled heart arches." />
      <section className="ed-spread">
        <div className="ed-text">
          <p className="ed-label"><span>Meet the stylist</span></p>
          <div className="ed-title-row">
            <h1 className="ed-title" aria-label="Sarah and Hearts in Bloom">
              <span>Sarah</span>
              <span className="ed-amp" aria-hidden="true">&amp;</span>
              <span className="ed-indent">Hearts</span>
              <span className="ed-indent">in Bloom</span>
            </h1>
            <p className="ed-standfirst">A small Newcastle studio of hand-styled heart arches and statement thrones, built on romantic detail and genuinely personal care.</p>
          </div>

          <div className="ed-story">
            <figure className="ed-story-photo">
              <img src={asset('/images/about-crown-thrones-couple.webp')} alt="A bride and groom holding hands on the Hearts in Bloom crown throne chairs at their reception" />
            </figure>
            <div className="ed-story-copy">
              <p className="ed-kicker">My story</p>
              <p className="ed-dropcap">Hearts in Bloom began with a simple love of soft, romantic details and the beauty of a well-styled moment. Based in Newcastle upon Tyne, I create signature heart arches and luxury hire pieces designed to frame the most meaningful parts of your day.</p>
              <p>Every arch is styled by hand, whether you prefer classic ivory, soft blush, lush greenery or something deeper and more atmospheric. My approach is personal and considered: I take time to understand your vision, your venue and the feeling you want to create.</p>
              <p>From our first conversation to the moment I finish setting up, everything is handled with calm and care, and every enquiry comes directly to me.</p>
            </div>
          </div>

          <aside className="ed-pull">
            <p className="ed-pull-label"><span>My promise</span></p>
            <blockquote>“The finished look should feel like a natural part of your celebration, never something simply added on top.”</blockquote>
          </aside>

          <p className="ed-credits">
            <span><b>Heart arches</b> Hearts in Bloom</span>
            <span><b>Throne chairs</b> Gold, gothic black, white &amp; the crown pair</span>
            <span><b>Styling</b> Sarah, by hand</span>
            <span><b>Based</b> Newcastle upon Tyne</span>
          </p>
        </div>

        <div className="ed-collage" aria-label="Hearts in Bloom weddings">
          <figure className="ed-c1"><img src={asset('/images/about-rose-detail.webp')} alt="Red and blush roses with pink hydrangea on a heart arch" /></figure>
          <figure className="ed-c2"><img src={asset('/images/about-white-rose-arch.webp')} alt="White rose heart arch in a formal rose garden" /></figure>
          <figure className="ed-c3"><img src={asset('/images/about-gold-throne-laugh.webp')} alt="A laughing bride on a gold lion throne chair beside her groom" /></figure>
          <figure className="ed-c4"><img src={asset('/images/about-garden-arch-couple.webp')} alt="A couple beneath a full blush and ivory floral heart arch in front of a country house" /></figure>
          <figure className="ed-c5"><img src={asset('/images/throne-black-garden.webp')} alt="A pair of ornate gothic black throne chairs on a garden lawn" /></figure>
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
      <EnquiryBand
        eyebrow="From your ideas to a personal proposal"
        title={<>Tell Sarah about<br />your day.</>}
        copy="Share your date, venue and the atmosphere you are imagining. Every enquiry comes directly to Sarah and is answered personally."
        label="Tell Sarah about your day"
        to="/enquire"
      />
    </>
  )
}
