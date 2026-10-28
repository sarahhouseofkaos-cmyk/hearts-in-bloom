import { useContext, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, Facebook, Instagram, Menu, X } from 'lucide-react'
import Logo, { HeartMark } from './Logo'
import { email, socialLinks } from '../data'
import { HeadContext } from '../head'

const nav = [
  { to: '/collection', label: 'Collection' },
  { to: '/dark-romance', label: 'Dark Romance' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/inspiration', label: 'Inspiration' },
]

const SITE_URL = 'https://heartsinbloom.co.uk'

function PinterestIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )
}

function setHeadTag(selector: string, create: () => HTMLElement, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLElement>(selector)
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

export function PageMeta({ title, description }: { title: string; description: string }) {
  const { pathname } = useLocation()
  const head = useContext(HeadContext)
  // Only present while pre-rendering pages at build time (see src/entry-server.tsx).
  head?.setPage(`${title} | Hearts in Bloom`, description)
  useEffect(() => {
    const fullTitle = `${title} | Hearts in Bloom`
    document.title = fullTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
    const url = SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''))
    setHeadTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', url)
    const og = (property: string, content: string) =>
      setHeadTag(`meta[property="${property}"]`, () => { const m = document.createElement('meta'); m.setAttribute('property', property); return m }, 'content', content)
    og('og:title', fullTitle)
    og('og:description', description)
    og('og:url', url)
  }, [title, description, pathname])
  return null
}

/** Adds a JSON-LD block (structured data for search engines) while the page is shown. */
export function JsonLd({ id, data }: { id: string; data: object }) {
  const head = useContext(HeadContext)
  head?.addJsonLd(id, data)
  useEffect(() => {
    // Replace any copy written into the pre-rendered page.
    document.getElementById(id)?.remove()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [id, data])
  return null
}

function MobileCta() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/enquire')) return null
  return (
    <div className="mobile-cta">
      <Link to="/enquire" className="button button-primary">Check your date <ArrowRight size={16} /></Link>
    </div>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 60)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
  return null
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/enquire" className="header-cta">Check your date <ArrowRight size={15} /></Link>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="menu-button" aria-label="Open menu"><Menu size={23} /></button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="menu-overlay" />
            <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
              <div className="mobile-menu-top">
                <Dialog.Title className="mobile-menu-title">Explore Hearts in Bloom</Dialog.Title>
                <Dialog.Close className="icon-button" aria-label="Close menu"><X size={23} /></Dialog.Close>
              </div>
              <nav className="mobile-nav" aria-label="Mobile navigation">
                <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                {nav.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>)}
              </nav>
              <Link to="/enquire" className="button button-primary mobile-enquire" onClick={() => setOpen(false)}>Tell us about your day <ArrowRight size={17} /></Link>
              <div className="mobile-contact">
                <span>Newcastle upon Tyne</span>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}

export function EnquiryBand({ dark = false }: { dark?: boolean }) {
  return (
    <section className={`enquiry-band ${dark ? 'enquiry-band-dark' : ''}`}>
      <HeartMark className="enquiry-heart" />
      <p className="eyebrow">Your date, your venue, your vision</p>
      <h2>Let’s create the moment<br />your guests remember.</h2>
      <p>Tell Sarah what you have in mind. Every enquiry is answered personally, usually within 24–48 hours.</p>
      <Link to="/enquire" className={`button ${dark ? 'button-light' : 'button-primary'}`}>Begin your enquiry <ArrowRight size={17} /></Link>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo light />
          <p>Romantic heart arches, statement seating and thoughtful styling for beautifully personal celebrations.</p>
          <div className="social-links">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Hearts in Bloom on Instagram"><Instagram size={19} /></a>
            <a href={socialLinks.pinterest} target="_blank" rel="noreferrer" aria-label="Hearts in Bloom on Pinterest"><PinterestIcon size={18} /></a>
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Hearts in Bloom on Facebook"><Facebook size={19} /></a>
          </div>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/collection">The collection</Link>
          <Link to="/dark-romance">Dark Romance</Link>
          <Link to="/pricing">Packages &amp; pricing</Link>
          <Link to="/inspiration">Ideas &amp; inspiration</Link>
          <Link to="/booking-guide">Practical booking guide</Link>
          <Link to="/areas">Where we deliver</Link>
          <Link to="/planners">For planners &amp; venues</Link>
        </div>
        <div className="footer-column">
          <h3>Hearts in Bloom</h3>
          <Link to="/about">Meet Sarah</Link>
          <Link to="/enquire">Make an enquiry</Link>
          <a href={`mailto:${email}`}>{email}</a>
          <span>Newcastle upon Tyne, UK</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Hearts in Bloom</span>
        <div><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/cookies">Cookies</Link></div>
        <span>Free local delivery within approx. 40 miles</span>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollManager />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileCta />
    </>
  )
}
