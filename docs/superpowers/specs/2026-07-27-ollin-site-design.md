# Ollin — Freelance Digital Marketing Site: Design Spec

**Date:** 2026-07-27
**Author:** Axel Tonatiuh Barretto Rodriguez (design collaboration with Claude)
**Status:** Approved, pending implementation plan

## Purpose

A personal freelance website for Axel's digital marketing services side-hustle (separate from his other project, Centrip). Axel is a UNH Digital Marketing & Entrepreneurial Studies grad, currently a BDR at SC Digital (a marketing agency), where he calls clients, diagnoses pain points across their web/social/digital marketing, and scopes contracts/campaigns with CSMs. This site is the sales asset he'll send/reference when pitching businesses directly.

Services offered:
1. Website optimization / creation
2. SEO + AEO/GEO (answer-engine / generative-engine optimization for AI search)
3. Google Ads management

Plan: launch the site first, then later add illustrative example-results content for credibility before starting outreach/cold-calling.

## Brand

- **Name:** Ollin — Nahuatl for "movement." Chosen deliberately to reflect Axel's Nahuatl/Aztec heritage (his middle name, Tonatiuh, is the Aztec sun deity), not as wordplay.
- **Aesthetic direction: "Sunstone Relief."** Reached through iterative visual comparison (multiple rounds, several rejected directions: a too-subtle/generic "Solar Motion" pass, a literal glyph icon, a decorative crack/vein line element, turquoise and jade accent colors, two other red shades). Final direction: a carved-stone surface with a single disciplined accent color, no added iconography.

## Tech Stack & Architecture

- **Vanilla HTML, CSS, and JavaScript.** No framework, no build step, no npm dependency.
- 4 static pages: `index.html` (Home), `services.html`, `about.html`, `contact.html`.
- Shared nav/footer markup is **duplicated per page** rather than templated — at 4 pages, a build step or runtime JS include adds more complexity than it saves. (`fetch()`-based includes were considered and rejected: they break when the site is opened directly from disk instead of through a server.)
- One shared `styles.css` defining the visual system as CSS custom properties.
- One `main.js` for the page-load reveal animation and the mobile nav toggle.
- Rationale for skipping Tailwind: the aesthetics guidance's actual ask ("use CSS variables for consistency") is satisfied by hand-written custom properties. Tailwind's CDN build is explicitly not meant for production use by Tailwind's own docs, and a full Tailwind build pipeline adds tooling this project doesn't need.

## Visual System

**Palette (CSS custom properties):**
| Token | Value | Use |
|---|---|---|
| `--color-stone` | `#3a2418` | Page/section background |
| `--color-ink` | `#1c1108` | Carve-shadow, dark text where needed |
| `--color-gold` | `#e8c98a` | Headlines, eyebrow labels |
| `--color-oxblood` | `#5c1a15` | Single accent — buttons, links, focus states |
| `--color-cream` | `#f2e4c8` | Text on oxblood buttons |

**Typography:**
- **Rozha One** — display headlines. Carved-inscription character.
- **Space Mono** — eyebrow labels, buttons, small UI/microcopy.
- **Lora** — body copy (service descriptions, bio paragraphs, form labels). Neither display font is meant for extended reading, so body text gets a dedicated, readable serif.

**Texture & carve effect** (applied to hero and major section backgrounds):
- Chisel cross-hatch: `repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)`
- Vignette: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.25) 0%, transparent 60%)`
- Carved headline text: `text-shadow: 1px 1px 0 var(--color-ink), -1px -1px 0 rgba(255,255,255,0.15)`

**Iconography/decoration:** No fixed rule against icons or graphic elements — a literal glyph mark and a decorative crack-line motif were tried and specifically rejected during design review as not adding anything, not because iconography is categorically off-limits. Future additions (icons, imagery) should be judged on whether they improve the specific page, not avoided by default.

**Motion:** One orchestrated staggered reveal on page load — eyebrow label, then headline, then CTA fade/rise in sequence via CSS `animation-delay`. Subtle hover state color-shifts on buttons/links. CSS-only, no animation library needed. Not a hard "no bounce ever" rule — easing/timing should just look intentional rather than scattered, consistent with the aesthetics-prompt guidance about one well-orchestrated moment beating many small ones.

## Page Structure

Building on the approved plain-structure wireframes in `wireframes/` (home.html, services.html, about.html, contact.html).

### Home (`index.html`)
1. Hero — eyebrow label, carved headline, subhead, primary CTA
2. Trust strip — UNH + SC Digital credibility line
3. Services overview — 3 cards (one per service), linking to Services page
4. Illustrative results section — sample "what this could look like" results, **clearly labeled in small print as illustrative examples** (not real client claims). Built as one self-contained `<section>` so it can be deleted cleanly later if Axel wants the thinner homepage or has real results to swap in instead.
5. Final CTA
6. Footer

### Services (`services.html`)
1. Intro framing the three services
2. Three detailed service blocks (Website Optimization/Creation, SEO+AEO/GEO, Google Ads), each with what's included, who it's for, and a CTA
3. 3-step "how it works" block (audit → plan → execute/report)
4. Final CTA
5. Footer

### About (`about.html`)
1. Photo + intro
2. Background: UNH degree, SC Digital role, relevant credentials
3. Philosophy / why-work-with-me
4. Final CTA
5. Footer

### Contact (`contact.html`)
1. Intro (what happens after reaching out)
2. **Contact form** — name/email/business/message, submits to Formspree (free tier, no backend code required)
3. **Calendly inline embed widget** — Axel wants both a form and a booking option, since he plans to take calls/meetings directly
4. Reassurance line (e.g. expected response time)
5. Footer

## External Integrations (require Axel's own accounts — cannot be created on his behalf)

- **Formspree**: needs a Formspree account + form endpoint ID for the contact form to actually deliver submissions.
- **Calendly** (or equivalent): needs Axel's scheduling link/username for the embed widget.

Both integration points should be built with a clearly marked placeholder (e.g. `FORM_ENDPOINT_HERE`, `CALENDLY_URL_HERE`) until Axel supplies the real values.

## SEO & Meta (dogfooding requirement)

Since the site is selling SEO services, it needs to demonstrate SEO competence itself:
- Unique `<title>` and meta description per page
- Open Graph tags (title, description, image placeholder)
- Semantic landmarks (`<nav>`, `<main>`, `<footer>`), single `<h1>` per page
- `sitemap.xml` and `robots.txt`
- Descriptive `alt` text on all images
- Favicon

## Responsive & Accessibility

- Mobile-first layout; single-column stacking below ~640px
- Keyboard-navigable nav with visible focus states
- Color contrast between gold/oxblood text and the stone background should be verified against WCAG AA during implementation and adjusted if it fails

## Error Handling

- Contact form: HTML5 required-field validation client-side; Formspree handles server-side delivery and its own failure states
- Calendly embed: if the script fails to load, fall back to a plain text link to the Calendly URL

## Out of Scope (this spec)

- Real case-study content (illustrative placeholders only for now)
- Blog or additional pages
- Hosting/domain setup — undecided, doesn't block the build; site is plain static files deployable to any static host (GitHub Pages, Hostinger, Vercel, etc.) later
- Analytics integration (not requested)

## Testing Plan

- Manual pass through all 4 pages at mobile/tablet/desktop widths
- Verify all internal nav links resolve
- Verify contact form submits successfully once a real Formspree endpoint is in place
- Verify Calendly widget loads and its fallback link works
- Run through the built site in a browser before calling the work complete
