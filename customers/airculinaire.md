# Air Culinaire Worldwide — Design System
## For use by Claude Code when building custom web experiences

---

## Brand Overview

**Company:** Air Culinaire Worldwide  
**URL:** airculinaireworldwide.com  
**Positioning:** Premium private aviation inflight catering — chef-crafted, globally networked, white-glove service  
**Audience:** Flight departments, charter operators, private aviation clients, concierge bookers  
**Tone:** Elevated yet approachable. Precise, not pretentious. Expertise worn lightly.  
**Core tension to design for:** The warmth of fine dining meets the precision of aviation logistics.

---

## Color Palette

```
--color-primary:        #E11837   /* ACW signature red — used on CTAs, accents, logo mark */
--color-primary-dark:   #B8102C   /* Hover / pressed state for primary red */
--color-primary-light:  #FDEAED   /* Red tint backgrounds, badges, highlights */

--color-navy:           #0D1C2E   /* Deep navy — hero backgrounds, footers, dark sections */
--color-navy-mid:       #1A2F47   /* Card backgrounds on dark surfaces */

--color-white:          #FFFFFF
--color-off-white:      #F8F6F2   /* Warm page background — evokes linen, not stark white */
--color-surface:        #EFECE6   /* Subtle section dividers, card fills */

--color-text-primary:   #111827   /* Body text, headings on light bg */
--color-text-secondary: #4B5563   /* Supporting copy, captions */
--color-text-muted:     #9CA3AF   /* Labels, metadata, timestamps */
--color-text-inverse:   #FFFFFF   /* Text on dark/navy backgrounds */

--color-border:         #E5E0D8   /* Hairline rules, card borders */
--color-border-dark:    #2A3D54   /* Borders on dark sections */
```

**Color usage rules:**
- Red (#E11837) is the brand's single active accent — reserve for primary CTAs, active states, and signature moments only. Never use as a background fill for large sections.
- Navy (#0D1C2E) anchors the aviation/luxury dimension. Use for hero areas, footer, and dark-mode feature blocks.
- Off-white (#F8F6F2) is the default page canvas — warmer than pure white, suggests fine linen.
- Avoid gradients except as subtle texture on hero dark sections (navy to navy-mid, never rainbow).

---

## Typography

```
/* Display — editorial authority */
--font-display: 'Cormorant Garamond', 'Garamond', Georgia, serif;
/* Weights: 300 (light headlines), 400, 600 (semi-bold subheads) */
/* Use for: hero headlines, section titles, pull quotes */

/* Body — legible precision */
--font-body: 'Inter', 'Helvetica Neue', Arial, sans-serif;
/* Weights: 400 (body), 500 (UI labels, nav), 600 (CTAs, emphasized UI) */
/* Use for: body copy, navigation, buttons, form labels, data */

/* Mono — operational clarity */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
/* Use sparingly: order numbers, tracking IDs, coordinates, portal data */
```

**Type scale:**

```css
--text-xs:   0.75rem;   /* 12px — metadata, captions, fine print */
--text-sm:   0.875rem;  /* 14px — secondary labels, nav sub-items */
--text-base: 1rem;      /* 16px — body copy baseline */
--text-lg:   1.125rem;  /* 18px — lead paragraphs, card summaries */
--text-xl:   1.25rem;   /* 20px — subheadings, card titles */
--text-2xl:  1.5rem;    /* 24px — section headings */
--text-3xl:  1.875rem;  /* 30px — major section titles */
--text-4xl:  2.25rem;   /* 36px — page-level headings */
--text-5xl:  3rem;      /* 48px — hero subheadlines */
--text-6xl:  3.75rem;   /* 60px — hero display (desktop) */
--text-7xl:  4.5rem;    /* 72px — signature hero moments */
```

**Typography rules:**
- Display font (Cormorant Garamond) is used ONLY for editorial headlines — never for buttons, nav, or UI chrome.
- Hero headlines use font-weight: 300 (light) at large sizes for an airy, luxury feel. Don't bold them.
- Letter-spacing: display headlines get `letter-spacing: -0.02em`. Body copy: `0em`. Nav/labels: `0.08em` uppercase.
- Line heights: headlines `1.1`, body `1.6`, compact UI labels `1.3`.

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
--space-32:  8rem;      /* 128px */

/* Section vertical rhythm */
--section-padding-y: clamp(4rem, 8vw, 8rem);
--container-max:     1200px;
--container-padding: clamp(1rem, 4vw, 2rem);
```

---

## Layout Grid

```css
/* 12-column grid, 24px gutters on desktop */
--grid-cols:    12;
--grid-gutter:  1.5rem;

/* Common column spans */
.col-full       { grid-column: 1 / -1; }
.col-wide       { grid-column: 2 / -2; }           /* inset 1 col each side */
.col-content    { grid-column: 3 / -3; }           /* main editorial content */
.col-narrow     { grid-column: 4 / -4; }           /* constrained text blocks */
.col-left-half  { grid-column: 1 / 7; }
.col-right-half { grid-column: 7 / -1; }
.col-left-wide  { grid-column: 1 / 8; }
.col-right-narrow { grid-column: 8 / -1; }
```

**Layout patterns used by ACW:**
- **Hero:** Full-bleed image (dark overlay) + centered or left-aligned headline over navy. CTA below.
- **Stats bar:** 3-column horizontal strip with large number + label in each cell. Dividers between.
- **Feature grid:** 2x4 or 4x2 icon+title+body service cards. Light surface background.
- **Split section:** 50/50 image left + copy right (alternates per service).
- **Mosaic gallery:** Masonry or uniform grid of food photography, no borders.
- **Portal CTA:** Dark navy band with headline + 2 buttons (primary red + ghost).
- **Footer:** Dark navy, 4-column: nav links / locations list / contact / social.

---

## Border Radius

```css
--radius-sm:   4px;    /* tags, badges, small chips */
--radius-md:   8px;    /* cards, input fields */
--radius-lg:   12px;   /* feature cards, image containers */
--radius-xl:   20px;   /* hero image corners (where cropped) */
--radius-full: 9999px; /* pill buttons, avatar */
```

**Note:** ACW leans architectural — use radius conservatively. Cards at 8px, not 16px+. Hero images are full-bleed (0 radius). Luxury brands don't over-round.

---

## Shadows & Elevation

```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
--shadow-md:  0 4px 16px rgba(0,0,0,0.10);
--shadow-lg:  0 12px 40px rgba(0,0,0,0.14);
--shadow-red: 0 8px 24px rgba(225,24,55,0.25);  /* CTA button glow */
```

**Elevation rules:**
- Default page surface: no shadow.
- Hover on interactive cards: elevate to `--shadow-md`.
- Sticky nav on scroll: `--shadow-sm`.
- Primary CTA button: `--shadow-red` on hover only.

---

## Component Patterns

### Navigation
```
Position: sticky top-0
Background: white (on scroll; transparent when at top over hero)
Height: 72px desktop, 60px mobile
Logo: left-aligned SVG
Links: Inter 500, 14px, uppercase, letter-spacing 0.08em, color text-secondary → text-primary on hover
CTA: primary red pill button, right side ("Order Now")
Mobile: hamburger → full-screen overlay nav, navy background
Utility bar above nav: phone + email links (small, red link color), "Order Now" ghost link
```

### Primary Button (CTA)
```css
background: var(--color-primary);
color: white;
font: Inter 600 14px uppercase letter-spacing 0.08em;
padding: 14px 28px;
border-radius: var(--radius-full);
box-shadow: var(--shadow-red);
transition: background 150ms, transform 100ms;

:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}
```

### Ghost Button
```css
background: transparent;
border: 1.5px solid currentColor;
color: inherit; /* works on both dark + light bg */
/* same padding/font as primary */
:hover { background: rgba(255,255,255,0.08); }
```

### Service Card
```
Background: --color-off-white or white
Border: 1px solid --color-border
Border-radius: --radius-md
Padding: 32px
Icon: 40px, red accent
Title: Inter 600 18px
Body: Inter 400 15px text-secondary
Hover: shadow-md + slight translateY(-2px)
```

### Stats Counter
```
Number: Cormorant Garamond 600, 3.5rem, color text-primary (or white on dark)
Label: Inter 400 13px uppercase letter-spacing 0.1em, text-muted
Separator: 1px vertical rule in --color-border
```

### Section Eyebrow
```
Pattern: "/ Topic" or "/ Section Name"
Font: Inter 500 12px uppercase letter-spacing 0.12em
Color: --color-primary (red)
Margin-bottom: 12px before headline
```

### Food Photography Display
```
Grid: 3-4 columns, 8px gap, no border-radius on images
Images: object-fit cover, consistent aspect ratio (4:3 preferred)
On hover: subtle scale(1.02) with overflow hidden on container
```

---

## Motion & Animation

```css
/* Default easing — feels mechanical-precision, not springy */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter:    cubic-bezier(0, 0, 0.2, 1);
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);

/* Duration scale */
--duration-fast:   100ms;
--duration-base:   200ms;
--duration-slow:   350ms;
--duration-enter:  500ms;   /* page/section reveal */
```

**Animation rules:**
- Use scroll-triggered fade-up for section reveals: `opacity 0→1, translateY 20px→0`, staggered by 80ms between siblings.
- Hero: text animates in on load (opacity + slight slide). Image is static or very slow parallax (max 10% travel).
- No looping animations in the main content. No auto-playing video unless muted + user-initiated.
- Respect `prefers-reduced-motion`: wrap all transitions in `@media (prefers-reduced-motion: no-preference)`.

---

## Iconography

- Style: Thin-stroke line icons, 1.5px stroke weight, no fill. Rounded caps.
- Size: 24px standard, 20px compact, 40px feature card icons.
- Color: Inherits text color or uses `--color-primary` for emphasis icons.
- Source: Lucide Icons or Heroicons (outline variant) — both match ACW's precision aesthetic.
- Avoid: Filled/solid icons, emoji, decorative flourishes.

---

## Imagery Guidelines

**Photography style:**
- Food: Close-up, natural light or warm studio. Rich detail, no filters. Show texture and craft.
- People: Candid-professional. Warm tones. Avoid stock-photo poses.
- Aircraft/aviation context: Clean, minimal. Tarmac or interior shots. No clip art.
- Locations/kitchens: Bright, orderly. Conveys precision and food safety.

**Image treatment:**
- Hero overlays: dark gradient from navy (bottom 60%) over photograph. Overlay opacity ~60%.
- Never use red overlays on photos.
- Aspect ratios: Hero 16:9, cards 4:3, portrait callouts 2:3.
- Always include `alt` text describing the content (accessibility + SEO).

---

## Content Patterns & Copywriting Voice

**Headline formula:** Action + benefit, no pun. Short, confident.
- Good: "Elevate your inflight catering experience."
- Good: "Chef-crafted. Globally delivered."
- Avoid: "Taking your taste to new heights!" (aviation cliche)

**Body copy:** Professional but warm. Third-person brand, second-person customer ("you"). Specifics over generalities ("1,200+ airports" not "worldwide coverage").

**Eyebrow labels:** "/" prefix convention (e.g., "/ Technology Meets Catering", "/ Explore"). Keep to 2-4 words.

**Numbers:** Always formatted with "+" (1,200+, 2,000,000+, 26). Display them large — they are proof points.

**CTA text:** Active verbs. "Order Now", "Learn More", "View Our Services", "Login Now". Never "Click Here" or "Submit".

---

## Page Templates

### Home Page Structure
```
1. Utility bar (phone / email / Order Now)
2. Sticky nav
3. Hero — full-bleed, dark, headline + subline + CTA
4. Stats strip — 3 key metrics
5. Services grid — 8 service cards, 4 col desktop / 2 col tablet / 1 col mobile
6. Portal feature — split layout, navy bg, portal screenshot + bullet list
7. Food gallery — masonry or uniform grid, no text overlay
8. Footer — dark navy, 4 col
```

### Services Page
```
Hero (constrained, navy, eyebrow + H1 + lead)
→ Alternating split sections per service (image/copy swap each)
→ Network CTA band (dark)
→ Footer
```

### Location Page
```
Hero with location name + airport code
→ Contact/order info block
→ Menu highlights
→ Map embed
→ Nearby locations
→ Footer
```

---

## Bevvi Integration Notes (airculinaire.getbevvi.com)

When building Bevvi-powered pages for Air Culinaire clients:

- Match ACW brand tokens above exactly — this is a white-label surface, not a Bevvi-branded one.
- Use ACW red (#E11837) as the primary action color in the Bevvi cart/order UI.
- "Add to Cart" and order flow buttons follow ACW's pill button style, not Bevvi's default.
- Rachel AI widget (if embedded): Use ACW navy as chat bubble background; ACW red for send button.
- Product cards: ACW typography. Bevvi product images centered, no background color.
- Trust signals on checkout: ACW logo + "Powered by Bevvi" in muted text (Inter 400 12px #9CA3AF).

---

## Accessibility Baseline

- Minimum contrast: 4.5:1 for body text, 3:1 for large text (WCAG AA).
- Red on white (#E11837 on #FFFFFF) ratio: ~4.6:1. Use only at 18px+ or bold 14px+.
- Red on navy (#E11837 on #0D1C2E) — do not use; insufficient contrast.
- All interactive elements: visible focus ring (`outline: 2px solid #E11837, outline-offset: 3px`).
- Images: descriptive alt text required.
- Navigation: keyboard navigable, ARIA roles on mobile menu toggle.
- Reduced motion: all transitions wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## Quick Reference Cheat Sheet

| Token | Value | Usage |
|---|---|---|
| Primary red | #E11837 | CTAs, accents, eyebrows |
| Navy | #0D1C2E | Hero, footer, dark sections |
| Off-white | #F8F6F2 | Page canvas |
| Display font | Cormorant Garamond 300-600 | Headlines only |
| Body font | Inter 400-600 | Everything else |
| Border radius | 8px | Cards and inputs |
| Section padding | clamp(4rem, 8vw, 8rem) | Top/bottom of each section |
| CTA shape | pill (9999px) | All buttons |
| Eyebrow prefix | "/ Label" | Section category labels |
| Stat style | Large serif number + small sans label | Proof points |

---

## Monitor Settings

- id: airculinaire
- tagline: Chef-crafted. Globally delivered.
- logo: /bevvi-logo.png
- favicon: /bevvi-favicon-32.png

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
