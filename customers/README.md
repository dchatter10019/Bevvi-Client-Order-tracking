# Customer Configuration Files

Each `.md` file in this folder defines one white-labeled customer. Drop in a new
file and the dashboard picks it up automatically — no code changes required.

## Production deployment (one build, many brands)

Deploy **one** frontend build. The active customer is chosen from the URL hostname:

```
https://ordertracker.getbevvi.com              → All customers (internal hub)
https://ac-ordertracker.getbevvi.com           → Air Culinaire skin
https://island-ordertracker.getbevvi.com       → Island Kitchen skin
https://netjets-ordertracker.getbevvi.com      → NetJets skin
```

Set a custom white-label hostname per customer in `## Monitor Settings`:

```markdown
- hostname: ac-ordertracker.getbevvi.com
```

If no custom hostname is set, the default is `https://<id>.ordertracker.getbevvi.com`.
DNS must point each hostname at the same host.

Adding a new white-label site:

1. Add `customers/<id>.md` with `- hostname: your-subdomain.getbevvi.com`.
2. Deploy the shared build (no per-customer build step).
3. Create DNS for that hostname.

## Local dev: choosing the customer

`npm run dev` and `npm run build` start by asking which company the run is for:

```
Which company is this build for?

  0) All customers (switchable in-app)
  1) Air Culinaire Worldwide (airculinaire)

Select [Enter = Air Culinaire Worldwide]:
```

- Picking a company simulates a white-label site locally via `VITE_CUSTOMER` in
  `.env.local` (no customer dropdown).
- Picking **All customers** keeps the in-app switcher on `localhost`.
- Re-run the prompt anytime with `npm run customer`.
- To test hostname routing locally, add a hosts entry such as
  `127.0.0.1 airculinaire.ordertracker.getbevvi.com` and open that URL.
- Non-interactive runs (CI) skip the prompt and use the saved selection.

## File format

Customer files are **design-system documents** — the same markdown you'd hand a
designer. The app automatically extracts brand tokens from them:

| What | Where it's read from |
|---|---|
| Company name | `**Company:** Name` line (or the `# H1` heading) |
| Primary brand color | `--color-primary: #hex` token |
| Hover/pressed shade | `--color-primary-dark: #hex` |
| Light tint | `--color-primary-light: #hex` |
| Dark panels / sidebar | `--color-navy: #hex` |
| Page background | `--color-off-white: #hex` |
| Body font | `--font-body: 'Name', ...` (loaded from Google Fonts) |
| Display font | `--font-display: 'Name', ...` |

A full light-to-dark shade scale is generated from the primary color, so every
accent in the UI re-themes automatically.

### Required: Monitor Settings section

Append these sections to the design-system file (see `airculinaire.md`):

```markdown
## Monitor Settings

- id: apiclientid            (the `client` value sent to the Bevvi API — required)
- tagline: Brand tagline.    (login panel + receipt)
- logo: /logos/customer.png  (path under public/)
- favicon: /favicons/customer.png

## Order Statuses

- 0: Pending                 (maps numeric corpOrderStatus codes to labels)
- 1: Accepted
- 2: Delivered
- 3: In Transit
- 4: Canceled
- 5: Rejected
- 6: In Transit

## Status Pipeline

- Pending                    (filter pills above the order list, in order)
- Accepted
- In Transit
- Delivered
- Rejected
- Canceled
```

Explicit settings always win over extracted design tokens. You can also
override colors directly in Monitor Settings: `- primary: #hex`,
`- accent: #hex`, `- sidebar: #hex`, `- canvas: #hex`, or any shade with
`- primary-600: #hex`.

## Adding a customer

1. Drop the customer's design-system markdown into this folder as `<id>.md`.
2. Append the `## Monitor Settings`, `## Order Statuses`, and
   `## Status Pipeline` sections.
3. Put the logo and favicon files in `public/`.
4. Run `npm run dev` — the new company appears in the picker.
