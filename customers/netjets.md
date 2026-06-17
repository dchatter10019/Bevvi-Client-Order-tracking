# NetJets Order Tracker — Design System

> Design reference for building the Bevvi × NetJets catering order tracker.  
> Derived from NetJets brand identity at netjets.com/en-us.

---

## Brand Overview

NetJets is the world's leading fractional private jet company. Their visual identity communicates **precision, exclusivity, and quiet confidence** — not flashy luxury, but the kind of understated authority that doesn't need to prove itself. The design language is architectural, unhurried, and immaculate.

The order tracker should feel like it belongs inside the NetJets owner portal — white-glove digital service, not a shipping tracker.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--nj-midnight` | `#0A0A0A` | Primary background, headers |
| `--nj-charcoal` | `#1C1C1E` | Card backgrounds, nav |
| `--nj-slate` | `#3A3A3C` | Borders, dividers |
| `--nj-silver` | `#8E8E93` | Secondary text, labels |
| `--nj-white` | `#F5F5F0` | Primary text on dark |
| `--nj-cream` | `#FAF9F6` | Light-mode page background |
| `--nj-gold` | `#B8972A` | Accent — CTAs, active states, progress |
| `--nj-gold-light` | `#D4AF4A` | Hover states, highlight |
| `--nj-status-confirmed` | `#2E7D52` | Confirmed / delivered |
| `--nj-status-pending` | `#B8972A` | Pending / in prep |
| `--nj-status-alert` | `#C0392B` | Issue / attention required |

**Color philosophy:** Dark-mode first. The tracker lives inside an authenticated portal context — dark backgrounds command attention and evoke the interior of a private aircraft. Gold is used *sparingly* — one accent per viewport.

---

## Typography

### Typeface Roles

| Role | Family | Weight | Notes |
|---|---|---|---|
| **Display** | `Playfair Display` | 400–700 | Order IDs, flight numbers, hero labels |
| **Body** | `Inter` | 300–500 | All UI text, status messages |
| **Data / Mono** | `JetBrains Mono` | 400 | Times, tail numbers, order codes |

### Type Scale

```
--type-xs:    11px / 1.4  — Eyebrows, timestamps, fine print
--type-sm:    13px / 1.5  — Labels, table cells
--type-base:  15px / 1.6  — Body paragraphs, descriptions
--type-md:    18px / 1.4  — Section headings
--type-lg:    24px / 1.2  — Page section titles
--type-xl:    32px / 1.1  — Order ID display, hero
--type-2xl:   48px / 1.0  — Confirmation splash
```

**Type treatment rule:** All headings in `Playfair Display` use `letter-spacing: 0.03em`. All data (times, quantities, order IDs) render in `JetBrains Mono` — this signals precision and differentiates content types at a glance.

---

## Layout

### Grid

- **Desktop:** 12-column grid, 24px gutters, max-width `1280px`, centered
- **Tablet:** 8-column, 20px gutters
- **Mobile:** Single column, 16px horizontal padding

### Spacing Scale

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-7:  48px
--space-8:  64px
--space-9:  96px
```

### Border Radius

```
--radius-sm:  2px   — Tags, badges
--radius-md:  6px   — Cards, inputs
--radius-lg: 12px   — Modal overlays
--radius-full: 100px — Pills, status chips
```

---

## Component Specs

### Order Header

```
┌─────────────────────────────────────────────────────────┐
│  NETJETS × BEVVI                              [NJ Logo]  │
│  ─────────────────────────────────────────────────────  │
│  Order #NJ-2024-08471          Tail: N550QS              │
│  Created Jun 17, 2026 · 09:14 ET                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Departure   │  │   Arrival    │  │  Flight No.  │  │
│  │  TEB         │  │   LAX        │  │  NJ 1107     │  │
│  │  Jun 18      │  │   Jun 18     │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

- Background: `--nj-charcoal`
- Order # in `Playfair Display`, `--type-xl`, `--nj-white`
- Airport codes: `JetBrains Mono`, `--type-lg`, `--nj-gold`
- Secondary text: `Inter 300`, `--nj-silver`
- Thin hairline separator: `1px solid --nj-slate`

---

### Status Timeline

```
  ●─────────────●─────────────●─────────────○
  │             │             │             │
Order         Confirmed    In Prep       Delivered
Received      Jun 17       Jun 17        Jun 18
09:14 ET      09:31 ET     14:00 ET      Est. 07:30
```

- Active node: `16px` filled circle, `--nj-gold`
- Complete node: `16px` filled circle, `--nj-status-confirmed`
- Pending node: `16px` outline circle, `--nj-slate`
- Connector line: `2px`, gradient from completed color to pending `--nj-slate`
- Labels: `Inter 300`, `--type-xs`, `--nj-silver`
- Active label: `Inter 500`, `--nj-white`

---

### Order Items Table

```
┌───────────────────────────────────────────────────────┐
│  CATERING ORDER                             6 items   │
│  ─────────────────────────────────────────────────── │
│  Item                        Qty    Price    Status   │
│  ─────────────────────────────────────────────────── │
│  Whispering Angel Rosé        2     $64.00   ● Ready  │
│  Don Julio 1942               1    $189.00   ● Ready  │
│  Perrier-Jouët Belle Epoque   2    $310.00   ⏳ Prep   │
│  San Pellegrino (6pk)         2     $18.00   ● Ready  │
│  ─────────────────────────────────────────────────── │
│  Subtotal                          $581.00            │
│  Delivery                           $25.00            │
│  Total                             $606.00   ────── ● │
└───────────────────────────────────────────────────────┘
```

- Table header: `Inter 500`, `--type-xs`, `--nj-silver`, uppercase, `letter-spacing: 0.08em`
- Item rows: `Inter 300`, `--type-sm`, `--nj-white`
- Price column: `JetBrains Mono`, `--type-sm`
- Status chip: pill shape, `--radius-full`, 6px vertical padding
  - Ready: `background: rgba(46,125,82,0.15)`, text `--nj-status-confirmed`
  - Prep: `background: rgba(184,151,42,0.15)`, text `--nj-gold`
- Total row: `Inter 600`, `--nj-white`, separated by thin rule

---

### Status Chips

```css
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 100px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.status-confirmed {
  background: rgba(46, 125, 82, 0.15);
  color: #2E7D52;
  border: 1px solid rgba(46, 125, 82, 0.3);
}

.status-pending {
  background: rgba(184, 151, 42, 0.15);
  color: #B8972A;
  border: 1px solid rgba(184, 151, 42, 0.3);
}

.status-alert {
  background: rgba(192, 57, 43, 0.12);
  color: #C0392B;
  border: 1px solid rgba(192, 57, 43, 0.25);
}
```

---

### Notification / Alert Banner

```
┌─────────────────────────────────────────────────────────┐
│  ◆  Your order includes items requiring 48-hr advance   │
│     notice. Delivery window confirmed for Jun 18,        │
│     07:00–07:30 ET at TEB FBO.                          │
└─────────────────────────────────────────────────────────┘
```

- Left border: `3px solid --nj-gold`
- Background: `rgba(184, 151, 42, 0.06)`
- Diamond icon (`◆`) in `--nj-gold`
- Text: `Inter 300`, `--type-sm`, `--nj-white`

---

### CTA Button

```css
/* Primary — used for "Confirm Order", "Contact Concierge" */
.btn-primary {
  background: transparent;
  border: 1px solid var(--nj-gold);
  color: var(--nj-gold);
  padding: 12px 28px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px; /* near-sharp — architectural */
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--nj-gold);
  color: var(--nj-midnight);
}

/* Secondary — used for "View All Orders", "Download PDF" */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--nj-slate);
  color: var(--nj-silver);
  /* same sizing as primary */
}

.btn-secondary:hover {
  border-color: var(--nj-silver);
  color: var(--nj-white);
}
```

---

## Page Layout — Order Tracker

```
┌──────────────────────────────────────────────────────────────┐
│  NAV BAR                                          [NJ Logo]  │
│  NetJets Catering Portal          [Owner Name]  [Logout]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Back to Orders                                            │
│                                                              │
│  ORDER #NJ-2024-08471                            [STATUS]    │
│  Teterboro → Los Angeles · Jun 18, 2026                      │
│                                                              │
│  ┌──────── STATUS TIMELINE ─────────────────────────────┐   │
│  │  ●─────────●──────────●──────────○                   │   │
│  │  Received  Confirmed  In Prep   Delivery              │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─── ORDER ITEMS (col 8) ────┐  ┌── DELIVERY INFO ──────┐  │
│  │  Item table with qty,      │  │  FBO: Jet Aviation TEB │  │
│  │  price, status per item    │  │  Window: 07:00–07:30   │  │
│  │                            │  │  Contact: Sarah M.     │  │
│  │  ─────────────────────     │  │  +1 201 555 0148       │  │
│  │  Total: $606.00            │  │                        │  │
│  └────────────────────────────┘  │  [Contact Concierge]   │  │
│                                  └────────────────────────┘  │
│                                                              │
│  [Download PDF]                          [Modify Order →]   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Column split: **8/4** (items left, delivery right) on desktop. Stack vertically on mobile.

---

## Motion & Interaction

- **Page load:** Items fade in with a `16px` upward translate over `400ms`, staggered `60ms` per row. Keep it subtle — no bouncing.
- **Timeline:** Progress line animates left-to-right on mount over `600ms`, `ease-out`.
- **Status chip hover:** Slight `border-color` brightening, `150ms` transition. No scale transforms — too playful for this context.
- **Button hover:** Fill transition only (see button CSS above), `200ms`.
- **Respect `prefers-reduced-motion`:** All transitions collapse to instant when set.

---

## Voice & Copy Guidelines

| Context | Tone | Example |
|---|---|---|
| Order confirmed | Assured, present tense | "Your order is confirmed." |
| In preparation | Informational, specific | "Catering is being prepared for Jun 18 delivery." |
| Issue / alert | Direct, actionable | "One item requires substitution. Your concierge will call within 15 minutes." |
| Empty state | Inviting, not apologetic | "No active orders. Ready to arrange catering for your next flight?" |
| Error | Calm, specific | "We couldn't load your order. Try refreshing, or call +1 877 356 5823." |

- **Never** use: "Oops", "Uh oh", "Hang tight", "No worries"
- **Always** use: Active voice, specific times, named contacts where possible
- Quantities and prices: always `JetBrains Mono` in UI, never written out
- Airline/FBO names: full formal name on first reference, abbreviation after

---

## Assets & Logo Usage

- NetJets wordmark: SVG, white version on dark backgrounds
- Minimum clear space: equal to the height of the "N" in the wordmark on all sides
- Never recolor, rotate, or apply drop shadows to the wordmark
- Bevvi co-branding: `NETJETS × BEVVI` in `Inter 300`, uppercase, `--nj-silver`, `--type-xs`, `letter-spacing: 0.12em` — positioned top-left as portal attribution, never competing with the NetJets mark

---

## Accessibility

- Minimum contrast: `4.5:1` for all body text (WCAG AA)
- `--nj-gold` on `--nj-midnight` achieves `6.2:1` — passes AA Large
- All status chips include a non-color signal (icon or text label)
- Focus rings: `2px solid --nj-gold-light`, `2px offset`, on all interactive elements
- All timeline nodes include `aria-label` with full status and timestamp
- Modals trap focus; return focus to trigger on close

---

## Signature Element

**The tailored receipt aesthetic.** Every order detail is rendered as if it were printed on heavy cream stock by a private concierge — monospaced prices, precise timestamps to the minute, FBO contact names rather than generic "your provider." The tracker doesn't feel like an e-commerce order page. It feels like a personalized briefing document.

---

## Monitor Settings

- id: netjets
- label: NetJets
- hostname: netjets-ordertracker.getbevvi.com
- tagline: White-glove catering for private aviation.
- logo: /bevvi-logo.png
- favicon: /bevvi-favicon-32.png
- primary: #B8972A
- primary-700: #8A7222
- primary-100: #F5F0E0
- accent: #B8972A
- sidebar: #0A0A0A
- canvas: #FAF9F6
- font-body: Inter
- font-display: Playfair Display

## Order Statuses

- 0: Pending
- 1: Accepted
- 2: Delivered
- 3: In Transit
- 4: Canceled
- 5: Rejected
- 6: In Transit

## Status Pipeline

- Pending
- Accepted
- In Transit
- Delivered
- Rejected
- Canceled
