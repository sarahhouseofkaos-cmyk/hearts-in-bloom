import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Heart, RotateCcw, Save } from 'lucide-react'
import { collection } from '../data'
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

function ChoiceButton({ selected, onClick, title, detail }: { selected: boolean; onClick: () => void; title: string; detail?: string }) {
  return (
    <button type="button" className={`design-option ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onClick}>
      <span className="design-option-check" aria-hidden="true">{selected && <Check size={14} />}</span>
      <strong>{title}</strong>
      {detail && <small>{detail}</small>}
    </button>
  )
}

function ChoiceGroup({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="design-fieldset">
      <legend>{legend}</legend>
      {hint && <p>{hint}</p>}
      <div className="design-choice-grid">{children}</div>
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

  const looks = collection.filter((item) => item.category === selection.atmosphere)
  const selectedLook = collection.find((item) => item.slug === selection.styleSlug)
  const completeDetails = Boolean(selection.styling && selection.coverage && selection.seating && selection.coordinating && selection.moment)
  const recommendation = useMemo(() => completeDetails ? getDesignRecommendation(selection) : null, [selection, completeDetails])
  const previewImage = selectedLook?.image ?? (selection.atmosphere === 'dark' ? asset('/images/gothic-sweetheart-table.webp') : asset('/images/hero-heart-arch.webp'))
  const palette = selectedLook ? lookPalettes[selectedLook.slug] ?? defaultPalette : defaultPalette
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
      <PageMeta title="Design Your Heart" description="Create a visual Hearts in Bloom wedding moodboard. Choose your atmosphere, signature look, flowers and seating, save on your device or send your design to Sarah." />
      <section className="design-hero">
        <p className="eyebrow">Your interactive styling moodboard</p>
        <h1>Design<br /><em>your heart.</em></h1>
        <p>Choose the atmosphere, flowers and finishing details you are drawn to. Watch your moodboard take shape, then save it on this device or send it to Sarah—never an automated final quote.</p>
      </section>

      <section className="design-studio" aria-label="Design your heart configurator">
        <div className="design-progress" style={{ '--design-progress': `${((step + 1) / steps.length) * 100}%` } as CSSProperties}>
          <div className="design-progress-line" aria-hidden="true"><span /></div>
          <ol>
            {steps.map((item, index) => (
              <li key={item.label} className={index === step ? 'current' : index < step ? 'complete' : ''}>
                <button type="button" onClick={() => index <= furthest && setStep(index)} disabled={index > furthest} aria-current={index === step ? 'step' : undefined}>
                  <span>0{index + 1}</span>{item.label}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="design-workspace">
          <div className="design-stage" key={step} ref={stageRef}>
            <p className="eyebrow">Step 0{step + 1} · {steps[step].label}</p>
            <h2>{steps[step].title}</h2>

            {step === 0 && (
              <>
                {savedDesign && (
                  <div className="saved-design-panel">
                    <Heart size={22} strokeWidth={1.4} aria-hidden="true" />
                    <div>
                      <strong>Your saved moodboard is here.</strong>
                      <p>{collection.find((item) => item.slug === savedDesign.styleSlug)?.name} · Stored only in this browser on this device.</p>
                    </div>
                    <div className="saved-design-actions">
                      <button type="button" className="button button-outline" onClick={resumeSavedDesign}>Resume moodboard</button>
                      <button type="button" className="text-button" onClick={removeSavedDesign}>Remove saved design</button>
                    </div>
                  </div>
                )}
                <div className="atmosphere-choices">
                  <button type="button" className={selection.atmosphere === 'romantic' ? 'selected' : ''} aria-pressed={selection.atmosphere === 'romantic'} onClick={() => chooseAtmosphere('romantic')}>
                    <img src={asset('/images/soft-blush-garden.webp')} alt="Soft blush romantic heart arch" />
                    <span><small>Soft light · Abundant florals</small><strong>Romantic</strong><em>Ivory, blush, greenery and garden-inspired palettes.</em></span>
                  </button>
                  <button type="button" className={selection.atmosphere === 'dark' ? 'selected' : ''} aria-pressed={selection.atmosphere === 'dark'} onClick={() => chooseAtmosphere('dark')}>
                    <img src={asset('/images/midnight-plum.webp')} alt="Midnight plum Dark Romance heart arch" />
                    <span><small>Moody tones · Quiet drama</small><strong>Dark Romance</strong><em>Plum, navy, teal, candlelight and Gothic details.</em></span>
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="design-instruction">Choose the look closest to your vision. Sarah can tailor the palette and details from there.</p>
                <div className="design-look-grid">
                  {looks.map((item) => (
                    <button type="button" key={item.slug} className={selection.styleSlug === item.slug ? 'selected' : ''} aria-pressed={selection.styleSlug === item.slug} onClick={() => update('styleSlug', item.slug)}>
                      <span className="design-look-image"><img src={item.image} alt={`${item.name} styling`} loading="lazy" /><i>{item.source}</i></span>
                      <span className="design-look-copy"><strong>{item.name}</strong><small>{item.description}</small></span>
                      <span className="design-look-selected" aria-hidden="true">{selection.styleSlug === item.slug && <Check size={15} />}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="design-details-form">
                <ChoiceGroup legend="Flowers & finish">
                  {stylingOptions.map((option) => <ChoiceButton key={option.value} selected={selection.styling === option.value} onClick={() => update('styling', option.value)} title={option.title} detail={option.detail} />)}
                </ChoiceGroup>
                <ChoiceGroup legend="Floral coverage" hint="Choose the shape you prefer; Sarah will confirm what suits your design.">
                  {['Top half only', 'Fuller top', 'Full arch'].map((option) => <ChoiceButton key={option} selected={selection.coverage === option} onClick={() => update('coverage', option)} title={option} />)}
                </ChoiceGroup>
                <ChoiceGroup legend="Statement seating">
                  {([['none', 'No chairs'], ['single', 'One throne chair'], ['pair', 'Pair of throne chairs']] as [Seating, string][]).map(([value, label]) => <ChoiceButton key={value} selected={selection.seating === value} onClick={() => update('seating', value)} title={label} />)}
                </ChoiceGroup>
                <ChoiceGroup legend="Where will it frame your day?">
                  {momentOptions.map((option) => <ChoiceButton key={option} selected={selection.moment === option} onClick={() => update('moment', option)} title={option} />)}
                </ChoiceGroup>
                <ChoiceGroup legend="Coordinating styling" hint="Finishing details that connect the wider setting.">
                  {([['no', 'Not for now'], ['yes', 'Yes, include my ideas']] as [YesNo, string][]).map(([value, label]) => <ChoiceButton key={value} selected={selection.coordinating === value} onClick={() => update('coordinating', value)} title={label} />)}
                </ChoiceGroup>
              </div>
            )}

            {step === 3 && recommendation && selectedLook && (
              <div className="design-result">
                <p className="design-result-intro">Your choices suggest this starting point. Nothing is booked yet, and Sarah will personally confirm the design, availability and final quotation.</p>
                <div className="design-recommendation" aria-live="polite">
                  <span>Suggested starting point</span>
                  <h3>{recommendation.name}</h3>
                  <strong>{recommendation.price}</strong>
                  <p>{recommendation.description}</p>
                </div>
                <dl className="design-summary-list">
                  <div><dt>Atmosphere</dt><dd>{selection.atmosphere === 'dark' ? 'Dark Romance' : 'Romantic'}</dd></div>
                  <div><dt>Signature look</dt><dd>{selectedLook.name}</dd></div>
                  <div><dt>Flowers & finish</dt><dd>{stylingOptions.find((item) => item.value === selection.styling)?.title}</dd></div>
                  <div><dt>Coverage</dt><dd>{selection.coverage}</dd></div>
                  <div><dt>Seating</dt><dd>{selection.seating === 'none' ? 'No chairs' : selection.seating === 'single' ? 'One throne chair' : 'Pair of throne chairs'}</dd></div>
                  <div><dt>Your moment</dt><dd>{selection.moment}</dd></div>
                  <div><dt>Coordinating styling</dt><dd>{selection.coordinating === 'yes' ? 'Include in my ideas' : 'Not for now'}</dd></div>
                </dl>
                <p className="design-price-note">Guide prices only. Your final quotation depends on your date, venue, travel, flowers and set-up requirements.</p>
                <div className="design-result-actions">
                  <Link to={enquiryPath} className="button button-primary">Send my design to Sarah <ArrowRight size={17} /></Link>
                  <button type="button" className="button button-outline" onClick={saveMoodboard}><Save size={16} />{saveNotice.startsWith('Moodboard saved') ? 'Moodboard saved' : 'Save on this device'}</button>
                </div>
                <p className="design-handoff-note">Send your choices to the enquiry form for review and editing, or save them in this browser to return here later.</p>
                {saveNotice && <p className="design-save-notice" role="status">{saveNotice}</p>}
              </div>
            )}

            <div className="design-controls">
              {step > 0 ? <button type="button" className="design-back" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
              {step < steps.length - 1 && <button type="button" className="button button-primary" disabled={!canContinue} onClick={next}>{step === 2 ? 'See my design' : 'Continue'} <ArrowRight size={17} /></button>}
              {step === steps.length - 1 && <button type="button" className="design-back" onClick={startAgain}><RotateCcw size={15} /> Start again</button>}
            </div>
          </div>

          <aside className="design-preview" aria-label="Your visual wedding moodboard">
            <div className="design-preview-image" key={previewImage}><img src={previewImage} alt={selectedLook ? `${selectedLook.name} design preview` : 'Hearts in Bloom design inspiration'} /></div>
            <div className="design-preview-caption">
              <p className="eyebrow">Your visual moodboard</p>
              <h3>{selectedLook?.name ?? (selection.atmosphere === 'dark' ? 'Dark Romance' : selection.atmosphere === 'romantic' ? 'Romantic' : 'Begin with a feeling')}</h3>
              <p>{selectedLook?.description ?? 'Your selections will gather here as you create your starting point.'}</p>
              <div className="moodboard-palette" aria-label="Moodboard colour palette">
                {palette.map((colour) => <span key={colour.name}><i style={{ backgroundColor: colour.value }} aria-hidden="true" /><small>{colour.name}</small></span>)}
              </div>
              <dl className="moodboard-details">
                <div><dt>Your moment</dt><dd>{selection.moment || 'To be chosen'}</dd></div>
                <div><dt>Floral shape</dt><dd>{selection.coverage || 'To be chosen'}</dd></div>
                <div><dt>Seating</dt><dd>{selection.seating === 'pair' ? 'Pair of thrones' : selection.seating === 'single' ? 'One throne' : selection.seating === 'none' ? 'No chairs' : 'To be chosen'}</dd></div>
              </dl>
              {selectedLook && <span>{selectedLook.source}</span>}
              {recommendation && <div className="design-preview-price"><small>Suggested starting point</small><strong>{recommendation.name} · {recommendation.price}</strong></div>}
            </div>
          </aside>
        </div>
      </section>

      <section className="design-aftercare">
        <p className="eyebrow">Personal from here</p>
        <h2>You bring the instinct.<br /><em>Sarah brings it to life.</em></h2>
        <p>The moodboard is a conversation starter, not a limitation. If you cannot see exactly what you have in mind, choose the closest look and tell Sarah what you would change.</p>
        <Link to="/enquire" className="text-link">Prefer a simple enquiry? Tell us your ideas <ArrowRight size={16} /></Link>
      </section>
    </>
  )
}
