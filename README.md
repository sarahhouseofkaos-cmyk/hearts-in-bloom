# Hearts in Bloom

A complete, responsive redesign of [heartsinbloom.co.uk](https://heartsinbloom.co.uk), built with React, TypeScript, Vite, Hono, tRPC, Drizzle ORM and MySQL.

## Site structure

- Home
- Collection, with Romantic and Dark Romance filters and accessible image viewing
- Dark Romance
- Packages, pricing and practical FAQs
- Practical booking guide
- About and philosophy
- Inspiration guides
- Direct website enquiry form
- Terms, privacy and cookies
- Branded 404 page

## Working enquiries

The enquiry form validates submissions in the browser and on the server, includes a honeypot and per-connection rate limiting, and stores enquiries privately in MySQL. Each successful submission returns a reference in the format `HIB-XXXXXXXX`.

Enquiries are recorded with a `new` status for follow-up. When configured, the server also creates or updates the enquirer in MailerLite and adds the enquiry reference and event details to custom fields. The database save happens first, so a MailerLite outage does not discard the enquiry; the failure is logged using only its reference and a safe error message.

MailerLite is used for enquiry management, not as evidence of marketing consent. The form does not add a separate marketing opt-in or promise newsletter subscription. MailerLite subscriber syncing also does **not** send transactional notification emails; use a separate MailerLite automation only where appropriate, or a transactional-email provider, if you want email alerts. Visitors can still use the published email address as a fallback.

The relevant files are:

- Form UI: `src/pages/Enquire.tsx`
- Server validation and rate limiting: `api/enquiryRouter.ts`
- Database operation: `api/queries/enquiries.ts`
- MailerLite server integration: `api/services/mailerlite.ts`
- Database table: `db/schema.ts`

### MailerLite account setup

Keep the API token on the server. Never rename it with a `VITE_` prefix, put it in frontend code, or commit a real token.

1. In MailerLite, open **Integrations → MailerLite API → Use**, then choose **Generate new token**. Name it clearly, for example `Hearts in Bloom website`.
2. Create a dedicated group named **Website enquiries**. Find its ID under **Integrations → MailerLite API → Groups**.
3. In **Subscribers → Fields**, create these custom fields with the exact keys shown. MailerLite normally derives the key from the field name; check the API field list if your account uses a different key.

| Field name | API key | Type |
| --- | --- | --- |
| Event date | `event_date` | Date |
| Venue | `venue` | Text |
| Service | `service` | Text |
| Package | `package` | Text |
| Floral style | `floral_style` | Text |
| Floral coverage | `floral_coverage` | Text |
| Enquiry message | `enquiry_message` | Text |
| Enquiry reference | `enquiry_reference` | Text |

The standard `name` and `phone` fields are used automatically. Add these values to the local or production server environment (not the repository):

```bash
MAILERLITE_API_TOKEN=your_private_server_token
MAILERLITE_GROUP_ID=your_website_enquiries_group_id
```

The group ID is optional, but recommended to keep website enquiries separate. Without a token, enquiries continue to be stored privately in MySQL and MailerLite syncing is skipped. With an invalid token, unknown custom field or unavailable API, the enquiry remains in MySQL and the sync failure is logged. Resolve the configuration issue and follow up from the database record; the current integration does not automatically retry old submissions.

## Run locally

Use Node.js 20 or newer and a MySQL-compatible database.

1. Install dependencies: `npm ci`
2. Provide `DATABASE_URL` in `.env`. Add `MAILERLITE_API_TOKEN` and `MAILERLITE_GROUP_ID` after completing the MailerLite setup below. Never commit credentials.
3. Create or update the database table: `npm run db:push`
4. Start the site: `npm run dev`

Open `http://localhost:3000`. The development server includes the frontend and API.

## Quality checks and production build

```bash
npm run check
npm run lint
npm run build
```

The frontend is generated in `dist/public/`; the bundled server entry is `dist/boot.js`. Run the production server with `npm start`.

## Put it on GitHub

1. Create a new repository in your own GitHub account. A suitable name is `hearts-in-bloom`.
2. From this project directory, run:

```bash
git add .
git commit -m "Redesign Hearts in Bloom website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/hearts-in-bloom.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If the repository already has a remote, inspect it with `git remote -v` before changing it.

No password, database credential or access token is stored in this project. Authenticate Git using your own GitHub credentials or GitHub CLI.

## Deployment and custom domain

GitHub remains the source-code repository, but **GitHub Pages is no longer sufficient**: it serves static files only and cannot run the enquiry API or database connection.

Deploy the project to a Node.js host that supports the included `Dockerfile` or runs `npm start`. Configure the production `DATABASE_URL`, `MAILERLITE_API_TOKEN` and `MAILERLITE_GROUP_ID`, run the database schema setup, and point `heartsinbloom.co.uk` to that host using its current custom-domain instructions. The GitHub Actions workflow runs type-checking, linting and a production build on each push; it does not publish a static copy with a non-working form.

Important DNS guidance:

- Update only the website records required by your chosen host. Do not overwrite existing `MX` records, or domain email may stop working.
- DNS changes can take time to propagate.
- Enable HTTPS after the host recognises the domain.
- Moving DNS does not transfer the domain registration or mailbox hosting.

## Editing content

- Shared business details, collection entries, packages, prices and FAQs: `src/data.ts`
- Booking-guide content: `src/pages/BookingGuide.tsx`
- Legal copy: `src/legal.ts`
- Page content: `src/pages/`
- Shared header, footer and enquiry band: `src/components/Layout.tsx`
- Colours, typography and design tokens: `src/index.css`
- Layout and responsive styling: `src/App.css`
- Images: `public/images/`
- Image provenance: `CREDITS.md`

`vite.config.ts` uses `base: '/'` because the intended deployment is the custom-domain root.

## Photography and fonts

The site primarily uses Hearts in Bloom's own supplied imagery, with a small number of Pexels styling-inspiration photographs. Stock imagery is labelled as styling inspiration in the collection and is not presented as completed Hearts in Bloom work. See `CREDITS.md` for sources.

Marcellus and Jost are loaded from Google Fonts. For a fully self-hosted site, download and serve appropriately licensed font files locally instead.
