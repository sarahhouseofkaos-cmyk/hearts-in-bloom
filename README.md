# Hearts in Bloom

A responsive static website for [heartsinbloom.co.uk](https://heartsinbloom.co.uk), built with React, TypeScript, Vite and Tailwind CSS. It is hosted free on **GitHub Pages**, and enquiries are received by **MailerLite**. There is no server, database or API token anywhere in this project.

## Site structure

- Home: a warm, story-led introduction from Sarah, opening with centred text above a wide cinematic heart-arch photograph, then following the couple’s meaningful moments through alternating split-layout Romantic and Dark Romance collection rows, personal booking care and clear next steps
- Collection, with an asymmetric editorial grid, wedding-moment pathways, combined Romantic/Dark Romance filters and accessible image viewing
- Dark Romance, with mood guidance and package starting points
- Design your heart: a four-step visual moodboard with a live image, palette and styling details, optional on-device saving, and a complete design summary carried into the enquiry form
- Packages, responsive package comparison, pricing and practical FAQs
- Practical booking guide with day-of service stages and a clear comparison of silk, higher-end bespoke and fresh-flower starting points
- About and philosophy
- Inspiration guides
- Enquiry form
- Terms, privacy and cookies
- Branded 404 page

## Develop locally

Use Node.js 20 or newer.

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Checks and production build

```bash
npm test             # unit tests for the enquiry and design-recommendation logic
npm run check        # TypeScript
npm run lint         # ESLint
npm run build        # static site in dist/
npm run verify:build # checks dist/: pages, assets, base path, no secrets or backend calls
```

`VITE_BASE` controls the path the site is served from (default `/`). The GitHub Actions workflow sets it for deployment; see "Hosting on GitHub Pages" below.

The build creates a real page for every route (for example `dist/collection/index.html`) plus `dist/404.html`, because GitHub Pages serves static files only. This means direct links and refreshes work and return a normal HTTP 200.

## How enquiries work

The enquiry page posts the visitor's details straight from their browser to the public endpoint of a MailerLite embedded form. MailerLite stores each enquiry as a subscriber in the **Website enquiries** group, with the enquiry details in custom fields.

- No API token is used or needed. The only values the site needs are the MailerLite **account ID** and **form ID**, which are public and live in `src/enquiryConfig.ts`.
- Enquiry consent and marketing consent are separate. The required checkbox covers using the details to answer the enquiry. It is recorded in the `enquiry_consent` field, and there is no marketing opt-in. Submitting an enquiry does not subscribe anyone to a newsletter. Never send campaigns to the Website enquiries group unless the person has separately asked to hear from you.
- The browser checks the form (name, email, a future date, venue, service, message length) and a hidden honeypot field catches simple bots. MailerLite applies its own spam protection too.
- The reference shown after sending (`HIB-XXXXXXXX`) is created in the browser and saved in the `enquiry_reference` field.
- If MailerLite cannot be reached, the visitor sees an error with the published email address as a fallback. While the form IDs are not set, the page shows a notice instead of a working form.

Design your heart does not calculate or promise a final quote. `src/lib/design.ts` maps selections to the closest existing package or separately priced items, and `src/pages/Enquire.tsx` prefills the visitor's style, package, service, coverage and editable design summary. Its recommendation and handoff logic is covered by `src/lib/design.test.ts`.

`src/moments.ts` holds the wedding-moment pathways and moodboard palette suggestions. These are styling guidance, not restrictions or additional service claims. A visitor can save a completed moodboard under the local-storage key `hearts-in-bloom-moodboard-v1`; it stays only in that browser on that device, does not sync elsewhere and is not sent to Hearts in Bloom unless the visitor sends it with an enquiry. The tool offers resume, removal and start-again actions, and storage failure does not block the enquiry journey.

Relevant files:

- `src/pages/Enquire.tsx`: form page
- `src/lib/enquiry.ts`: validation, payload and submission (tested in `src/lib/enquiry.test.ts`)
- `src/enquiryConfig.ts`: MailerLite account and form IDs

### MailerLite setup

1. **Group.** In *Subscribers → Groups*, create a group named **Website enquiries**.
2. **Custom fields.** In *Subscribers → Fields*, create these fields as **Text** fields. Use the exact names so MailerLite generates the keys shown (check the key in the fields list; the form code must use the same keys).

   | Field name | Key |
   | --- | --- |
   | Event date | `event_date` |
   | Venue | `venue` |
   | Service | `service` |
   | Package | `package` |
   | Floral style | `floral_style` |
   | Floral coverage | `floral_coverage` |
   | Enquiry message | `enquiry_message` |
   | Enquiry reference | `enquiry_reference` |
   | Enquiry consent | `enquiry_consent` |

   The standard `email`, `name` and `phone` fields are used as they are. Event date is a text field on purpose: the site sends `YYYY-MM-DD`, and a text field cannot reject it.
3. **Embedded form.** In *Forms → Embedded forms*, create a form named "Hearts in Bloom enquiry". Add the Email field (required), Name, Phone and all nine custom fields above. In the form's settings:
   - set the group to **Website enquiries**;
   - turn **double opt-in off**, because this is an enquiry, not a mailing-list sign-up (with it on, the enquirer would get a confirmation email and stay unconfirmed until they click it);
   - do not add any marketing or GDPR permission checkbox.
4. **Embed details.** Publish the form, then open *Get the HTML code* (not the JavaScript code). Copy the form's endpoint, which looks like `https://assets.mailerlite.com/jsonp/<ACCOUNT_ID>/forms/<FORM_ID>/subscribe`, and the list of `fields[...]` names in that code. Put the two IDs in `src/enquiryConfig.ts`.
5. **Test.** Send an enquiry from the live page, check it appears in the Website enquiries group with every field filled, then delete the test subscriber.

Things to know:

- Enquirers are ordinary MailerLite subscribers. They count towards your plan's subscriber limit, and MailerLite's charges depend on your plan and usage.
- MailerLite does not alert you to new enquiries by itself. Check the Website enquiries group regularly, or set up an automation or notification if your plan offers one.
- Only ever send campaigns to chosen groups, never to "all subscribers", so enquirers do not receive other mailings.
- MailerLite text fields may limit how long a value can be. `MESSAGE_MAX_LENGTH` in `src/lib/enquiry.ts` (currently 1000 characters) caps the message. Lower it if MailerLite rejects long messages.

## Hosting on GitHub Pages

The workflow in `.github/workflows/pages.yml` runs on every push and pull request: install, tests, type-check, lint, production build, build verification, and a check that every page, image and the 404 page are served correctly from a Pages-style folder. On pushes to `main` it then publishes `dist/` to GitHub Pages.

One-time repository setup (in the repository's *Settings*):

1. **Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. GitHub Pages is free for public repositories. For a private repository it needs a paid GitHub plan.

The site is served from the root of the custom domain, so the workflow sets `VITE_BASE: /`. (Before the domain was connected it used `/hearts-in-bloom/` for the temporary github.io address.)

### Switching to the custom domain

Do these in order, and only once the temporary address has been fully tested:

1. In the repository's *Settings → Pages → Custom domain*, enter `heartsinbloom.co.uk`.
2. In Namesco's DNS settings, change **only the website records**:
   - apex (`@`) `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - optionally the matching `AAAA` records listed in GitHub's current documentation
   - `www` `CNAME` to `<account>.github.io`
   - **Leave every `MX` record and all other email records (SPF, DKIM, DMARC) exactly as they are.** Do not transfer or cancel the domain or mailbox.
3. When GitHub shows the DNS check as passed, tick **Enforce HTTPS**.
4. Change `VITE_BASE` in `.github/workflows/pages.yml` to `/` and push, so the site is built for the root of the domain.
5. Re-check the live pages, a direct link such as `/pricing`, the mobile layout and a test enquiry, then delete the test subscriber.

## Testimonials and real weddings

`src/proof.ts` holds two lists, `testimonials` and `realWeddings`. Both are empty on purpose: nothing appears on the site until real entries are added, and nothing should be invented. Add an entry (with the couple's permission), put the photo in `public/images/`, push, and the Home page shows the section automatically.

## Search and contact details

- Structured data (business details and FAQs) is in `index.html` and `src/pages/Pricing.tsx`.
- Each page sets its own canonical address and social-preview title. `public/sitemap.xml` lists every page, so add new pages there and to the route lists in `src/App.tsx`, `scripts/static-pages.mjs`, `scripts/verify-build.mjs` and `.github/workflows/pages.yml`.

## Privacy

The privacy and cookies pages (`src/legal.ts`) describe this setup: enquiries are handled by MailerLite, the site is hosted on GitHub Pages, fonts come from Google Fonts, optional moodboards use browser-local storage rather than cookies, and no analytics or advertising cookies are used. If you add analytics, a different form provider or a different host, update those pages first.

## Images and credits

See `CREDITS.md`.
