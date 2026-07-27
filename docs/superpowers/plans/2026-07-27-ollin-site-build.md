# Ollin Site Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 4-page Ollin freelance marketing site (Home, Services, About, Contact) as vanilla static HTML/CSS/JS, styled to the approved "Sunstone Relief" visual system, with a working Formspree contact form and Calendly booking embed.

**Architecture:** Four independent static HTML pages sharing one `styles.css` (design tokens + components) and one `main.js` (nav toggle + Calendly fallback). Nav/footer markup is duplicated per page by design (see spec — 4 pages doesn't justify templating). No build step, no framework, no test runner — verification is done by grepping generated files for exact expected content and by driving the pages in a real browser (Claude's Browser tool: `navigate`, `get_page_text`, `read_page`), since there is no application logic that benefits from a unit-test framework.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS. Google Fonts (Rozha One, Space Mono, Lora) via `<link>`. Formspree (contact form backend). Calendly (inline embed widget).

## Global Constraints

- No framework, no build step, no npm dependency (spec: Tech Stack & Architecture).
- Nav/footer are duplicated per page, not templated (spec: Architecture).
- Palette tokens: `--color-stone: #3a2418`, `--color-ink: #1c1108`, `--color-gold: #e8c98a`, `--color-oxblood: #5c1a15`, `--color-cream: #f2e4c8` (spec: Visual System).
- Fonts: Rozha One (display headlines only), Space Mono (labels/buttons/UI), Lora (body copy) (spec: Visual System).
- Carved headline shadow: `text-shadow: 1px 1px 0 var(--color-ink), -1px -1px 0 rgba(255,255,255,0.15)` (spec: Visual System).
- Chisel texture: `repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)`; vignette: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.25) 0%, transparent 60%)` (spec: Visual System).
- One orchestrated staggered page-load reveal via CSS `animation-delay`; must respect `prefers-reduced-motion` (spec: Motion).
- Illustrative results section on Home must be a single self-contained `<section>`, clearly labeled illustrative in small print, easy to delete later (spec: Page Structure — Home).
- Formspree and Calendly need Axel's real account values; use clearly marked placeholders (`FORM_ENDPOINT_HERE`, `CALENDLY_URL_HERE`) until supplied (spec: External Integrations).
- SEO: unique title + meta description per page, OG tags, semantic landmarks, single `<h1>` per page, `sitemap.xml`, `robots.txt`, favicon, real `alt` text (spec: SEO & Meta).
- Mobile-first, keyboard-navigable nav with visible focus states, WCAG AA contrast (spec: Responsive & Accessibility).
- Hosting/domain is undecided and out of scope — sitemap/robots use a placeholder domain to fill in later (spec: Out of Scope).
- **Security note (SRI):** Google Fonts `<link>` tags and Calendly's `widget.js` are deliberately loaded *without* Subresource Integrity. Both are live, vendor-served resources whose content is expected to change (Google Fonts CSS varies per user-agent; Calendly's script is updated on their end without a published pinned hash) — an SRI hash fixed today would go stale and silently break font loading or the booking widget the next time either vendor updates. This was a considered decision, not an oversight; it should be revisited only if either vendor starts publishing versioned, SRI-stable URLs.

---

## File Structure

- Create: `styles.css` — design tokens, reset, typography, shared components (nav, footer, buttons, cards, form, hero, texture utilities, animation keyframes, responsive breakpoints)
- Create: `main.js` — mobile nav toggle, Calendly load-failure fallback
- Create: `index.html` — Home
- Create: `services.html` — Services
- Create: `about.html` — About
- Create: `contact.html` — Contact
- Create: `sitemap.xml`
- Create: `robots.txt`
- Create: `favicon.svg`

All files live at the project root: `C:\Users\axelb\Documents\freelance-site\`.

---

### Task 1: Design tokens & shared stylesheet

**Files:**
- Create: `styles.css`

**Interfaces:**
- Produces: CSS custom properties (`--color-stone`, `--color-ink`, `--color-gold`, `--color-oxblood`, `--color-cream`, `--font-display`, `--font-label`, `--font-body`, `--space-1`..`--space-5`, `--max-width`) and component classes (`.container`, `.eyebrow`, `.btn`, `nav.site-nav` + `.nav-toggle` + `#navLinks`, `footer.site-footer`, `section.hero`, `.reveal`/`.reveal-1`/`.reveal-2`/`.reveal-3`, `.card-grid`/`.card`, `.illustrative-disclaimer`, `form.contact-form`) that every later HTML task relies on by exact name.

- [ ] **Step 1: Write `styles.css`**

```css
:root {
  --color-stone: #3a2418;
  --color-ink: #1c1108;
  --color-gold: #e8c98a;
  --color-oxblood: #5c1a15;
  --color-cream: #f2e4c8;

  --font-display: 'Rozha One', serif;
  --font-label: 'Space Mono', monospace;
  --font-body: 'Lora', serif;

  --texture-chisel: repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px);
  --texture-vignette: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.25) 0%, transparent 60%);
  --shadow-carve: 1px 1px 0 var(--color-ink), -1px -1px 0 rgba(255,255,255,0.15);

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 40px;
  --space-5: 64px;
  --max-width: 1080px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  background-color: var(--color-stone);
  background-image: var(--texture-vignette), var(--texture-chisel);
  color: var(--color-cream);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
}

h1, h2, h3 {
  font-family: var(--font-display);
  color: var(--color-gold);
  text-shadow: var(--shadow-carve);
  text-wrap: balance;
  margin: 0 0 var(--space-2) 0;
}
h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); line-height: 1.05; }
h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); }
h3 { font-size: 1.2rem; }

p { max-width: 65ch; }

.eyebrow {
  display: inline-block;
  font-family: var(--font-label);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
}

a { color: var(--color-gold); }
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

.btn {
  display: inline-block;
  font-family: var(--font-label);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  background-color: var(--color-oxblood);
  color: var(--color-cream);
  padding: 14px 26px;
  border-radius: 2px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn:hover { background-color: #732019; transform: translateY(-1px); }

.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--space-3); }

nav.site-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid rgba(232,201,138,0.15);
}
nav.site-nav .brand {
  font-family: var(--font-display);
  color: var(--color-gold);
  text-decoration: none;
  font-size: 1.3rem;
}
nav.site-nav ul {
  list-style: none;
  display: flex;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
}
nav.site-nav a {
  font-family: var(--font-label);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-cream);
}
nav.site-nav a[aria-current="page"] { color: var(--color-gold); }
nav.site-nav .nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-gold);
  font-family: var(--font-label);
  font-size: 0.85rem;
  cursor: pointer;
}

footer.site-footer {
  border-top: 1px solid rgba(232,201,138,0.15);
  padding: var(--space-3);
  margin-top: var(--space-5);
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: rgba(242,228,200,0.7);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
}
footer.site-footer a { color: rgba(242,228,200,0.7); }

section.hero { padding: var(--space-5) var(--space-3); }
section.section { padding: var(--space-4) var(--space-3); }

.reveal { opacity: 0; animation: reveal-up 0.5s ease-out forwards; }
.reveal-1 { animation-delay: 0.05s; }
.reveal-2 { animation-delay: 0.2s; }
.reveal-3 { animation-delay: 0.35s; }
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; }
}

.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
.card {
  border: 1px solid rgba(232,201,138,0.2);
  padding: var(--space-3);
}
.card p { font-size: 0.95rem; color: rgba(242,228,200,0.85); }

.illustrative-disclaimer {
  font-family: var(--font-label);
  font-size: 0.7rem;
  color: rgba(242,228,200,0.55);
  margin-top: var(--space-1);
}

form.contact-form { display: flex; flex-direction: column; gap: var(--space-2); max-width: 480px; }
form.contact-form label {
  font-family: var(--font-label);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gold);
}
form.contact-form input, form.contact-form textarea {
  font-family: var(--font-body);
  font-size: 1rem;
  background-color: rgba(0,0,0,0.2);
  border: 1px solid rgba(232,201,138,0.3);
  color: var(--color-cream);
  padding: 10px 12px;
  border-radius: 2px;
}
form.contact-form textarea { min-height: 120px; resize: vertical; }

.calendly-fallback { font-family: var(--font-label); font-size: 0.85rem; }

@media (max-width: 768px) {
  .card-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  nav.site-nav ul {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--color-stone);
    padding: var(--space-2) var(--space-3);
    gap: var(--space-2);
    display: none;
    z-index: 10;
  }
  nav.site-nav ul.open { display: flex; }
  nav.site-nav .nav-toggle { display: block; }
}
```

- [ ] **Step 2: Verify token values are present**

Run (Grep tool, pattern `--color-oxblood: #5c1a15`, path `styles.css`): expect 1 match.
Run (Grep tool, pattern `--color-gold: #e8c98a`, path `styles.css`): expect 1 match.
Run (Grep tool, pattern `prefers-reduced-motion`, path `styles.css`): expect 1 match.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Add design tokens and shared stylesheet (Sunstone Relief)"
```

---

### Task 2: Shared interactivity script

**Files:**
- Create: `main.js`

**Interfaces:**
- Consumes: DOM elements with `id="navToggle"`, `id="navLinks"`, `id="calendlyWidget"`, `id="calendlyFallback"` — every page task below must use these exact ids where the corresponding feature appears.
- Produces: nothing consumed by CSS; this is the last piece of shared infrastructure before page tasks begin.

- [ ] **Step 1: Write `main.js`**

```js
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const calendlyWidget = document.getElementById('calendlyWidget');
  const calendlyFallback = document.getElementById('calendlyFallback');
  if (calendlyWidget && calendlyFallback) {
    window.setTimeout(() => {
      if (calendlyWidget.children.length === 0) {
        calendlyFallback.hidden = false;
      }
    }, 4000);
  }
});
```

- [ ] **Step 2: Verify the file defines both behaviors**

Run (Grep tool, pattern `navToggle`, path `main.js`): expect matches.
Run (Grep tool, pattern `calendlyFallback`, path `main.js`): expect matches.

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "Add shared nav toggle and Calendly fallback script"
```

---

### Task 3: Home page

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `styles.css` classes from Task 1, `main.js` ids from Task 2.
- Produces: the canonical nav/footer HTML block that Tasks 4–6 copy verbatim (only the `aria-current="page"` link changes per page).

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ollin — Digital Marketing That Finds the Crack</title>
<meta name="description" content="Website optimization, SEO/AEO/GEO, and Google Ads for businesses that know something's off but not what. Diagnosed and fixed by Axel Barretto.">
<meta property="og:title" content="Ollin — Digital Marketing">
<meta property="og:description" content="Website optimization, SEO/AEO/GEO, and Google Ads — diagnosed and fixed.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand">Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html" aria-current="page">Home</a></li>
    <li><a href="services.html">Services</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">Ollin — Movement, Named</p>
    <h1 class="reveal reveal-2">Find the crack.<br>Fill it with something that holds.</h1>
    <p class="reveal reveal-2">Digital marketing for businesses that know something's off but not what. Website, SEO, and Google Ads — diagnosed and fixed by someone who does this daily.</p>
    <p class="reveal reveal-3">
      <a class="btn" href="contact.html">Get the audit →</a>
      &nbsp;&nbsp;
      <a href="services.html">See services</a>
    </p>
  </section>

  <section class="section container">
    <p>UNH Digital Marketing &amp; Entrepreneurial Studies grad · currently at SC Digital, diagnosing marketing problems for a living.</p>
  </section>

  <section class="section container">
    <h2>Where the leaks usually are</h2>
    <div class="card-grid">
      <div class="card">
        <h3>Website Optimization / Creation</h3>
        <p>Fix what's broken, build what's missing.</p>
        <p><a href="services.html">Learn more →</a></p>
      </div>
      <div class="card">
        <h3>SEO + AEO/GEO</h3>
        <p>Found in search — and in AI answers.</p>
        <p><a href="services.html">Learn more →</a></p>
      </div>
      <div class="card">
        <h3>Google Ads</h3>
        <p>Spend less. Convert more.</p>
        <p><a href="services.html">Learn more →</a></p>
      </div>
    </div>
  </section>

  <!-- ILLUSTRATIVE RESULTS SECTION — self-contained, safe to delete entirely if a thinner homepage is wanted later -->
  <section class="section container" id="illustrative-results">
    <h2>What this can look like</h2>
    <div class="card-grid">
      <div class="card">
        <h3>+140% organic traffic</h3>
        <p class="illustrative-disclaimer">Illustrative example — not a real client result yet.</p>
      </div>
      <div class="card">
        <h3>−32% cost per lead</h3>
        <p class="illustrative-disclaimer">Illustrative example — not a real client result yet.</p>
      </div>
      <div class="card">
        <h3>3.2x faster page load</h3>
        <p class="illustrative-disclaimer">Illustrative example — not a real client result yet.</p>
      </div>
    </div>
  </section>
  <!-- END ILLUSTRATIVE RESULTS SECTION -->

  <section class="section container">
    <h2>Ready to find the crack?</h2>
    <p><a class="btn" href="contact.html">Get the audit →</a></p>
  </section>
</main>

<footer class="site-footer">
  <span>Ollin — Digital Marketing</span>
  <a href="mailto:axel.barrettorodriguez@gmail.com">axel.barrettorodriguez@gmail.com</a>
  <span>© 2026 Ollin</span>
</footer>

<script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the page loads and contains the key content**

Using the Browser tool: `navigate` to `file:///C:/Users/axelb/Documents/freelance-site/index.html`, then `get_page_text`.
Expected: page text includes "Find the crack." and "Get the audit" and "illustrative-results" section text "What this can look like".

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add Home page"
```

---

### Task 4: Services page

**Files:**
- Create: `services.html`

**Interfaces:**
- Consumes: same `styles.css`/`main.js` contract as Task 3; reuses the identical nav/footer block with `aria-current="page"` moved to the Services link.

- [ ] **Step 1: Write `services.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Services — Ollin</title>
<meta name="description" content="Website optimization and creation, SEO + AEO/GEO, and Google Ads management from Ollin.">
<meta property="og:title" content="Services — Ollin">
<meta property="og:description" content="Website optimization and creation, SEO + AEO/GEO, and Google Ads management.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand">Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="services.html" aria-current="page">Services</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">What I do</p>
    <h1 class="reveal reveal-2">Services</h1>
    <p class="reveal reveal-3">Three levers, used together or on their own: your website, how people find it, and what you pay to be found faster.</p>
  </section>

  <section class="section container">
    <h2>Website Optimization / Creation</h2>
    <p>Full rebuilds for businesses that need one, and targeted fixes — speed, conversion paths, mobile experience — for the ones that just need repair.</p>
    <p>For businesses whose site is either missing, embarrassing, or quietly leaking customers.</p>
    <p><a class="btn" href="contact.html">Ask about this</a></p>
  </section>

  <section class="section container">
    <h2>SEO + AEO/GEO</h2>
    <p>Ranked where people are actually looking now — including inside AI answers. Traditional search optimization plus positioning for answer engines and generative search (ChatGPT, Gemini, AI Overviews), which increasingly shape discovery before a click ever happens.</p>
    <p>For businesses that show up on page two, or don't show up in AI answers at all.</p>
    <p><a class="btn" href="contact.html">Ask about this</a></p>
  </section>

  <section class="section container">
    <h2>Google Ads</h2>
    <p>Campaigns built to spend less and convert more. Setup, structure, and ongoing management for new accounts — or a fix for one that's already bleeding budget.</p>
    <p>For businesses running ads without a clear read on what's actually working.</p>
    <p><a class="btn" href="contact.html">Ask about this</a></p>
  </section>

  <section class="section container">
    <h2>How it works</h2>
    <div class="card-grid">
      <div class="card">
        <h3>Audit</h3>
        <p>A full look at what's actually happening: traffic, rankings, ad spend, site performance.</p>
      </div>
      <div class="card">
        <h3>Plan</h3>
        <p>A prioritized plan built around what will move the needle first, not everything at once.</p>
      </div>
      <div class="card">
        <h3>Execute &amp; Report</h3>
        <p>Work gets done, and you get plain-language updates on what changed and what it did.</p>
      </div>
    </div>
  </section>

  <section class="section container">
    <h2>Ready to find the crack?</h2>
    <p><a class="btn" href="contact.html">Get the audit →</a></p>
  </section>
</main>

<footer class="site-footer">
  <span>Ollin — Digital Marketing</span>
  <a href="mailto:axel.barrettorodriguez@gmail.com">axel.barrettorodriguez@gmail.com</a>
  <span>© 2026 Ollin</span>
</footer>

<script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Using the Browser tool: `navigate` to `file:///C:/Users/axelb/Documents/freelance-site/services.html`, then `get_page_text`.
Expected: page text includes "Website Optimization / Creation", "SEO + AEO/GEO", "Google Ads", and "How it works".

- [ ] **Step 3: Commit**

```bash
git add services.html
git commit -m "Add Services page"
```

---

### Task 5: About page

**Files:**
- Create: `about.html`

**Interfaces:**
- Consumes: same contract as Task 3/4; nav `aria-current="page"` moved to About.

- [ ] **Step 1: Write `about.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About — Ollin</title>
<meta name="description" content="Axel Barretto — UNH Digital Marketing grad, currently at SC Digital, running Ollin as an independent practice.">
<meta property="og:title" content="About — Ollin">
<meta property="og:description" content="UNH Digital Marketing grad, currently at SC Digital, running Ollin as an independent practice.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand">Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="services.html">Services</a></li>
    <li><a href="about.html" aria-current="page">About</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">Who's behind this</p>
    <h1 class="reveal reveal-2">Axel Barretto</h1>
    <p class="reveal reveal-3">I diagnose marketing problems for a living — this is where I fix them directly.</p>
  </section>

  <section class="section container">
    <h2>Background</h2>
    <p>UNH — Digital Marketing &amp; Entrepreneurial Studies.</p>
    <p>Currently a Business Development Representative at SC Digital, a marketing agency, where I spend my days on the phone with business owners finding exactly where their marketing is breaking — a stalled website, a Google Ads account bleeding budget, a page that's invisible on search — and scoping the right fix with their client success team.</p>
  </section>

  <section class="section container">
    <h2>Why work with me</h2>
    <p>Most marketing advice is generic. My job at SC Digital is diagnosis, not decoration — figuring out what's actually broken before proposing what to fix. That's the same approach here: an audit before a pitch, and a plan built around your actual problem instead of a standard package.</p>
  </section>

  <section class="section container">
    <h2>Ready to find the crack?</h2>
    <p><a class="btn" href="contact.html">Get the audit →</a></p>
  </section>
</main>

<footer class="site-footer">
  <span>Ollin — Digital Marketing</span>
  <a href="mailto:axel.barrettorodriguez@gmail.com">axel.barrettorodriguez@gmail.com</a>
  <span>© 2026 Ollin</span>
</footer>

<script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Using the Browser tool: `navigate` to `file:///C:/Users/axelb/Documents/freelance-site/about.html`, then `get_page_text`.
Expected: page text includes "Axel Barretto", "SC Digital", and "UNH".

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "Add About page"
```

---

### Task 6: Contact page (form + Calendly)

**Files:**
- Create: `contact.html`

**Interfaces:**
- Consumes: `main.js`'s `#calendlyWidget`/`#calendlyFallback` contract from Task 2.
- Produces: the site's only form; its `action` attribute holds the `FORM_ENDPOINT_HERE` placeholder Axel must replace with his real Formspree endpoint, and the Calendly `data-url` holds `CALENDLY_URL_HERE` for his real scheduling link.

- [ ] **Step 1: Write `contact.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contact — Ollin</title>
<meta name="description" content="Get in touch with Ollin — send a message or book time directly.">
<meta property="og:title" content="Contact — Ollin">
<meta property="og:description" content="Send a message or book time directly.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand">Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="services.html">Services</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="contact.html" aria-current="page">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">Get in touch</p>
    <h1 class="reveal reveal-2">Contact</h1>
    <p class="reveal reveal-3">Tell me what's not working, or book time and we'll talk it through directly.</p>
  </section>

  <section class="section container">
    <h2>Send a message</h2>
    <form class="contact-form" action="https://formspree.io/f/FORM_ENDPOINT_HERE" method="POST">
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div>
        <label for="business">Business</label>
        <input type="text" id="business" name="business">
      </div>
      <div>
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <button class="btn" type="submit">Send message</button>
    </form>
    <p class="illustrative-disclaimer">I read every message personally and respond within 24 hours.</p>
  </section>

  <section class="section container">
    <h2>Or book time directly</h2>
    <div id="calendlyWidget" class="calendly-inline-widget" data-url="https://calendly.com/CALENDLY_URL_HERE" style="min-width:280px;height:600px;"></div>
    <p id="calendlyFallback" class="calendly-fallback" hidden>
      Booking widget didn't load — <a href="https://calendly.com/CALENDLY_URL_HERE">book a time here instead</a>.
    </p>
    <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
  </section>
</main>

<footer class="site-footer">
  <span>Ollin — Digital Marketing</span>
  <a href="mailto:axel.barrettorodriguez@gmail.com">axel.barrettorodriguez@gmail.com</a>
  <span>© 2026 Ollin</span>
</footer>

<script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Using the Browser tool: `navigate` to `file:///C:/Users/axelb/Documents/freelance-site/contact.html`, then `read_page` (filter: interactive).
Expected: a text input (`name`), an email input (`email`), a textarea (`message`), and a submit button are present; `read_page` also shows the `calendlyWidget` div.

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "Add Contact page with Formspree form and Calendly embed"
```

---

### Task 7: SEO files (sitemap, robots, favicon)

**Files:**
- Create: `sitemap.xml`
- Create: `robots.txt`
- Create: `favicon.svg`

**Interfaces:**
- Consumes: nothing.
- Produces: `favicon.svg` referenced by the `<link rel="icon">` tag already written into every page in Tasks 3–6 — no page changes needed here, only this file must exist at the root.

- [ ] **Step 1: Write `favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#3a2418"/>
  <text x="32" y="45" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-weight="700" fill="#e8c98a" text-anchor="middle">O</text>
</svg>
```

- [ ] **Step 2: Write `sitemap.xml`**

Domain is undecided (spec: Out of Scope — Hosting). Placeholder domain must be swapped once Axel picks a host.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://REPLACE_WITH_DOMAIN/index.html</loc></url>
  <url><loc>https://REPLACE_WITH_DOMAIN/services.html</loc></url>
  <url><loc>https://REPLACE_WITH_DOMAIN/about.html</loc></url>
  <url><loc>https://REPLACE_WITH_DOMAIN/contact.html</loc></url>
</urlset>
```

- [ ] **Step 3: Write `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://REPLACE_WITH_DOMAIN/sitemap.xml
```

- [ ] **Step 4: Verify all 4 pages reference the favicon**

Run (Grep tool, pattern `favicon.svg`, path `*.html`): expect 4 matches (index.html, services.html, about.html, contact.html).

- [ ] **Step 5: Commit**

```bash
git add favicon.svg sitemap.xml robots.txt
git commit -m "Add favicon, sitemap, and robots.txt"
```

---

### Task 8: Responsive & accessibility hardening

**Files:**
- Modify: `styles.css` (contrast check + any fixes)

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces: no new interface — this task only verifies and, if needed, adjusts existing token values.

- [ ] **Step 1: Compute contrast ratios for the token pairs actually used for text**

Gold text (`#e8c98a`) on stone background (`#3a2418`): relative luminance of `#e8c98a` ≈ 0.548, of `#3a2418` ≈ 0.026. Contrast ratio = (0.548+0.05)/(0.026+0.05) ≈ 7.87:1 — passes WCAG AA (4.5:1) and AAA (7:1) for normal text.

Cream button text (`#f2e4c8`) on oxblood button (`#5c1a15`): relative luminance of `#f2e4c8` ≈ 0.75, of `#5c1a15` ≈ 0.023. Contrast ratio = (0.75+0.05)/(0.023+0.05) ≈ 10.96:1 — passes AAA.

Both pass; no token changes required. (If either had failed, the fix would be adjusting `--color-gold` or `--color-cream` lightness until the ratio cleared 4.5:1 — noted here so a future pass has the method, not because it's needed now.)

- [ ] **Step 2: Verify mobile nav collapses correctly**

Using the Browser tool: `resize_window` to `mobile` preset, `navigate` to `file:///C:/Users/axelb/Documents/freelance-site/index.html`, `read_page` (filter: interactive) to confirm `#navToggle` button is visible and `#navLinks` is present but not `.open`. Click `#navToggle` via `computer` (`left_click`), then `read_page` again to confirm `#navLinks` now has class `open`.

- [ ] **Step 3: Verify focus states are visible**

Using the Browser tool: `navigate` to `file:///C:/Users/axelb/Documents/freelance-site/index.html`, `computer` action `key` with `Tab` several times, `screenshot` to confirm a visible gold outline appears on the focused link/button (from the `:focus-visible` rule in `styles.css`).

- [ ] **Step 4: Commit (only if Step 1 required changes; otherwise skip)**

```bash
git add styles.css
git commit -m "Adjust palette for WCAG AA contrast"
```

---

### Task 9: Final integration QA pass

**Files:**
- None (verification only; fix forward in the relevant file if something fails)

**Interfaces:**
- Consumes: the fully built site from Tasks 1–8.

- [ ] **Step 1: Walk all 4 pages at 3 viewport widths**

Using the Browser tool: for each of `index.html`, `services.html`, `about.html`, `contact.html`, and for each `resize_window` preset (`mobile`, `tablet`, `desktop`): `navigate` to the page, `screenshot`, confirm no horizontal scroll and no overlapping text.

- [ ] **Step 2: Verify every nav link resolves**

Using the Browser tool: from `index.html`, click each of the 4 nav links in turn (`find` + `computer` `left_click`), confirm via `get_page_text` that the destination page's `<h1>` text matches the expected page (Home/Services/About/Contact).

- [ ] **Step 3: Verify the contact form's required-field validation**

Using the Browser tool: `navigate` to `contact.html`, click "Send message" without filling any fields, confirm via `read_console_messages` or `screenshot` that the browser's native validation blocks submission (focus moves to the first required empty field).

- [ ] **Step 4: Verify the Calendly fallback link is reachable**

Confirm (via `read_page`) that `#calendlyFallback` contains a real `<a>` tag pointing at `https://calendly.com/CALENDLY_URL_HERE` — this proves the fallback works structurally even before Axel supplies his real Calendly username.

- [ ] **Step 5: Record any placeholders still pending real values**

Grep the whole project for `FORM_ENDPOINT_HERE` and `CALENDLY_URL_HERE` and list every file/line found — hand this list to Axel as the "before going live" checklist alongside the domain placeholder in `sitemap.xml`/`robots.txt`.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "Final QA pass for Ollin site v1"
```
