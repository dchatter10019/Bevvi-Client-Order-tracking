# Island Kitchen — Design System
## For use by Claude Code when building custom web experiences

---

## Brand Overview

**Company:** Island Kitchen (IK)  
**URL:** islandkitchen.com  
**Founded:** 2012, Nantucket Island, Massachusetts  
**Owner:** Patrick Ridge (Culinary Institute of America, MBA Babson College)  
**Positioning:** Fresh, healthy, community-first food — served at a casual restaurant, catered for luxury private events and weddings, and delivered to private aircraft.  
**Locations served:** Nantucket MA, Palm Beach FL, Naples FL, Miami FL  
**Audience:** Year-round Nantucket locals and seasonal residents; high-net-worth event hosts; private aviation clients; wellness-minded diners  
**Tone:** Warm, community-oriented, unpretentious. Conveys craft and quality without snobbery. Celebrates connection through food.  
**Tagline / Core idea:** "Fresh. Simple. Good food for all." / "Food brings people together."

**Brand personality in three words:** Grounded. Generous. Sun-drenched.

---

## Visual Identity Read

Island Kitchen's logo is a stylized sun — a radiant, organic mark that sets the entire visual direction. The sun signals:
- Warmth over formality
- Outdoor, coastal living
- Morning energy (breakfast/juice culture)
- Community gathering

This is not a fine-dining black-tie brand. It is premium casual — the same food quality that appears at a Nantucket wedding also appears at a Tuesday breakfast. The design system should feel like a beautiful farmers market on a July morning: abundant, fresh, light-filled, a little sandy.

---

## Color Palette

```
/* Core warm neutrals — the beach and linen base */
--color-sand:         #F5EFE0   /* primary page canvas — warm sand, not white */
--color-sand-dark:    #EDE4CE   /* section dividers, card fills, subtle contrast */
--color-cream:        #FAF7F2   /* nav background, overlays, card interiors */
--color-warm-white:   #FFFDF9   /* pure lightest surface */

/* IK Sun — golden accent, drawn from the logo */
--color-sun:          #E8A020   /* primary accent — the sun yellow-gold */
--color-sun-light:    #FDF3DC   /* sun tint for highlights, badges, callouts */
--color-sun-dark:     #C4841A   /* hover/active states on gold elements */

/* Greens — freshness, produce, health */
--color-herb:         #4A7C59   /* primary green — basil, sage, outdoor */
--color-herb-light:   #EBF4EE   /* green tint backgrounds */
--color-herb-dark:    #375E43   /* hover on green elements, footer accents */

/* Earthy terracotta — warmth, clay pots, grilling */
--color-terracotta:   #C8563A   /* secondary accent for warmth */
--color-terracotta-light: #FAEAE6   /* tint for callout blocks */

/* Text */
--color-text-primary:   #1C1A16   /* rich near-black, warm undertone */
--color-text-secondary: #5C5347   /* body copy — warm brown-gray */
--color-text-muted:     #9C8E7E   /* captions, metadata, timestamps */
--color-text-inverse:   #FFFDF9   /* on dark/herb backgrounds */

/* Borders */
--color-border:         #E2D9C8   /* hairlines, card borders */
--color-border-dark:    #3A3228   /* borders on dark sections */
```

**Color usage rules:**
- Sand (#F5EFE0) is the default page canvas. Never use pure #FFFFFF — it reads clinical.
- Sun gold (#E8A020) is the brand accent. Use for CTAs, the logo sun icon, hover highlights, price callouts. Not a background fill for large blocks.
- Herb green (#4A7C59) signals health, freshness, and nature. Use for secondary CTAs, category labels (juice, salad menus), nature/produce photography overlays.
- Terracotta (#C8563A) is a seasonal warm accent — use sparingly for catering/event sections to evoke warmth and occasion.
- Avoid cool grays, cold blues, or anything that reads clinical or corporate. Every neutral has a warm undertone.

---

## Typography

```
/* Display — sun-drenched editorial warmth */
--font-display: 'Playfair Display', 'Georgia', serif;
/* Weights: 400 (regular), 700 (bold headlines) */
/* Use for: hero headlines, section titles, menu item names, pull quotes */
/* Character: classic, editorial, slightly nostalgic — a worn Nantucket menu board */

/* Body — clean legibility with personality */
--font-body: 'DM Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif;
/* Weights: 400 (body), 500 (labels, nav), 600 (CTAs, emphasized UI) */
/* Use for: body copy, navigation, buttons, form labels, pricing, hours */

/* Accent / handwritten feel — for personality moments only */
--font-accent: 'Satisfy', 'Dancing Script', cursive;
/* Use very sparingly: pull quotes, taglines ("Fresh. Simple. Good food for all."),
   section intros — one or two moments per page, not as a system font */
```

**Type scale:**

```css
--text-xs:   0.75rem;    /* 12px — fine print, metadata */
--text-sm:   0.875rem;   /* 14px — captions, nav secondary */
--text-base: 1rem;       /* 16px — body baseline */
--text-lg:   1.125rem;   /* 18px — lead paragraphs, card summaries */
--text-xl:   1.25rem;    /* 20px — subheadings */
--text-2xl:  1.5rem;     /* 24px — section headings */
--text-3xl:  1.875rem;   /* 30px — major section titles */
--text-4xl:  2.25rem;    /* 36px — page headings */
--text-5xl:  3rem;       /* 48px — hero subheadline */
--text-6xl:  3.75rem;    /* 60px — hero display, desktop */
```

**Typography rules:**
- Playfair Display headlines in ALL CAPS (tracked) for section titles and nav section labels — IK uses this pattern across their site.
- Script accent font (Satisfy) is the "personality moment" — used for the tagline only, not for navigation or UI.
- Body copy: warm, comfortable line-height 1.65. Not tight.
- Letter-spacing for ALL-CAPS headings: `0.12em`. Normal headings: `-0.01em`. Body: `0em`.
- Menu item names: Playfair Display italic 400 — the editorial elegance of a printed menu.

---

## Spacing System

```css
--space-1:   0.25rem;   /* 4px */
--space-2:   0.5rem;    /* 8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
--space-20:  5rem;      /* 80px */
--space-24:  6rem;      /* 96px */

/* Section vertical rhythm */
--section-padding-y: clamp(3.5rem, 7vw, 7rem);
--container-max:     1120px;
--container-padding: clamp(1.25rem, 4vw, 2rem);
```

---

## Layout Grid

```css
/* 12-column, 24px gutters */
--grid-cols:    12;
--grid-gutter:  1.5rem;

/* Common column spans */
.col-full       { grid-column: 1 / -1; }
.col-wide       { grid-column: 2 / -2; }
.col-content    { grid-column: 2 / -2; }      /* main content at most sizes */
.col-narrow     { grid-column: 3 / -3; }      /* text-heavy centered blocks */
.col-left-half  { grid-column: 1 / 7; }
.col-right-half { grid-column: 7 / -1; }
```

**Layout patterns used by IK:**
- **Hero:** Full-width photograph with centered text overlay (light or semi-transparent dark). Sun logo mark displayed prominently.
- **Section quad:** 4 sections with photo + capitalized title stacked, each linking to a main service category (Catering / Restaurant / In-Flight / Ice Cream).
- **Split narrative:** Text left / image right (or reversed), generous padding, serif headline above body copy.
- **Alternating feature:** For catering service types — image one side, copy other, alternates per entry.
- **Hours + contact block:** Centered, minimal. Just the facts.
- **Team grid:** Portrait photographs + name + title + collapsible bio.
- **Footer:** Simple — logo, address, hours, social icons, contact CTA.

---

## Border Radius

```css
--radius-sm:   4px;    /* tags, pills, chips */
--radius-md:   8px;    /* card borders, inputs */
--radius-lg:   16px;   /* feature image containers, photo frames */
--radius-xl:   24px;   /* hero image crops (where used) */
--radius-full: 9999px; /* pill buttons */
```

**Note:** IK's aesthetic is organic and warm — lean toward rounder corners than ACW. Cards at 12-16px. Buttons as pills. Photos can have slight rounding when displayed as cards.

---

## Shadows & Elevation

```css
--shadow-xs:  0 1px 2px rgba(60,40,20,0.06);
--shadow-sm:  0 2px 8px rgba(60,40,20,0.08);
--shadow-md:  0 6px 20px rgba(60,40,20,0.12);
--shadow-lg:  0 16px 48px rgba(60,40,20,0.15);
--shadow-sun: 0 6px 20px rgba(232,160,32,0.28);  /* gold CTA glow */
```

**All shadows use warm brown undertones, never cool black/gray.**

---

## Component Patterns

### Navigation
```
Background: --color-cream (always, even at top — IK does not use transparent nav)
Height: 68px desktop, 56px mobile
Logo: centered sun SVG mark + "Island Kitchen" wordmark — centered or left
Nav links: DM Sans 500, 14px, letter-spacing 0.08em — spaced evenly
CTA buttons: "ORDER ONLINE" / "RESERVATIONS" / "GIFT CARDS" — all caps, 13px,
             --color-sun border style or simple underline links
Mobile: hamburger → slide-in drawer (light background, full-height)
Cart icon: top right with item count
```

### Primary Button (CTA)
```css
background: var(--color-sun);
color: var(--color-text-primary);   /* dark text on gold — high contrast */
font: DM Sans 600 13px uppercase letter-spacing 0.1em;
padding: 14px 28px;
border-radius: var(--radius-full);
box-shadow: var(--shadow-sun);
transition: background 150ms, transform 100ms;

:hover {
  background: var(--color-sun-dark);
  transform: translateY(-1px);
}
```

### Secondary Button (Herb green)
```css
background: var(--color-herb);
color: var(--color-text-inverse);
/* same padding/font/radius as primary */
:hover { background: var(--color-herb-dark); }
```

### Ghost Button
```css
background: transparent;
border: 1.5px solid var(--color-text-primary);
color: var(--color-text-primary);
/* same padding/font/radius */
:hover { background: rgba(0,0,0,0.04); }
```

### Service Category Card (Home page quads)
```
Full-bleed photograph background
Overlay: linear-gradient(to top, rgba(28,26,22,0.65) 40%, transparent)
Title: Playfair Display 700 uppercase 2rem, white, centered bottom
On hover: image subtle scale(1.04), overlay darkens slightly
Entire card is a link
Aspect ratio: 3:4 (portrait) on desktop grid, 16:9 on mobile
```

### Catering Feature Block (alternating split)
```
Image: 50% width, rounded corners (--radius-lg), object-fit cover 4:3
Copy side: H2 Playfair Display, body DM Sans 400 18px, optional CTA link
Gap between: --space-16 desktop, --space-8 mobile
Alternates: image-left/copy-right then image-right/copy-left
```

### Menu Item (restaurant pages)
```
Name: Playfair Display italic 400 19px
Description: DM Sans 400 15px text-secondary
Price: DM Sans 600 16px text-primary
Dietary tags: pill chips, --radius-full, --color-herb-light bg,
              --color-herb text, 11px uppercase DM Sans 600
Divider: 1px --color-border between items
```

### Hours Block
```
Day: DM Sans 500 15px text-secondary (left)
Hours: DM Sans 400 15px text-primary (right)
Layout: two-column definition list, max-width 360px, centered
```

### Team Card
```
Photo: square or portrait crop, --radius-lg
Name: Playfair Display 700 18px
Title: DM Sans 500 13px uppercase letter-spacing 0.1em text-muted
Bio: collapsible accordion, DM Sans 400 15px
```

### Airport / Location List
```
Layout: 2-column grid of airport names + IATA codes
Airport name: DM Sans 500 15px
IATA code: DM Sans 600 13px --color-sun, displayed in parentheses or as a tag
Badge style: --color-sun-light bg, rounded pill, monospaced IATA
```

---

## Motion & Animation

```css
/* Organic easing — slightly softer than mechanical */
--ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-enter:    cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* for hover lifts */

/* Duration scale */
--duration-fast:   120ms;
--duration-base:   220ms;
--duration-slow:   400ms;
--duration-enter:  500ms;
```

**Animation philosophy:** Warm, unhurried. Like pulling a dish from an oven — deliberate, not snappy. No aggressive or quick micro-interactions.

- Scroll-triggered fade-up for sections: `opacity 0→1, translateY 24px→0`, stagger 100ms between siblings.
- Card hovers: subtle `translateY(-3px)` with shadow transition, 220ms ease.
- Service category photo cards: `scale(1.04)` on image within overflow-hidden container.
- No looping animations, no auto-advance carousels without user control.
- Respect `prefers-reduced-motion`.

---

## Iconography

- Style: Slightly rounded, 2px stroke weight, organic line icons. Not perfectly geometric.
- Vibe: Think "hand-sketched menu illustration" energy — imprecise charm, not Lucide precision.
- Size: 24px standard, 20px compact.
- Color: --color-herb for nature/food icons; --color-sun for highlight/action icons; text color for UI icons.
- Source: Lucide Icons (rounded variant) or Phosphor Icons (regular weight) fit best.
- Decorative: Small sun, leaf, or wave motifs can appear as section dividers (SVG, --color-sun or --color-sand-dark). Use at most once per page.

---

## Imagery Guidelines

**Photography style — IK's visual world:**
- Natural light, warm tones. Golden hour quality even indoors.
- Food close-ups: textured, abundant, slightly imperfect (a rustic cheese board, not a laboratory plating).
- Events/catering: candid moments of guests enjoying food — not posed. Real laughter, real tables.
- Outdoor settings: Nantucket harbor, beach light, patio umbrellas, cobblestone — lean into the island setting.
- Team/people: approachable, warm. Not corporate headshots.
- Aircraft/in-flight: clean and elegant but never cold.

**Image treatment:**
- Hero overlays: very subtle — `rgba(28,26,22,0.35)` — let the photo breathe.
- No red or aggressive overlays. Use warm dark or no overlay at all where image is bright enough.
- Aspect ratios: Hero 16:9 or full-viewport-height, cards 3:4 (portrait) or 4:3 (landscape), team portraits 1:1.
- Photo borders: occasionally wrap a card photo in a thin `1px solid --color-border` rule at 8-16px radius.

---

## Content Patterns & Copywriting Voice

**Brand voice:** Warm and personal. Patrick Ridge writes with earnest hospitality — no marketing-speak, no superlatives. Speak as a person, not a brand.

**Headline formula:** Short phrases in title case or all caps. Often pairs of short sentences.
- Good: "Fresh. Simple. Good food for all."
- Good: "Celebrate the IK Way"
- Good: "Exceptional food & drink. World-class service. Flawless execution."
- Avoid: "Discover the Island Kitchen Difference" (generic)
- Avoid: corporate buzzwords like "synergy," "leverage," "solutions"

**"IK" abbreviation:** Used freely — it's a community nickname, not a brand affectation. Use it in UI ("Book Now – Nantucket Catering" but "The IK Way").

**CTA text:** Warm action verbs. "Order Now," "Book Now," "View Menu," "Reserve a Table," "Place an Order," "Get in Touch," "Join Our Team."

**Event/catering copy:** Written from the perspective of the client's experience. "We'll work closely with your other vendors..." "You can focus on the reason you hired us."

**Tagline moments:** Short, rhythmic three-part phrases work well. Use period-separated micro-sentences.

---

## Page Templates

### Home Page Structure
```
1. Nav (logo centered or left, 3 CTA pill links: Order Online / Reservations / Gift Cards)
2. Hero — full-viewport, sun logo + headline, minimal text, ambient mood
3. Service quad — 4 portrait cards: CATERING / RESTAURANT / IN-FLIGHT / ICE CREAM
4. Brand story snippet — 2-column: "Food brings people together." prose + photo
5. Social proof / press logos (if available)
6. Footer — address, hours, social icons, contact link
```

### Catering Page
```
Hero (location name + photo)
→ "Celebrate the IK Way" brand statement block
→ Mobile kitchen feature (off-premise capability)
→ Alternating splits: Weddings / Private Events / Galas & Fundraisers
→ Booking CTA band (warm sand bg, gold button)
→ Contact email + phone
→ LCA badge / accreditation
→ Footer
```

### Restaurant / Menu Page
```
Nav with meal period tabs: Breakfast / Lunch / Dinner
Menu section header (Playfair Display, category name)
→ Item list with name, description, price, dietary tags
→ Hours + location info block
→ Reservation + online order CTAs
→ Footer
```

### In-Flight Page
```
Hero ("Fresh, healthy options for your next private flight.")
→ Airport grid — 2-column list of IATA codes served
→ Brand narrative ("Catering private flights since 2018...")
→ Menu PDF download buttons (Passenger Menu / Crew Menu)
→ Order form or contact info block
→ Footer
```

### About Page
```
Full-width photo (restaurant patio / team candid)
→ Founder story block (editorial, first-person warmth)
→ Team grid (portraits + bios)
→ Community / values statement
→ Join Our Team CTA
→ Footer
```

---

## Bevvi Integration Notes (islandkitchen.getbevvi.com — if applicable)

If building a Bevvi-powered ordering page for Island Kitchen clients:

- Use sand (#F5EFE0) as the cart/product page canvas — match IK's warm aesthetic, not Bevvi default white.
- Primary action color: --color-sun (#E8A020) — gold buttons for "Add to Cart," "Checkout."
- Product cards: rounded corners (--radius-lg), warm border (--color-border).
- Typography: Playfair Display for product name, DM Sans for descriptions and pricing.
- Trust line: IK logo + "Powered by Bevvi" in --color-text-muted, 12px.
- Any Rachel AI widget: --color-herb green as chat bubble accent; --color-sun for send button.

---

## Accessibility Baseline

- Sun gold (#E8A020) on sand (#F5EFE0): contrast ~3.4:1 — use only at 18px+ or 14px bold. For small text use --color-sun-dark (#C4841A) instead.
- Herb green (#4A7C59) on cream (#FAF7F2): ~5.2:1 — passes AA for all sizes.
- Terracotta (#C8563A) on warm-white (#FFFDF9): ~4.8:1 — passes AA body text.
- Focus rings: `outline: 2px solid #E8A020; outline-offset: 3px;`
- All food images: descriptive alt text (ingredients, occasion, location context).
- Navigation: keyboard navigable, ARIA roles on mobile drawer toggle.
- Reduced motion: all scroll-triggered animations in `@media (prefers-reduced-motion: no-preference)`.

---

## Quick Reference Cheat Sheet

| Token | Value | Usage |
|---|---|---|
| Sand canvas | #F5EFE0 | Default page background |
| Sun gold | #E8A020 | Primary CTA, logo accent, highlights |
| Herb green | #4A7C59 | Secondary CTAs, freshness accents |
| Terracotta | #C8563A | Event/warmth accent, sparingly |
| Warm near-black | #1C1A16 | Primary text |
| Display font | Playfair Display 400/700 | Headlines, menu items |
| Body font | DM Sans 400/500/600 | All UI and body copy |
| Accent font | Satisfy (cursive) | Tagline moments only |
| Border radius | 12–16px cards, 9999px buttons | Organic, warm corners |
| Section padding | clamp(3.5rem, 7vw, 7rem) | Section top/bottom rhythm |
| Shadow color base | rgba(60,40,20,x) | Warm undertone on all shadows |
| Headline case | ALL CAPS tracked (nav/section labels) | Playfair Display uppercase |
| CTA text case | ALL CAPS 0.1em tracking | Pill buttons |
| Core tagline | "Fresh. Simple. Good food for all." | Brand identity moment |

---

## Monitor Settings

- id: islandkitchen
- label: Island Kitchen
- tagline: Fresh. Simple. Good food for all.
- logo: /bevvi-logo.png
- favicon: /bevvi-favicon-32.png
- primary: #E8A020
- primary-700: #C4841A
- primary-100: #FDF3DC
- accent: #E8A020
- sidebar: #1C1A16
- canvas: #F5EFE0

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
