# Hearts in Bloom — technical handoff for Claude

## Project supplied

The accompanying `hearts-in-bloom-for-claude.zip` contains the complete Hearts in Bloom source project, excluding `node_modules`, generated `dist` output, `.git`, real `.env` files and credentials. `.env.example` is included intentionally.

There is currently no GitHub remote configured. The source commit in the original working project is `564acc6` (`Connect enquiries to MailerLite`). Create a new private GitHub repository for the owner and push this source as the initial repository state; do not ask for or use credentials in chat.

Read `README.md` before making changes. Preserve the website's design, content and working functionality.

## Current database and migration requirement

The existing `DATABASE_URL` belongs to the Kimi platform's cloud MySQL-compatible database. Its host is an Alibaba Cloud PrivateLink hostname in `ap-southeast-1`, using port `4000`. This platform database does not travel with exported source code and should not be treated as the production database for independently hosted deployment.

The current enquiries table contains **0 records** as checked on 2026-10-27. No enquiry data needs to be copied.

Actions:

1. Provision a new production MySQL-compatible database accessible from the selected hosting provider.
2. Set a new production `DATABASE_URL` directly in the host's secure environment-variable settings.
3. Use the existing Drizzle schema to create the enquiries table. Do not drop tables or use destructive migration options.
4. Verify a controlled enquiry is persisted, then delete that test record.

Do not copy the old `DATABASE_URL` into documentation, Git, logs or chat.

## Application and deployment

Stack: React 19, TypeScript, Vite, Hono, tRPC, Drizzle ORM and MySQL. The project includes a Dockerfile.

GitHub Pages is unsuitable because the enquiry form requires the backend and database. Use Node.js 20+ or Docker hosting connected to the owner's GitHub repository.

Required checks:

```bash
npm ci
npm run check
npm run lint
npm run test
npm run build
```

Production start: `npm start`.

The frontend builds to `dist/public/`; the bundled backend entry is `dist/boot.js`; the server listens on port `3000`.

## MailerLite

Follow the complete setup in `README.md`, including the dedicated `Website enquiries` group and all custom fields. Set these backend-only variables through the host's secure interface:

- `MAILERLITE_API_TOKEN`
- `MAILERLITE_GROUP_ID`

Do not expose them to frontend code, Git or logs. Do not add a `VITE_` prefix. Enquiry consent is not marketing consent. Preserve database-first storage so MailerLite failures do not discard enquiries.

## Public domain and email findings

Checked publicly on 2026-10-27:

- Domain: `heartsinbloom.co.uk`
- RDAP registrar: `Team Blue Internet Services UK Limited ... t/a names.co.uk`
- Nameservers: `ns0.phase8.net`, `ns1.phase8.net`, `ns2.phase8.net`
- MX records: `hermes.hosts.co.uk` and `athena.hosts.co.uk`, both priority `30`
- Current website A records: `3.125.172.46` and `3.73.27.108`
- `www.heartsinbloom.co.uk` currently points to `nco-heartsin.sitebuilder.names.uk`
- Registration date shown by RDAP: 2026-07-28
- Expiry date shown by RDAP: 2027-07-28

Although the domain was not found in the Namesco account already checked, public registration data names names.co.uk/Team Blue. Check whether it is in another Namesco/Team Blue account or managed by another account holder before attempting registrar changes.

Keep the domain registration and email service intact. Do not alter MX, SPF, DKIM, DMARC or other mail-related records as part of the website move.

Only after the new hosting works completely, replace the website A/AAAA/CNAME records required by that host. Configure the apex and `www` according to the host's instructions, enable HTTPS, and leave all email records unchanged.

## Verification and owner actions

Before DNS changes, verify all pages, direct routes, mobile layout, database persistence and MailerLite syncing using controlled test data; remove test records afterwards. Repeat website, HTTPS and form checks after DNS propagation.

The owner must perform account-level login, repository authorisation, secret entry and any registrar/DNS confirmation that Claude cannot complete through authorised tools. Never request passwords or access tokens in chat.
