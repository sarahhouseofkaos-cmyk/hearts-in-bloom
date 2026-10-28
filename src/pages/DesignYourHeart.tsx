import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Heart, RotateCcw, Save } from 'lucide-react'
import { collection, thrones } from '../data'
import { PageMeta } from '../components/Layout'
import { asset } from '../lib/asset'
import { defaultPalette, lookPalettes, weddingMoments } from '../moments'
import {
  atmosphereFromParam,
  designEnquiryPath,
  emptyDesign,
  getDesignRecommendation,
  type Atmosphere,
  type DesignSelection,
  type Seating,
  type StylingLevel,
  type YesNo,
} from '../lib/design'

const steps = [
  { label: 'Atmosphere', title: 'What should it feel like?' },
  { label: 'Signature look', title: 'Find your starting point.' },
  { label: 'The details', title: 'Make the setting yours.' },
  { label: 'Your design', title: 'A beginning, beautifully considered.' },
]

const stylingOptions: { value: StylingLevel; title: string; detail: string }[] = [
  { value: 'signature', title: 'Signature silk', detail: 'Our pre-dressed floral styling.' },
  { value: 'higher', title: 'Higher-end bespoke', detail: 'A fuller, more bespoke arrangement.' },
  { value: 'fresh', title: 'Fresh flowers', detail: 'Seasonal and individually quoted.' },
]

const momentOptions = ['Ceremony', 'Portraits', 'Sweetheart table', 'Across the day']
const STORAGE_KEY = 'hearts-in-bloom-moodboard-v1'

function completeSelection(selection: DesignSelection) {
  return Boolean(selection.atmosphere && selection.styleSlug && selection.styling && selection.coverage && selection.seating && selection.coordinating && selection.moment)
}

function readSavedDesign(): DesignSelection | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as Partial<DesignSelection> | null
    if (!parsed || typeof parsed !== 'object') return null
    const selection = { ...emptyDesign, ...parsed }
    const look = collection.find((item) => item.slug === selection.styleSlug)
    if (!look || look.category !== selection.atmosphere) return null
    return selection
  } catch {
    return null
  }
}

function Chip({ selected, onClick, title, detail }: { selected: boolean; onClick: () => void; title: string; detail?: string }) {
  return (
    <button type="button" className={`dh-chip ${detail ? 'dh-chip-card' : ''} ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onClick}>
      <span className="dh-chip-tick" aria-hidden="true">{selected && <Check size={13} />}</span>
      <strong>{title}</strong>
      {detail && <small>{detail}</small>}
    </button>
  )
}

function Group({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="dh-group">
      <legend>{legend}</legend>
      {hint && <p>{hint}</p>}
      <div className="dh-group-options">{children}</div>
    </fieldset>
  )
}

export default function DesignYourHeart() {
  const [params] = useSearchParams()
  const requestedStyle = collection.find((item) => item.slug === params.get('style'))
  const initialAtmosphere = requestedStyle?.category ?? atmosphereFromParam(params.get('atmosphere'))
  const requestedMoment = weddingMoments.find((item) => item.slug === params.get('moment'))?.designLabel ?? ''
  const hasDeepLink = Boolean(params.get('style') || params.get('atmosphere') || params.get('moment'))
  const [step, setStep] = useState(0)
  const [furthest, setFurthest] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const initialStep = useRef(true)
  const [selection, setSelection] = useState<DesignSelection>({ ...emptyDesign, atmosphere: initialAtmosphere, styleSlug: requestedStyle?.slug ?? '', moment: requestedMoment })
  const [savedDesign, setSavedDesign] = useState<DesignSelection | null>(() => hasDeepLink ? null : readSavedDesign())
  const [saveNotice, setSaveNotice] = useState('')

  const looks = collection.filter((item) => item.category === selection.atmosphere && item.kind !== 'setting')
  const selectedLook = collection.find((item) => item.slug === selection.styleSlug)
  const completeDetails = Boolean(selection.styling && selection.coverage && selection.seating && selection.coordinating && selection.moment)
  const recommendation = useMemo(() => completeDetails ? getDesignRecommendation(selection) : null, [selection, completeDetails])
  const previewImage = selectedLook?.image ?? (selection.atmosphere === 'dark' ? asset('/images/gothic-sweetheart-table.webp') : asset('/images/hero-heart-arch.webp'))
  const palette = selectedLook ? lookPalettes[selectedLook.slug] ?? defaultPalette : defaultPalette
  const chosenThrone = selection.seating && selection.seating !== 'none' ? thrones.find((item) => item.name === selection.throneStyle) : undefined
  const seatingLabel = selection.seating === 'pair' ? 'Pair of thrones' : selection.seating === 'single' ? 'One throne' : selection.seating === 'none' ? 'No chairs' : ''
  const canContinue = step === 0 ? Boolean(selection.atmosphere) : step === 1 ? Boolean(selectedLook) : step === 2 ? completeDetails : true

  function update<K extends keyof DesignSelection>(key: K, value: DesignSelection[K]) {
    setSaveNotice('')
    setSelection((current) => ({ ...current, [key]: value }))
  }

  function chooseAtmosphere(atmosphere: Atmosphere) {
    setSaveNotice('')
    setSelection((current) => ({ ...current, atmosphere, styleSlug: current.atmosphere === atmosphere ? current.styleSlug : '' }))
  }

  function next() {
    if (!canContinue) return
    const destination = Math.min(step + 1, steps.length - 1)
    setStep(destination)
    setFurthest((current) => Math.max(current, destination))
  }

  function startAgain() {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* The design can still be restarted without storage. */ }
    setSavedDesign(null)
    setSaveNotice('')
    setSelection(emptyDesign)
    setStep(0)
    setFurthest(0)
  }

  function resumeSavedDesign() {
    if (!savedDesign) return
    setSelection(savedDesign)
    const destination = completeSelection(savedDesign) ? 3 : 0
    setStep(destination)
    setFurthest(destination)
    setSaveNotice('Your saved moodboard has been restored from this browser.')
  }

  function removeSavedDesign() {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* Nothing else is required if storage is unavailable. */ }
    setSavedDesign(null)
    setSaveNotice('')
  }

  function saveMoodboard() {
    if (!recommendation || !selectedLook) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
      setSavedDesign(selection)
      setSaveNotice('Moodboard saved in this browser on this device. It will not sync to another device.')
    } catch {
      setSaveNotice('This browser could not save your moodboard. You can still send the complete design to Sarah.')
    }
  }

  const enquiryPath = recommendation && selectedLook ? designEnquiryPath(selection, selectedLook.name, recommendation) : '/enquire'

  useEffect(() => {
    if (initialStep.current) {
      initialStep.current = false
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stageRef.current?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }, [step])

  return (
    <>
      <PageMeta title="Design Your Heart" description="Create a visual Hearts in Bloom wedding moodboard. Choose your atmosphere, signature arch, flowers and throne chairs, save on your device or send your design to Sarah." />
      <section className="dh-hero">
        <div className="dh-hero-copy">
          <p className="eyebrow">Your styling moodboard</p>
          <h1>Design <em>your heart.</em></h1>
          <p>Choose a feeling, a look and your finishing touches. Your moodboard builds as you go, then send it to Sarah for a personal proposal.</p>
        </div>
        <ol className="dh-hero-steps">
          <li><span>01</span><div><strong>Choose a feeling</strong><small>Romantic or Dark Romance</small></div></li>
          <li><span>02</span><div><strong>Pick your arch &amp; details</strong><small>Flowers, coverage and throne chairs</small></div></li>
          <li><span>03</span><div><strong>Send it to Sarah</strong><small>Or save it on this device for later</small></div></li>
        </ol>
      </section>

      <section className="dh-studio" aria-label="Design your heart configurator">
        <nav className="dh-stepper" aria-label="Design steps">
          <ol>
            {steps.map((item, index) => (
              <li key={item.label} className={index === step ? 'current' : index < step ? 'complete' : ''}>
                <button type="button" onClick={() => index <= furthest && setStep(index)} disabled={index > furthest} aria-current={index === step ? 'step' : undefined}>
                  <span className="dh-step-dot">{index < step ? <Check size={14} /> : index + 1}</span>
                  <span className="dh-step-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="dh-workspace">
          <div className="dh-stage" key={step} ref={stageRef}>
            <p className="eyebrow">Step {step + 1} of {steps.length}</p>
            <h2>{steps[step].title}</h2>

            {step === 0 && (
              <>
                {savedDesign && (
                  <div className="dh-saved">
                    <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <strong>Your saved moodboard is here.</strong>
                      <p>{collection.find((item) => item.slug === savedDesign.styleSlug)?.name} · saved in this browser on this device.</p>
                    </div>
                    <div className="dh-saved-actions">
                      <button type="button" className="button button-outline" onClick={resumeSavedDesign}>Resume</button>
                      <button type="button" className="dh-text-button" onClick={removeSavedDesign}>Remove</button>
                    </div>
                  </div>
                )}
                <div className="dh-atmos">
                  {([
                    ['romantic', 'Romantic', 'Soft light · Abundant florals', 'Ivory, blush and garden greenery.', '/images/arch-country-house-ivory.webp'],
                    ['dark', 'Dark Romance', 'Moody tones · Candlelit drama', 'Plum, crimson, teal and gothic details.', '/images/arch-crimson-noir.webp'],
                  ] as [Atmosphere, string, string, string, string][]).map(([value, name, mood, copy, image]) => (
                    <button type="button" key={value} className={`dh-atmos-card dh-atmos-${value} ${selection.atmosphere === value ? 'selected' : ''}`} aria-pressed={selection.atmosphere === value} onClick={() => chooseAtmosphere(value)}>
                      <img src={asset(image)} alt="" />
                      <span className="dh-atmos-text"><small>{mood}</small><strong>{name}</strong><em>{copy}</em></span>
                      <span className="dh-tick" aria-hidden="true">{selection.atmosphere === value && <Check size={16} />}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="dh-instruction">Choose the arch closest to your vision. Sarah can tailor the colours and details from there.</p>
                <div className="dh-looks">
                  {looks.map((item) => (
                    <button type="button" key={item.slug} className={`dh-look ${selection.styleSlug === item.slug ? 'selected' : ''}`} aria-pressed={selection.styleSlug === item.slug} onClick={() => update('styleSlug', item.slug)}>
                      <span className="dh-look-image"><img src={item.image} alt="" loading="lazy" /><span className="dh-tick" aria-hidden="true">{selection.styleSlug === item.slug && <Check size={15} />}</span></span>
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="dh-details">
                <Group legend="Flowers & finish">
                  {stylingOptions.map((option) => <Chip key={option.value} selected={selection.styling === option.value} onClick={() => update('styling', option.value)} title={option.title} detail={option.detail} />)}
                </Group>
                <Group legend="Floral coverage" hint="Sarah will confirm what suits your design.">
                  {['Top half only', 'Fuller top', 'Full arch'].map((option) => <Chip key={option} selected={selection.coverage === option} onClick={() => update('coverage', option)} title={option} />)}
                </Group>
                <Group legend="Throne chairs">
                  {([['none', 'No chairs'], ['single', 'One throne chair'], ['pair', 'A pair of thrones']] as [Seating, string][]).map(([value, label]) => <Chip key={value} selected={selection.seating === value} onClick={() => update('seating', value)} title={label} />)}
                </Group>
                {selection.seating && selection.seating !== 'none' && (
                  <fieldset className="dh-group">
                    <legend>Throne style <span>(optional)</span></legend>
                    <div className="dh-thrones">
                      {thrones.map((throne) => (
                        <button type="button" key={throne.name} className={`dh-throne ${selection.throneStyle === throne.name ? 'selected' : ''}`} aria-pressed={selection.throneStyle === throne.name} onClick={() => update('throneStyle', selection.throneStyle === throne.name ? '' : throne.name)}>
                          <span className="dh-throne-image"><img src={asset(throne.image)} alt="" loading="lazy" /><span className="dh-tick" aria-hidden="true">{selection.throneStyle === throne.name && <Check size={14} />}</span></span>
                          <strong>{throne.name}</strong>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
                <Group legend="Where will it frame your day?">
                  {momentOptions.map((option) => <Chip key={option} selected={selection.moment === option} onClick={() => update('moment', option)} title={option} />)}
                </Group>
                <Group legend="Coordinating styling" hint="Candles, florals and details that tie the setting together.">
                  {([['no', 'Not for now'], ['yes', 'Yes, include my ideas']] as [YesNo, string][]).map(([value, label]) => <Chip key={value} selected={selection.coordinating === value} onClick={() => update('coordinating', value)} title={label} />)}
                </Group>
              </div>
            )}

            {step === 3 && recommendation && selectedLook && (
              <div className="dh-result">
                <div className="dh-recommend" aria-live="polite">
                  <span>Your suggested starting point</span>
                  <h3>{recommendation.name}</h3>
                  <strong>{recommendation.price}</strong>
                  <p>{recommendation.description}</p>
                </div>
                <dl className="dh-summary">
                  <div><dt>Atmosphere</dt><dd>{selection.atmosphere === 'dark' ? 'Dark Romance' : 'Romantic'}</dd></div>
                  <div><dt>Arch</dt><dd>{selectedLook.name}</dd></div>
                  <div><dt>Flowers &amp; finish</dt><dd>{stylingOptions.find((item) => item.value === selection.styling)?.title}</dd></div>
                  <div><dt>Coverage</dt><dd>{selection.coverage}</dd></div>
                  <div><dt>Throne chairs</dt><dd>{seatingLabel}{chosenThrone ? ` · ${chosenThrone.name}` : ''}</dd></div>
                  <div><dt>Your moment</dt><dd>{selection.moment}</dd></div>
                  <div><dt>Coordinating styling</dt><dd>{selection.coordinating === 'yes' ? 'Include my ideas' : 'Not for now'}</dd></div>
                </dl>
                <p className="dh-note">Guide prices only. Nothing is booked yet: Sarah will personally confirm your design, availability and final quotation, which depends on your date, venue, travel and flowers.</p>
                <div className="dh-result-actions">
                  <Link to={enquiryPath} className="button button-primary">Send my design to Sarah <ArrowRight size={17} /></Link>
                  <button type="button" className="button button-outline" onClick={saveMoodboard}><Save size={16} />{saveNotice.startsWith('Moodboard saved') ? 'Saved' : 'Save on this device'}</button>
                </div>
                {saveNotice && <p className="dh-save-notice" role="status">{saveNotice}</p>}
              </div>
            )}

            <div className="dh-controls">
              {step > 0 ? <button type="button" className="dh-back" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
              {step < steps.length - 1 && <button type="button" className="button button-primary" disabled={!canContinue} onClick={next}>{step === 2 ? 'See my design' : 'Continue'} <ArrowRight size={17} /></button>}
              {step === steps.length - 1 && <button type="button" className="dh-back" onClick={startAgain}><RotateCcw size={15} /> Start again</button>}
            </div>
          </div>

          <aside className="dh-board" aria-label="Your moodboard">
            <p className="eyebrow">Your moodboard</p>
            <div className={`dh-board-images ${chosenThrone ? 'with-throne' : ''}`}>
              <div className="dh-board-main" key={previewImage}><img src={previewImage} alt={selectedLook ? `${selectedLook.name} preview` : 'Hearts in Bloom inspiration'} /></div>
              {chosenThrone && <div className="dh-board-throne" key={chosenThrone.name}><img src={asset(chosenThrone.image)} alt={`${chosenThrone.name} throne chairs`} /><span>{chosenThrone.name}</span></div>}
            </div>
            <h3>{selectedLook?.name ?? (selection.atmosphere === 'dark' ? 'Dark Romance' : selection.atmosphere === 'romantic' ? 'Romantic' : 'Begin with a feeling')}</h3>
            <p>{selectedLook?.description ?? 'Your choices will gather here as you go.'}</p>
            <div className="dh-palette" aria-label="Colour palette">
              {palette.map((colour) => <span key={colour.name}><i style={{ backgroundColor: colour.value }} aria-hidden="true" />{colour.name}</span>)}
            </div>
            <ul className="dh-tags">
              <li className={selection.styling ? '' : 'empty'}>{stylingOptions.find((item) => item.value === selection.styling)?.title ?? 'Flowers'}</li>
              <li className={selection.coverage ? '' : 'empty'}>{selection.coverage || 'Coverage'}</li>
              <li className={selection.seating ? '' : 'empty'}>{seatingLabel || 'Throne chairs'}{chosenThrone ? ` · ${chosenThrone.name}` : ''}</li>
              <li className={selection.moment ? '' : 'empty'}>{selection.moment || 'Your moment'}</li>
            </ul>
            {recommendation && <div className="dh-board-price"><small>Suggested starting point</small><strong>{recommendation.name} · {recommendation.price}</strong></div>}
          </aside>
        </div>
      </section>

      <section className="dh-after">
        <h2>Can’t see exactly what you have in mind?</h2>
        <p>Choose the closest look and tell Sarah what you’d change. The moodboard is a starting point, never a limit.</p>
        <Link to="/enquire" className="text-link">Make a simple enquiry instead <ArrowRight size={16} /></Link>
      </section>
    </>
  )
}
