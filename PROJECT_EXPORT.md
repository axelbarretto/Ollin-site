# Ollin — Project Export
*Generated 2026-08-03 at git commit `dc12005` on `master`. Upload this whole file into a fresh chat to keep working with full context.*

---

## 1. Architecture Summary

**What this is:** Ollin is Axel Barretto's freelance digital marketing services website (separate from his other project, Centrip). Three services: Website Optimization/Creation, SEO + AEO/GEO, Google Ads. It's the sales asset he sends/references when pitching businesses directly. Brand name "Ollin" = Nahuatl for "movement," tied to Axel's middle name Tonatiuh (Aztec sun deity).

**Tech stack:** Vanilla HTML/CSS/JS. No framework, no build step, no npm dependencies — deliberate choice. Nav/footer markup is duplicated per page rather than templated (at this page count, a build step or JS include adds more complexity than it saves; `fetch()`-based includes were explicitly considered and rejected because they break when opened directly from disk).

**Files:**
- One shared `styles.css` — all visual system as CSS custom properties, all animations, all layout.
- One shared `main.js` — nav toggle, Calendly fallback timeout, "How It Works" slider, hero typewriter effect.
- 9 HTML pages: `index.html`, `services.html`, `service-website.html`, `service-seo.html`, `service-ads.html`, `about-founder.html`, `about-ollin.html`, `contact.html`. (A 9th, `about.html`, was deleted — superseded by the about-founder/about-ollin split.)
- `favicon.svg`, `sitemap.xml`, `robots.txt` for SEO/meta (site sells SEO, so it dogfoods basic SEO hygiene).

**Repo / deploy:**
- Local repo: `C:\Users\axelb\Documents\freelance-site`
- Remote: `origin` → `https://github.com/axelbarretto/Ollin-site.git`
- Branch: working directly on `master`, no feature branches (deliberate, solo project)
- Deployed via **GitHub Pages** — live at **https://axelbarretto.github.io/Ollin-site/**
- Every `git push` to `master` auto-redeploys within ~1–2 minutes, no extra steps
- Established workflow: **build → verify in browser → commit → push**
- Current HEAD as of this export: commit `dc12005`, working tree clean

**Design system:**
- Palette (CSS vars in `styles.css` `:root`): `--color-stone:#0c1a13` (bg), `--color-ink:#050c08`, `--color-gold:#c9a15a` (headlines/accent), `--color-oxblood:#4a3a1a` (bronze, gradients/secondary), `--color-cream:#ece7d9` (body text), `--color-card:#16281d` (card surfaces)
- Fonts: **Rozha One** (display headlines, carved-inscription feel), **Space Mono** (labels/buttons/UI), **Lora** (body copy)
- Carved-text effect: `text-shadow: 1px 1px 0 var(--color-ink), -1px -1px 0 rgba(255,255,255,0.15)` on h1/h2/h3
- Chisel texture: `repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)` + radial vignette, applied to `body`
- Buttons: `.btn` = gold-filled, dark ink text; `.btn-outline` = transparent, gold border/text (secondary CTA)
- Logo: hand-coded SVG sunburst/mandala (16 radiating lines + 2 rings + center dot), `currentColor`-based, in nav on every page
- Motion rule (**important, learned the hard way**): animate only `transform`/`opacity` — GPU-composited and cheap. Never animate `background-position`, `mix-blend-mode`, or `mask-image` — these force an expensive repaint/recomposite every frame and caused a real, noticeable lag that had to be diagnosed and fixed. All decorative animation is wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Palette history: originally "Sunstone Relief" (warm stone/adobe + oxblood red), fully superseded 2026-08-02 when Axel brought in a new ChatGPT-designed direction (the dark green/gold palette above). Same file structure and CSS-variable system carried over, only token values and the button/logo treatment changed.

**Known quirks / lessons for the next session:**
- I (Claude) am never permitted to run `git config` — Axel must run `git config --global user.name/user.email` himself if a fresh machine ever needs it.
- No working `gh` CLI or GitHub MCP connector was available in the session that built this — all GitHub operations were done via plain `git` over HTTPS (Windows' cached credential manager handled auth with no extra steps). Don't assume a GitHub connector works; verify first, expect to fall back to plain git.
- Browser preview panes can serve a stale cached copy of `styles.css`/`main.js` across repeat navigations in the same tab — if a change doesn't seem to show up, open a genuinely fresh tab or cache-bust before concluding something is broken.
- CSS specificity bit us once already: a plain class selector can be silently overridden by a more specific combined selector defined earlier in the file. If a rule doesn't seem to apply, check computed styles, not just "is the rule there."

---

## 2. Complete Source Code

### `styles.css`

```css
:root {
  --color-stone: #0c1a13;
  --color-ink: #050c08;
  --color-gold: #c9a15a;
  --color-oxblood: #4a3a1a;
  --color-cream: #ece7d9;

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
  --max-width: 1320px;

  --color-card: #16281d;
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
.eyebrow a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}
.eyebrow a:hover { border-color: currentColor; }
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
  background-color: #6b5024;
  color: #000;
  padding: 14px 26px;
  border-radius: 2px;
  text-decoration: none;
  border: 1px solid #6b5024;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn:hover { background-color: #59421e; transform: translateY(-1px); }

.btn-outline {
  background-color: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
}
.btn-outline:hover { background-color: rgba(201,161,90,0.1); }

.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--space-3); }

nav.site-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid rgba(201,161,90,0.15);
}
nav.site-nav .brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  color: var(--color-gold);
  text-decoration: none;
  font-size: 1.3rem;
}
.logo-mark { width: 26px; height: 26px; flex-shrink: 0; }
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

.has-dropdown { position: relative; }
nav.site-nav .dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 230px;
  background-color: var(--color-stone);
  border: 1px solid rgba(201,161,90,0.2);
  border-radius: 8px;
  padding: var(--space-1) 0;
  list-style: none;
  margin: var(--space-1) 0 0 0;
  box-shadow: 0 12px 24px rgba(0,0,0,0.45);
  z-index: 20;
}
.has-dropdown:hover .dropdown,
.has-dropdown:focus-within .dropdown { display: block; }
.dropdown a {
  display: block;
  padding: 8px 16px;
  white-space: nowrap;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.85rem;
}
.dropdown a:hover { background-color: rgba(201,161,90,0.12); }

footer.site-footer {
  border-top: 1px solid rgba(201,161,90,0.15);
  padding: var(--space-3);
  margin-top: var(--space-5);
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: rgba(236,231,217,0.7);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
}
footer.site-footer a { color: rgba(236,231,217,0.7); }

section.hero { padding: var(--space-5) var(--space-3); }
.hero-content { display: flex; flex-direction: column; justify-content: space-between; min-height: 78vh; }
.hero.bg-sun-sweep h1 { font-size: clamp(2.8rem, 7vw, 4.6rem); }
.hero-ctas { margin-top: var(--space-4); }
section.section { padding: var(--space-4) var(--space-3); }

.hero-rotate { font-size: 1.15rem; max-width: 65ch; }
.hero-rotate-word { color: var(--color-gold); font-weight: 700; }
.hero-rotate-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: var(--color-gold);
  margin-left: 2px;
  vertical-align: text-bottom;
}
@media (prefers-reduced-motion: no-preference) {
  .hero-rotate-cursor { animation: cursor-blink 1s step-start infinite; }
}
@keyframes cursor-blink { 50% { opacity: 0; } }

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
  border: 1px solid rgba(201,161,90,0.2);
  padding: var(--space-3);
}
.card p { font-size: 0.95rem; color: rgba(236,231,217,0.85); }

.illustrative-disclaimer {
  font-family: var(--font-label);
  font-size: 0.7rem;
  color: rgba(236,231,217,0.55);
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
  border: 1px solid rgba(201,161,90,0.3);
  color: var(--color-cream);
  padding: 10px 12px;
  border-radius: 2px;
}
form.contact-form textarea { min-height: 120px; resize: vertical; }

.calendly-fallback { font-family: var(--font-label); font-size: 0.85rem; }

.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-3);
}
.process-step {
  display: flex;
  flex-direction: column;
  background-color: var(--color-card);
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.35);
  overflow: hidden;
}

/* Placeholder graphic area — sized and positioned so a real <img> (stock
   photo, Canva export, etc.) can drop in later without restructuring
   anything else. */
.process-image {
  height: 320px;
  background-color: #f5f2ea;
  display: flex;
  align-items: center;
  justify-content: center;
}
.process-image--build .build-scene { stroke: var(--color-ink); }
.process-image--build .build-scene circle[fill="currentColor"],
.process-image--build .build-scene path[fill="currentColor"] { fill: var(--color-ink); }
.process-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
}

.process-grid.is-slider {
  display: block;
  min-height: 460px;
  position: relative;
}
.process-grid.is-slider .process-step { display: none; opacity: 0; }
.process-grid.is-slider .process-step.active {
  display: flex;
  opacity: 1;
  animation: reveal-up 0.5s ease-out;
}

.slider-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.slider-arrow {
  background: none;
  border: 1px solid rgba(201,161,90,0.3);
  color: var(--color-gold);
  font-family: var(--font-label);
  font-size: 0.9rem;
  padding: 6px 14px;
  cursor: pointer;
  border-radius: 2px;
  transition: border-color 0.2s ease;
}
.slider-arrow:hover { border-color: var(--color-gold); }
.slider-dots { display: flex; gap: 8px; }
.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(201,161,90,0.3);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
}
.slider-dot.active { background-color: var(--color-gold); }
.process-icon {
  width: 64px;
  height: 64px;
  stroke: var(--color-gold);
  fill: none;
  stroke-width: 1.2;
}
.process-image--build { padding: var(--space-1); }
.process-step h3 { font-size: 1.6rem; }
.process-step p { font-size: 1.15rem; color: rgba(236,231,217,0.85); }

/* Small looping animations on the Services icons — transform/opacity only,
   disabled entirely for reduced-motion users. */
@media (prefers-reduced-motion: no-preference) {
  .icon-cursor {
    transform-origin: 17px 15px;
    animation: cursor-tap 1.8s ease-in-out infinite;
  }
  .icon-signal {
    animation: signal-pulse 1.6s ease-in-out infinite;
  }
  .icon-arrow {
    animation: arrow-fly 1.8s ease-in-out infinite;
  }
}
@keyframes cursor-tap {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.82); }
}
@keyframes signal-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
@keyframes arrow-fly {
  0%, 100% { transform: translate(3px, -3px); opacity: 0.4; }
  50% { transform: translate(0, 0); opacity: 1; }
}

.service-block { padding: var(--space-5) 0; }
.service-block--shade { background-color: rgba(201,161,90,0.05); }
.service-block .eyebrow { margin-bottom: var(--space-1); }

.service-block-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-4);
  align-items: center;
}
.service-block-image {
  min-height: 280px;
  border-radius: 16px;
  background: linear-gradient(160deg, rgba(201,161,90,0.2), rgba(0,0,0,0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.service-block-image:hover {
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 20px 36px rgba(0,0,0,0.45);
}

.service-block-textbox {
  background-color: rgba(0,0,0,0.18);
  border: 1px solid rgba(201,161,90,0.15);
  border-radius: 16px;
  padding: var(--space-3);
}

/* Bigger animated "building a website" scene — fills the whole card
   instead of a small centered icon. */
.service-block-image--build { padding: var(--space-3); }
.build-scene {
  width: 100%;
  height: 100%;
  stroke: var(--color-gold);
  fill: none;
  stroke-width: 1.5;
}
.build-cursor { transform: translate(70px, 64px); transform-origin: 0 0; }

@media (prefers-reduced-motion: no-preference) {
  .build-cursor { animation: build-cursor-move 7s ease-in-out infinite; }
  .build-block-1 { animation: build-fade 4s ease-in-out infinite; }
  .build-block-2 { animation: build-fade 4s ease-in-out infinite; animation-delay: 0.6s; }
  .build-block-3 { animation: build-fade 4s ease-in-out infinite; animation-delay: 1.2s; }
  .build-block-4 { animation: build-fade 4s ease-in-out infinite; animation-delay: 1.8s; }
}
@keyframes build-fade {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
@keyframes build-cursor-move {
  0%   { transform: translate(70px, 64px) scale(1); }
  10%  { transform: translate(70px, 64px) scale(0.8); }
  20%  { transform: translate(70px, 64px) scale(1); }
  38%  { transform: translate(40px, 110px) scale(1); }
  48%  { transform: translate(40px, 110px) scale(0.8); }
  58%  { transform: translate(40px, 110px) scale(1); }
  76%  { transform: translate(150px, 110px) scale(1); }
  86%  { transform: translate(150px, 110px) scale(0.8); }
  96%  { transform: translate(150px, 110px) scale(1); }
  100% { transform: translate(70px, 64px) scale(1); }
}

/* SEO scene: rank badge climbs from bottom result to #1, AI-answer
   citation checkmark pulses. */
.seo-rank {
  transform: translate(155px, 140px);
  transform-origin: 0 0;
}
.seo-check { transform-origin: 269px 158px; }
@media (prefers-reduced-motion: no-preference) {
  .seo-rank { animation: seo-rank-climb 5s ease-in-out infinite; }
  .seo-check { animation: build-fade 3s ease-in-out infinite; animation-delay: 1s; }
}
@keyframes seo-rank-climb {
  0%   { transform: translate(155px, 140px); opacity: 1; }
  40%  { transform: translate(145px, 76px); opacity: 1; }
  55%  { transform: translate(145px, 76px); opacity: 1; }
  85%  { transform: translate(145px, 76px); opacity: 0; }
  86%  { transform: translate(155px, 140px); opacity: 0; }
  100% { transform: translate(155px, 140px); opacity: 1; }
}

/* Google Ads scene: cursor clicks the ad, bars grow to show performance,
   trend line pulses. */
.ads-cursor { transform: translate(34px, 32px); transform-origin: 0 0; }
@media (prefers-reduced-motion: no-preference) {
  .ads-cursor { animation: build-cursor-tap-simple 3s ease-in-out infinite; }
  .ads-bar-1 { animation: ads-bar-grow 8s ease-in-out infinite; }
  .ads-bar-2 { animation: ads-bar-grow 8s ease-in-out infinite; animation-delay: 0.15s; }
  .ads-bar-3 { animation: ads-bar-grow 8s ease-in-out infinite; animation-delay: 0.3s; }
  .ads-bar-4 { animation: ads-bar-grow 8s ease-in-out infinite; animation-delay: 0.45s; }
  .ads-bar-5 { animation: ads-bar-grow 8s ease-in-out infinite; animation-delay: 0.6s; }
  .ads-trend { animation: build-fade 3s ease-in-out infinite; animation-delay: 0.3s; }
}
@keyframes build-cursor-tap-simple {
  0%, 60%, 100% { transform: translate(34px, 32px) scale(1); }
  75% { transform: translate(34px, 32px) scale(0.8); }
}
.ads-bar { transform-origin: bottom; }
@keyframes ads-bar-grow {
  0%, 100% { transform: scaleY(0.35); }
  35%, 75% { transform: scaleY(1); }
}

/* How It Works scenes */

/* Intro call: pulsing rings around the phone, chat bubbles fading in */
.call-ring { transform-origin: 160px 80px; opacity: 0; }
@media (prefers-reduced-motion: no-preference) {
  .call-ring-1 { animation: call-ring-pulse 2.4s ease-out infinite; }
  .call-ring-2 { animation: call-ring-pulse 2.4s ease-out infinite; animation-delay: 0.8s; }
  .call-ring-3 { animation: call-ring-pulse 2.4s ease-out infinite; animation-delay: 1.6s; }
}
@keyframes call-ring-pulse {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(1.7); opacity: 0; }
}
.call-dot { transform-origin: center; }
@media (prefers-reduced-motion: no-preference) {
  .call-dot-1 { animation: call-dot-bounce 1.2s ease-in-out infinite; }
  .call-dot-2 { animation: call-dot-bounce 1.2s ease-in-out infinite; animation-delay: 0.15s; }
  .call-dot-3 { animation: call-dot-bounce 1.2s ease-in-out infinite; animation-delay: 0.3s; }
}
@keyframes call-dot-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

/* The audit: magnifying glass scans down past each checklist row */
.audit-glass { transform: translate(255px, 55px); transform-origin: 0 0; stroke-width: 2; }
@media (prefers-reduced-motion: no-preference) {
  .audit-glass { animation: audit-glass-scan 6s ease-in-out infinite; }
}
@keyframes audit-glass-scan {
  0%, 12%   { transform: translate(255px, 55px); }
  25%, 37%  { transform: translate(255px, 99px); }
  50%, 62%  { transform: translate(255px, 143px); }
  75%, 87%  { transform: translate(255px, 187px); }
  100%      { transform: translate(255px, 55px); }
}
.audit-spark { opacity: 0; transform-origin: center; }
@media (prefers-reduced-motion: no-preference) {
  .audit-spark-1 { animation: audit-spark-pop 6s ease-in-out infinite; animation-delay: 0.6s; }
  .audit-spark-2 { animation: audit-spark-pop 6s ease-in-out infinite; animation-delay: 2.1s; }
  .audit-spark-3 { animation: audit-spark-pop 6s ease-in-out infinite; animation-delay: 3.6s; }
  .audit-spark-4 { animation: audit-spark-pop 6s ease-in-out infinite; animation-delay: 5.1s; }
}
@keyframes audit-spark-pop {
  0%, 90%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
  8% { opacity: 1; transform: scale(1.2) rotate(20deg); }
  18% { opacity: 0; transform: scale(0.8) rotate(40deg); }
}

/* The plan: a marker travels along the dashed route between waypoints */
.plan-marker { transform: translate(50px, 190px); transform-origin: 0 0; }
@media (prefers-reduced-motion: no-preference) {
  .plan-marker { animation: plan-marker-move 5s ease-in-out infinite; }
}
@keyframes plan-marker-move {
  0%, 10%  { transform: translate(50px, 190px); }
  40%, 55% { transform: translate(150px, 118px); }
  85%, 95% { transform: translate(260px, 50px); }
  100%     { transform: translate(50px, 190px); }
}
.plan-path { stroke-dasharray: 100; stroke-dashoffset: 100; }
@media (prefers-reduced-motion: no-preference) {
  .plan-path { animation: plan-path-draw 5s ease-in-out infinite; }
  .plan-flag { animation: plan-flag-bounce 1.4s ease-in-out infinite; animation-delay: 3.5s; }
}
@keyframes plan-path-draw {
  0%, 10% { stroke-dashoffset: 100; }
  85%, 100% { stroke-dashoffset: 0; }
}
.plan-flag { transform-origin: 260px 50px; }
@keyframes plan-flag-bounce {
  0%, 100% { transform: translate(260px, 50px) scale(1); }
  50% { transform: translate(260px, 46px) scale(1.08); }
}

/* Execution & reporting: progress bar fills on a loop */
.report-progress { transform-origin: left; }
@media (prefers-reduced-motion: no-preference) {
  .report-progress { animation: report-progress-fill 4s ease-in-out infinite; }
}
@keyframes report-progress-fill {
  0%, 100% { transform: scaleX(0.05); }
  60% { transform: scaleX(1); }
}
.report-plane { transform: translate(48px, 174px) rotate(0deg); transform-origin: 0 0; }
@media (prefers-reduced-motion: no-preference) {
  .report-plane { animation: report-plane-fly 4s ease-in-out infinite; }
}
@keyframes report-plane-fly {
  0%   { transform: translate(48px, 174px) rotate(0deg); opacity: 0; }
  15%  { opacity: 1; }
  70%  { transform: translate(210px, 100px) rotate(-25deg); opacity: 1; }
  85%  { opacity: 0; }
  100% { transform: translate(48px, 174px) rotate(0deg); opacity: 0; }
}

@media (max-width: 768px) {
  .service-block-grid { grid-template-columns: 1fr; }
}

.section-title { font-size: clamp(2rem, 4.5vw, 3rem); }

.problem-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-3);
}
.problem-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  background-color: var(--color-card);
  border-radius: 12px;
  padding: var(--space-3);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.problem-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 14px 28px rgba(0,0,0,0.4);
  background-color: #f5f2ea;
}
.problem-card:hover p { color: var(--color-ink); }
.problem-card:hover .problem-x { color: var(--color-ink); }
.problem-x {
  color: var(--color-gold);
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.3;
  flex-shrink: 0;
  display: inline-block;
  transition: transform 0.2s ease, color 0.2s ease;
}
.problem-card:hover .problem-x { transform: scale(1.3) rotate(90deg); }
.problem-card p { margin: 0; font-size: 0.95rem; transition: color 0.2s ease; }

.problem-banner {
  margin-top: var(--space-3);
  background: linear-gradient(120deg, var(--color-ink), var(--color-oxblood));
  border-radius: 16px;
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.problem-banner p {
  margin: 0;
  color: var(--color-cream);
  font-weight: 600;
  font-size: 1.05rem;
  max-width: none;
}
.problem-banner-btn {
  background-color: var(--color-cream);
  color: var(--color-ink);
  white-space: nowrap;
}
.problem-banner-btn:hover { background-color: #fff; }

@media (max-width: 768px) {
  .problem-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .problem-banner { flex-direction: column; align-items: flex-start; }
}

.cta-banner {
  background-color: var(--color-card);
  border-radius: 24px;
  padding: var(--space-5);
  box-shadow: 0 16px 32px rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.cta-banner-title {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  margin-bottom: var(--space-1);
}
.cta-banner-text p {
  margin: 0;
  color: rgba(236,231,217,0.85);
}
.cta-banner-btn { white-space: nowrap; }
@media (max-width: 640px) {
  .cta-banner { flex-direction: column; align-items: flex-start; }
}

.footer-links {
  border-top: 1px solid rgba(201,161,90,0.15);
  padding: var(--space-5) 0;
}
.footer-links-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: var(--space-4);
}
.footer-brand-name {
  font-family: var(--font-display);
  color: var(--color-gold);
  text-shadow: var(--shadow-carve);
  font-size: 1.8rem;
}
.footer-links-col h3 {
  font-family: var(--font-label);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold);
  text-shadow: none;
  margin-bottom: var(--space-2);
}
.quick-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.quick-links a {
  font-family: var(--font-label);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-decoration: none;
}

@media (max-width: 640px) {
  .footer-links-grid { grid-template-columns: 1fr; gap: var(--space-3); }
}

@media (max-width: 768px) {
  .card-grid { grid-template-columns: 1fr; }
  .process-grid { grid-template-columns: repeat(2, 1fr); }
  .final-grid { grid-template-columns: 1fr; }
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
  nav.site-nav .dropdown {
    display: block;
    position: static;
    background: none;
    border: none;
    box-shadow: none;
    padding: 0 0 0 var(--space-2);
    margin: var(--space-1) 0 0 0;
  }
}

/* Animated hero background — full-bleed effect behind a centered .container.
   Only applies when bg-sun-sweep is present, so other pages' plain
   `.hero.container` combined elements are unaffected. */
section.hero.bg-sun-sweep {
  position: relative;
  overflow: hidden;
  padding: var(--space-5) 0;
}
section.hero.bg-sun-sweep > .container {
  position: relative;
  z-index: 2;
}

/* Decorative overlapping gold rings, static (no animation cost). Bleeds
   off the top-right edge so it reads as a fragment of a larger circle.
   aspect-ratio locks the box to the artwork's own proportions (matching
   the 800x500 viewBox) so it's never a mismatched shape to stretch or
   crop into — consistent round circles at every viewport width. */
.hero-lines {
  position: absolute;
  top: -75%;
  right: -35%;
  width: 160vw;
  aspect-ratio: 800 / 500;
  stroke: var(--color-gold);
  stroke-width: 2.2;
  fill: none;
  opacity: 0.55;
  pointer-events: none;
  z-index: 1;
  transform: rotate(-90deg) scaleY(-1);
  filter: drop-shadow(0 0 6px rgba(201,161,90,0.9)) drop-shadow(0 0 16px rgba(201,161,90,0.5));
}

/* Static (non-animated) fade so the section boundary below the hero is
   never a hard line, whatever the animated ember/sun layers are doing
   underneath. Zero performance cost — it never moves. */
.hero-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
  background: linear-gradient(to bottom, transparent, var(--color-stone));
  pointer-events: none;
  z-index: 3;
}

section.hero.bg-sun-sweep::after {
  content: '';
  position: absolute;
  top: -15%;
  left: -10%;
  width: 130%;
  height: 130%;
  background: radial-gradient(circle, rgba(201,161,90,0.35) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: no-preference) {
  section.hero.bg-sun-sweep::after { animation: sun-sweep 24s ease-in-out infinite; }
}
@keyframes sun-sweep {
  0%   { transform: translate3d(-6%, -3%, 0); opacity: 0; }
  20%  { opacity: 0.75; }
  50%  { transform: translate3d(6%, 3%, 0); opacity: 0.75; }
  80%  { opacity: 0.75; }
  100% { transform: translate3d(-6%, -3%, 0); opacity: 0; }
}
```

### `main.js`

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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const processGrid = document.querySelector('.process-grid');
  if (processGrid && !reducedMotion) {
    const steps = Array.from(processGrid.children);
    processGrid.classList.add('is-slider');
    processGrid.setAttribute('role', 'region');
    processGrid.setAttribute('aria-roledescription', 'carousel');
    processGrid.setAttribute('aria-label', 'How it works, step by step');
    processGrid.setAttribute('aria-live', 'polite');

    const controls = document.createElement('div');
    controls.className = 'slider-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-arrow';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous step');
    prevBtn.textContent = '←';

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-arrow';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next step');
    nextBtn.textContent = '→';

    controls.append(prevBtn, dotsContainer, nextBtn);
    processGrid.insertAdjacentElement('afterend', controls);

    steps.forEach((step, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to step ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    let current = 0;
    let timer;

    function render() {
      steps.forEach((step, i) => step.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = (index + steps.length) % steps.length;
      render();
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 7000);
    }

    nextBtn.addEventListener('click', () => goTo(current + 1));
    prevBtn.addEventListener('click', () => goTo(current - 1));
    processGrid.addEventListener('mouseenter', () => clearInterval(timer));
    processGrid.addEventListener('mouseleave', resetTimer);
    processGrid.addEventListener('focusin', () => clearInterval(timer));
    processGrid.addEventListener('focusout', resetTimer);

    render();
    resetTimer();
  }

  const heroRotate = document.querySelector('.hero-rotate');
  const heroRotateWord = document.getElementById('heroRotateWord');
  if (heroRotate && heroRotateWord) {
    let phrases = [];
    try {
      phrases = JSON.parse(heroRotate.getAttribute('data-phrases'));
    } catch (e) {
      phrases = [];
    }
    if (phrases.length) {
      if (reducedMotion) {
        heroRotateWord.textContent = phrases[0];
      } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let typing = true;

        function tick() {
          const current = phrases[phraseIndex];
          if (typing) {
            charIndex++;
            heroRotateWord.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
              typing = false;
              window.setTimeout(tick, 1400);
              return;
            }
            window.setTimeout(tick, 70);
          } else {
            charIndex--;
            heroRotateWord.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
              typing = true;
              phraseIndex = (phraseIndex + 1) % phrases.length;
              window.setTimeout(tick, 400);
              return;
            }
            window.setTimeout(tick, 35);
          }
        }

        tick();
      }
    }
  }
});
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ollin, Always — Digital Marketing</title>
<meta name="description" content="Website optimization, SEO/AEO/GEO, and Google Ads for businesses that know something's off but not what. Built by Axel Barretto.">
<meta property="og:title" content="Ollin, Always — Digital Marketing">
<meta property="og:description" content="Website optimization, SEO/AEO/GEO, and Google Ads — built and managed by someone who does this daily.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html" aria-current="page">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero bg-sun-sweep">
    <svg class="hero-lines" viewBox="0 0 800 500" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="640" cy="140" rx="260" ry="260" transform="rotate(-15 640 140)"/>
      <ellipse cx="600" cy="220" rx="220" ry="220" transform="rotate(20 600 220)"/>
    </svg>
    <div class="container hero-content">
      <div class="hero-top">
        <p class="eyebrow reveal reveal-1">Website. SEO. Google Ads.</p>
        <h1 class="reveal reveal-2">We're Ollin on your business, always.</h1>
        <p class="hero-rotate reveal reveal-2" data-phrases="[&quot;more visibility&quot;,&quot;more clicks&quot;,&quot;more leads&quot;,&quot;higher rankings&quot;,&quot;better reach&quot;,&quot;more traffic&quot;,&quot;stronger presence&quot;,&quot;more conversions&quot;,&quot;greater authority&quot;,&quot;more calls&quot;,&quot;more bookings&quot;,&quot;wider audience&quot;,&quot;faster growth&quot;,&quot;more reviews&quot;,&quot;better retention&quot;,&quot;more followers&quot;,&quot;increased sales&quot;,&quot;more referrals&quot;]">Built to be found with <span class="hero-rotate-word" id="heroRotateWord"></span><span class="hero-rotate-cursor" aria-hidden="true"></span></p>
      </div>
      <p class="reveal reveal-3 hero-ctas">
        <a class="btn" href="contact.html">Get started</a>
        &nbsp;&nbsp;
        <a class="btn btn-outline" href="services.html">See services</a>
      </p>
    </div>
    <div class="hero-fade" aria-hidden="true"></div>
  </section>

  <section class="section container">
    <h2 class="section-title">How it works</h2>
    <div class="process-grid">
      <div class="process-step">
        <div class="process-image process-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <circle class="call-ring call-ring-1" cx="160" cy="80" r="26"/>
            <circle class="call-ring call-ring-2" cx="160" cy="80" r="26"/>
            <circle class="call-ring call-ring-3" cx="160" cy="80" r="26"/>
            <g transform="translate(148,68)">
              <path d="M6 3h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2z"/>
            </g>
            <rect class="build-block build-block-1" x="50" y="150" width="100" height="36" rx="12"/>
            <rect class="build-block build-block-2" x="170" y="150" width="100" height="36" rx="12"/>
            <line class="build-block build-block-1" x1="64" y1="163" x2="130" y2="163" stroke-width="1"/>
            <line class="build-block build-block-1" x1="64" y1="172" x2="110" y2="172" stroke-width="1"/>
            <line class="build-block build-block-2" x1="184" y1="163" x2="250" y2="163" stroke-width="1"/>
            <line class="build-block build-block-2" x1="184" y1="172" x2="230" y2="172" stroke-width="1"/>
            <rect x="140" y="198" width="42" height="22" rx="11"/>
            <circle class="call-dot call-dot-1" cx="151" cy="209" r="2.4" fill="currentColor" stroke="none"/>
            <circle class="call-dot call-dot-2" cx="161" cy="209" r="2.4" fill="currentColor" stroke="none"/>
            <circle class="call-dot call-dot-3" cx="171" cy="209" r="2.4" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <div class="process-content">
          <h3>Intro call</h3>
          <p>A quick, no-pressure conversation about what's actually going on.</p>
        </div>
      </div>
      <div class="process-step">
        <div class="process-image process-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <rect x="30" y="24" width="200" height="192" rx="10"/>
            <rect class="build-block build-block-1" x="48" y="48" width="14" height="14" rx="3"/>
            <path class="build-block build-block-1" d="M50 55l4 4l7-8"/>
            <line x1="72" y1="55" x2="204" y2="55"/>
            <rect class="build-block build-block-2" x="48" y="92" width="14" height="14" rx="3"/>
            <path class="build-block build-block-2" d="M50 99l4 4l7-8"/>
            <line x1="72" y1="99" x2="190" y2="99"/>
            <rect class="build-block build-block-3" x="48" y="136" width="14" height="14" rx="3"/>
            <path class="build-block build-block-3" d="M50 143l4 4l7-8"/>
            <line x1="72" y1="143" x2="198" y2="143"/>
            <rect class="build-block build-block-4" x="48" y="180" width="14" height="14" rx="3"/>
            <path class="build-block build-block-4" d="M50 187l4 4l7-8"/>
            <line x1="72" y1="187" x2="180" y2="187"/>
            <g class="audit-glass">
              <circle cx="0" cy="0" r="18"/>
              <line x1="13" y1="13" x2="24" y2="24"/>
            </g>
            <path class="audit-spark audit-spark-1" d="M195 50l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8z" fill="currentColor" stroke="none"/>
            <path class="audit-spark audit-spark-2" d="M195 94l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8z" fill="currentColor" stroke="none"/>
            <path class="audit-spark audit-spark-3" d="M195 138l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8z" fill="currentColor" stroke="none"/>
            <path class="audit-spark audit-spark-4" d="M195 182l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8z" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <div class="process-content">
          <h3>The audit</h3>
          <p>A real look at what's working and where there's room to grow.</p>
        </div>
      </div>
      <div class="process-step">
        <div class="process-image process-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <path class="plan-path" d="M50 190 C 90 190, 90 130, 140 120 S 210 70, 260 50" stroke-dasharray="6 8" fill="none" pathLength="100"/>
            <circle class="build-block build-block-1" cx="50" cy="190" r="7"/>
            <circle class="build-block build-block-2" cx="150" cy="118" r="7"/>
            <circle class="build-block build-block-3" cx="260" cy="50" r="7"/>
            <g class="plan-marker">
              <circle cx="0" cy="0" r="10"/>
              <circle cx="0" cy="0" r="3" fill="currentColor" stroke="none"/>
            </g>
            <g class="plan-flag" transform="translate(260,50)">
              <line x1="0" y1="0" x2="0" y2="-20" stroke-width="2"/>
              <path d="M0-20l14 5-14 5z" fill="currentColor" stroke="none"/>
            </g>
          </svg>
        </div>
        <div class="process-content">
          <h3>The plan</h3>
          <p>A prioritized roadmap built around what actually helps.</p>
        </div>
      </div>
      <div class="process-step">
        <div class="process-image process-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <rect x="30" y="20" width="180" height="200" rx="10"/>
            <rect class="build-block build-block-1" x="48" y="44" width="14" height="14" rx="3"/>
            <path class="build-block build-block-1" d="M50 51l4 4l7-8"/>
            <line x1="72" y1="51" x2="184" y2="51"/>
            <rect class="build-block build-block-2" x="48" y="80" width="14" height="14" rx="3"/>
            <path class="build-block build-block-2" d="M50 87l4 4l7-8"/>
            <line x1="72" y1="87" x2="170" y2="87"/>
            <rect class="build-block build-block-3" x="48" y="116" width="14" height="14" rx="3"/>
            <path class="build-block build-block-3" d="M50 123l4 4l7-8"/>
            <line x1="72" y1="123" x2="180" y2="123"/>
            <rect x="48" y="164" width="140" height="10" rx="5"/>
            <rect class="report-progress" x="48" y="164" width="140" height="10" rx="5" fill="currentColor" stroke="none"/>
            <g transform="translate(230,120)">
              <rect class="build-block build-block-4" x="0" y="20" width="14" height="40" rx="2"/>
              <rect class="build-block build-block-4" x="20" y="0" width="14" height="60" rx="2"/>
            </g>
            <path class="report-plane" d="M0 0l22-8-8 8 8 8z" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <div class="process-content">
          <h3>Execution &amp; reporting</h3>
          <p>Work gets done, and you get plain-language updates.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section container">
    <p class="eyebrow">Sound familiar?</p>
    <h2 class="section-title">Problems I hear every day</h2>
    <div class="problem-grid">
      <div class="problem-card">
        <span class="problem-x" aria-hidden="true">✕</span>
        <p>You have a website, but it's not bringing in the leads it should.</p>
      </div>
      <div class="problem-card">
        <span class="problem-x" aria-hidden="true">✕</span>
        <p>You're running Google Ads, but you're not sure they're actually paying off.</p>
      </div>
      <div class="problem-card">
        <span class="problem-x" aria-hidden="true">✕</span>
        <p>You're doing "SEO," but you don't know what's actually happening behind it.</p>
      </div>
      <div class="problem-card">
        <span class="problem-x" aria-hidden="true">✕</span>
        <p>Your site says what you do, but visitors leave without taking action.</p>
      </div>
    </div>
    <div class="problem-banner">
      <p>None of this means something's wrong with your business — it means the system needs a second look.</p>
      <a class="btn problem-banner-btn" href="services.html">See how →</a>
    </div>
  </section>

  <section class="section container">
    <p class="eyebrow">What I offer</p>
    <h2 class="section-title">Services</h2>
  </section>

  <section class="service-block">
    <div class="container">
      <div class="service-block-grid">
        <div class="service-block-text service-block-textbox">
          <p class="eyebrow"><a href="service-website.html">Website Optimization &amp; Creation</a></p>
          <h2>Build your dream site</h2>
          <p>Full rebuilds for businesses that need one, fixes for the ones that don't. Speed, clarity, and a path that actually leads somewhere.</p>
          <p><a class="btn" href="service-website.html">Learn more →</a></p>
        </div>
        <div class="service-block-image service-block-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <rect x="16" y="16" width="220" height="170" rx="10"/>
            <line x1="16" y1="44" x2="236" y2="44"/>
            <circle cx="28" cy="30" r="2.5" fill="currentColor" stroke="none"/>
            <circle cx="37" cy="30" r="2.5" fill="currentColor" stroke="none"/>
            <circle cx="46" cy="30" r="2.5" fill="currentColor" stroke="none"/>
            <rect class="build-block build-block-1" x="28" y="56" width="196" height="16" rx="3"/>
            <rect class="build-block build-block-2" x="28" y="82" width="92" height="56" rx="4"/>
            <rect class="build-block build-block-3" x="132" y="82" width="92" height="56" rx="4"/>
            <line class="build-block build-block-4" x1="28" y1="150" x2="120" y2="150"/>
            <line class="build-block build-block-4" x1="28" y1="158" x2="90" y2="158"/>
            <rect x="238" y="86" width="66" height="128" rx="12"/>
            <rect class="build-block build-block-2" x="246" y="98" width="50" height="34" rx="3"/>
            <line class="build-block build-block-4" x1="246" y1="142" x2="296" y2="142"/>
            <line class="build-block build-block-4" x1="246" y1="150" x2="280" y2="150"/>
            <path class="build-cursor" d="M0 0l16 5.5-7 2.5-2.5 7z" fill="currentColor" stroke="none"/>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <section class="service-block service-block--shade">
    <div class="container">
      <div class="service-block-grid">
        <div class="service-block-text service-block-textbox">
          <p class="eyebrow"><a href="service-seo.html">SEO + AEO/GEO</a></p>
          <h2>Build your reach</h2>
          <p>Traditional search optimization plus the newer game — showing up inside AI answers, not just search results. Most sites are only built for one of them.</p>
          <p><a class="btn" href="service-seo.html">Learn more →</a></p>
        </div>
        <div class="service-block-image service-block-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <rect x="16" y="16" width="212" height="170" rx="10"/>
            <rect x="28" y="30" width="188" height="22" rx="11"/>
            <circle cx="40" cy="41" r="5"/>
            <line x1="44" y1="45" x2="48" y2="49"/>
            <line class="build-block build-block-1" x1="28" y1="76" x2="140" y2="76"/>
            <line class="build-block build-block-1" x1="28" y1="84" x2="96" y2="84" stroke-width="1"/>
            <line class="build-block build-block-2" x1="28" y1="108" x2="160" y2="108"/>
            <line class="build-block build-block-2" x1="28" y1="116" x2="110" y2="116" stroke-width="1"/>
            <line class="build-block build-block-3" x1="28" y1="140" x2="150" y2="140"/>
            <line class="build-block build-block-3" x1="28" y1="148" x2="100" y2="148" stroke-width="1"/>
            <g class="seo-rank">
              <circle cx="0" cy="0" r="9"/>
              <path d="M0 4v-8M-4 0l4-4l4 4"/>
            </g>
            <rect x="234" y="96" width="70" height="86" rx="10"/>
            <line class="build-block build-block-4" x1="244" y1="112" x2="294" y2="112"/>
            <line class="build-block build-block-4" x1="244" y1="120" x2="280" y2="120"/>
            <line class="build-block build-block-4" x1="244" y1="128" x2="290" y2="128"/>
            <g class="seo-check">
              <circle cx="269" cy="158" r="12"/>
              <path d="M263 158l4 4l8-9"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <section class="service-block">
    <div class="container">
      <div class="service-block-grid">
        <div class="service-block-text service-block-textbox">
          <p class="eyebrow"><a href="service-ads.html">Google Ads</a></p>
          <h2>Build your momentum</h2>
          <p>Campaigns built and managed to convert, not just to run. Fixed if they're already bleeding budget, built right if they're not.</p>
          <p><a class="btn" href="service-ads.html">Learn more →</a></p>
        </div>
        <div class="service-block-image service-block-image--build" aria-hidden="true">
          <svg class="build-scene" viewBox="0 0 320 240">
            <rect x="16" y="16" width="288" height="86" rx="8"/>
            <rect x="28" y="28" width="26" height="14" rx="3"/>
            <line class="build-block build-block-1" x1="62" y1="35" x2="230" y2="35"/>
            <line class="build-block build-block-1" x1="28" y1="52" x2="130" y2="52" stroke-width="1"/>
            <line class="build-block build-block-2" x1="28" y1="66" x2="270" y2="66" stroke-width="1"/>
            <line class="build-block build-block-2" x1="28" y1="76" x2="230" y2="76" stroke-width="1"/>
            <path class="ads-cursor" d="M0 0l16 5.5-7 2.5-2.5 7z" fill="currentColor" stroke="none"/>
            <g transform="translate(28,204)">
              <rect class="ads-bar ads-bar-1" x="0" y="-24" width="24" height="24" rx="2"/>
              <rect class="ads-bar ads-bar-2" x="34" y="-38" width="24" height="38" rx="2"/>
              <rect class="ads-bar ads-bar-3" x="68" y="-30" width="24" height="30" rx="2"/>
              <rect class="ads-bar ads-bar-4" x="102" y="-54" width="24" height="54" rx="2"/>
              <rect class="ads-bar ads-bar-5" x="136" y="-72" width="24" height="72" rx="2"/>
            </g>
            <polyline class="ads-trend" points="28,180 62,166 96,174 130,150 164,132" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <section class="section container">
    <div class="cta-banner">
      <div class="cta-banner-text">
        <h2 class="cta-banner-title">Ready to find out what's possible?</h2>
        <p>Send a quick message and I'll get back to you within 24 hours.</p>
      </div>
      <a class="btn cta-banner-btn" href="contact.html">Get in touch →</a>
    </div>
  </section>

  <section class="footer-links">
    <div class="container">
      <div class="footer-links-grid">
        <div class="footer-brand">
          <span class="footer-brand-name">Ollin</span>
        </div>
        <div class="footer-links-col">
          <h3>Explore</h3>
          <ul class="quick-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="about-founder.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-links-col">
          <h3>Get in touch</h3>
          <ul class="quick-links">
            <li><a href="mailto:axel.barrettorodriguez@gmail.com">Email</a></li>
            <li><a href="contact.html">Book an audit call</a></li>
          </ul>
        </div>
      </div>
    </div>
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

### `services.html`

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
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html" aria-current="page">Services</a>
      <ul class="dropdown">
        <li><a href="services.html" aria-current="page">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
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

### `service-website.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Website Optimization &amp; Creation — Ollin</title>
<meta name="description" content="Full site rebuilds and targeted fixes — speed, clarity, and a path that actually leads somewhere. Website work from Ollin.">
<meta property="og:title" content="Website Optimization & Creation — Ollin">
<meta property="og:description" content="Full site rebuilds and targeted fixes — speed, clarity, and a path that actually leads somewhere.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html" aria-current="page">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html" aria-current="page">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">Website Optimization &amp; Creation</p>
    <h1 class="reveal reveal-2">Build your dream site</h1>
    <p class="reveal reveal-3">Full rebuilds for businesses that need one, fixes for the ones that don't. Speed, clarity, and a path that actually leads somewhere.</p>
    <p class="reveal reveal-3"><a class="btn" href="contact.html">Ask about this</a></p>
  </section>

  <section class="section container">
    <h2>What's included</h2>
    <div class="card-grid">
      <div class="card">
        <h3>Full rebuilds</h3>
        <p>A new site built around what your business actually needs, not a generic template.</p>
      </div>
      <div class="card">
        <h3>Speed &amp; performance</h3>
        <p>Faster load times, cleaner code, and pages that don't lose visitors before they even load.</p>
      </div>
      <div class="card">
        <h3>Conversion paths</h3>
        <p>Clear calls to action so visitors know exactly what to do next — and actually do it.</p>
      </div>
      <div class="card">
        <h3>Mobile experience</h3>
        <p>Built to work properly on the device most of your visitors are actually using.</p>
      </div>
    </div>
  </section>

  <section class="section container">
    <h2>Who this is for</h2>
    <p>Businesses whose site is missing entirely, embarrassingly outdated, slow enough to lose visitors, or just not converting the traffic it already gets.</p>
  </section>

  <section class="section container">
    <h2>Ready to talk about your site?</h2>
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

### `service-seo.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SEO + AEO/GEO — Ollin</title>
<meta name="description" content="Traditional SEO plus AI answer-engine visibility. Show up in search and inside AI-generated answers. From Ollin.">
<meta property="og:title" content="SEO + AEO/GEO — Ollin">
<meta property="og:description" content="Traditional SEO plus AI answer-engine visibility.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html" aria-current="page">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html" aria-current="page">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">SEO + AEO/GEO</p>
    <h1 class="reveal reveal-2">Build your reach</h1>
    <p class="reveal reveal-3">Traditional search optimization plus the newer game — showing up inside AI answers, not just search results. Most sites are only built for one of them.</p>
    <p class="reveal reveal-3"><a class="btn" href="contact.html">Ask about this</a></p>
  </section>

  <section class="section container">
    <h2>What's included</h2>
    <div class="card-grid">
      <div class="card">
        <h3>Technical SEO</h3>
        <p>The unglamorous foundation — site speed, structure, and crawlability that search engines actually reward.</p>
      </div>
      <div class="card">
        <h3>Content &amp; keywords</h3>
        <p>Ranking for what your customers are actually searching, not just what sounds good internally.</p>
      </div>
      <div class="card">
        <h3>AEO/GEO</h3>
        <p>Positioning for AI answer engines — ChatGPT, Gemini, AI Overviews — where discovery is increasingly happening.</p>
      </div>
      <div class="card">
        <h3>Authority building</h3>
        <p>The signals that tell both Google and AI systems your business is a credible source.</p>
      </div>
    </div>
  </section>

  <section class="section container">
    <h2>Who this is for</h2>
    <p>Businesses stuck on page two, invisible in AI-generated answers, or watching organic traffic plateau with no clear reason why.</p>
  </section>

  <section class="section container">
    <h2>Ready to find out where you stand?</h2>
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

### `service-ads.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Google Ads — Ollin</title>
<meta name="description" content="Campaigns built and managed to convert, not just to run. Google Ads management from Ollin.">
<meta property="og:title" content="Google Ads — Ollin">
<meta property="og:description" content="Campaigns built and managed to convert, not just to run.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html" aria-current="page">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html" aria-current="page">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">Google Ads</p>
    <h1 class="reveal reveal-2">Build your momentum</h1>
    <p class="reveal reveal-3">Campaigns built and managed to convert, not just to run. Fixed if they're already bleeding budget, built right if they're not.</p>
    <p class="reveal reveal-3"><a class="btn" href="contact.html">Ask about this</a></p>
  </section>

  <section class="section container">
    <h2>What's included</h2>
    <div class="card-grid">
      <div class="card">
        <h3>Campaign setup</h3>
        <p>Keyword and audience targeting built around who actually buys, not just who clicks.</p>
      </div>
      <div class="card">
        <h3>Ad copy that converts</h3>
        <p>Written to earn the click and the conversion, not just the impression.</p>
      </div>
      <div class="card">
        <h3>Conversion tracking</h3>
        <p>So you know exactly what's working — and what's quietly burning budget.</p>
      </div>
      <div class="card">
        <h3>Ongoing optimization</h3>
        <p>Regular tuning based on real performance data, not a set-it-and-forget-it account.</p>
      </div>
    </div>
  </section>

  <section class="section container">
    <h2>Who this is for</h2>
    <p>Businesses without ads running yet, accounts already bleeding budget, or anyone running campaigns without a clear read on what's actually working.</p>
  </section>

  <section class="section container">
    <h2>Ready to see what's possible?</h2>
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

### `about-founder.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About the Founder — Ollin</title>
<meta name="description" content="Axel Barretto — UNH Digital Marketing grad, currently at SC Digital, running Ollin as an independent practice.">
<meta property="og:title" content="About the Founder — Ollin">
<meta property="og:description" content="UNH Digital Marketing grad, currently at SC Digital, running Ollin as an independent practice.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html" aria-current="page">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html" aria-current="page">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
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

### `about-ollin.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About Ollin — The Name &amp; the Idea</title>
<meta name="description" content="Ollin is Nahuatl for movement. Here's why that's the name — and what it has to do with digital marketing.">
<meta property="og:title" content="About Ollin — The Name & the Idea">
<meta property="og:description" content="Ollin is Nahuatl for movement. Here's why that's the name.">
<meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html" aria-current="page">About Ollin</a></li>
      </ul>
    </li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <section class="hero container">
    <p class="eyebrow reveal reveal-1">The name</p>
    <h1 class="reveal reveal-2">About Ollin</h1>
    <p class="reveal reveal-3">Ollin (pronounced "oh-yin") is Nahuatl — the language of the Aztec and Nahua peoples — for movement.</p>
  </section>

  <section class="section container">
    <h2>Where it comes from</h2>
    <p>My middle name is Tonatiuh — the Aztec sun deity, tied to movement, cycles, and renewal. When it came time to name this, I didn't want a generic agency name. I wanted something that actually meant something to me, and Ollin fit on more than one level: it's a real word from that same heritage, and it happens to sound like "all in" — which is exactly the level of commitment I bring to a project.</p>
  </section>

  <section class="section container">
    <h2>Why movement</h2>
    <p>Marketing that isn't moving your business forward isn't doing its job — a website nobody finds, an ad account nobody's watching, rankings that have flatlined. Movement is the whole point: more visibility, more leads, more reach, moving from wherever you're stuck to somewhere better.</p>
  </section>

  <section class="section container">
    <h2>The look</h2>
    <p>The carved-stone, sun-warmed aesthetic across this site isn't decoration — it's the same tension as the name. Something built to last, and something built to move. Foundations that move forward.</p>
  </section>

  <section class="section container">
    <h2>Ready to find out what's possible?</h2>
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

### `contact.html`

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
  <a href="index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" fill="none" stroke-linecap="round"><g stroke-width="3.5"><line x1="32" y1="3" x2="32" y2="13"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(22.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(45 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(67.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(90 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(112.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(135 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(157.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(180 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(202.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(225 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(247.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(270 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(292.5 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(315 32 32)"/><line x1="32" y1="3" x2="32" y2="13" transform="rotate(337.5 32 32)"/></g><circle cx="32" cy="32" r="19" stroke-width="2.2"/><circle cx="32" cy="32" r="9" stroke-width="2.2"/><circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/><circle cx="32" cy="21.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="24" cy="38" r="1.4" fill="currentColor" stroke="none"/><circle cx="40" cy="38" r="1.4" fill="currentColor" stroke="none"/></g></svg>Ollin</a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">Menu</button>
  <ul id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li class="has-dropdown">
      <a href="services.html">Services</a>
      <ul class="dropdown">
        <li><a href="services.html">Overview</a></li>
        <li><a href="service-website.html">Website Optimization &amp; Creation</a></li>
        <li><a href="service-seo.html">SEO + AEO/GEO</a></li>
        <li><a href="service-ads.html">Google Ads</a></li>
      </ul>
    </li>
    <li class="has-dropdown">
      <a href="about-founder.html">About</a>
      <ul class="dropdown">
        <li><a href="about-founder.html">About the Founder</a></li>
        <li><a href="about-ollin.html">About Ollin</a></li>
      </ul>
    </li>
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

### `favicon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0c1a13"/>
  <text x="32" y="45" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-weight="700" fill="#c9a15a" text-anchor="middle">O</text>
</svg>
```

### `sitemap.xml`
*(Note: still lists old `about.html` and the `REPLACE_WITH_DOMAIN` placeholder — needs updating to the current page set and a real domain, see Next Steps.)*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://REPLACE_WITH_DOMAIN/index.html</loc></url>
  <url><loc>https://REPLACE_WITH_DOMAIN/services.html</loc></url>
  <url><loc>https://REPLACE_WITH_DOMAIN/about.html</loc></url>
  <url><loc>https://REPLACE_WITH_DOMAIN/contact.html</loc></url>
</urlset>
```

### `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://REPLACE_WITH_DOMAIN/sitemap.xml
```

---

## 3. Immediate Next Steps

- **Build the AI-guide chat widget** (bottom-right floating button, Ollin sunburst logo as the icon, scripted/rule-based branching questions to guide visitors — explicitly **not** a real LLM-backed bot, this constraint was already agreed with Axel). This was in progress when the previous session ended and is the top open build item.
- **Update `sitemap.xml`** to list the current page set (`services.html`, `service-website.html`, `service-seo.html`, `service-ads.html`, `about-founder.html`, `about-ollin.html`, `contact.html`) instead of the old `about.html` reference.
- **Cross-page visual re-verification**: the nav dropdown + About split markup was applied identically to every page, but only `index.html` was actually screenshot-tested after the fix. Worth a quick pass through `services.html`, the 3 service pages, `contact.html`, `about-founder.html`, and `about-ollin.html` to confirm the dropdown behaves correctly everywhere.
- **Formspree**: Axel needs to create a Formspree account and get a real form endpoint, then replace `FORM_ENDPOINT_HERE` in `contact.html`'s `<form action="...">`.
- **Calendly**: Axel needs to create/confirm a Calendly account and scheduling link, then replace both `CALENDLY_URL_HERE` occurrences in `contact.html` (the widget `data-url` and the fallback link).
- **Custom domain**: currently live only at the free `https://axelbarretto.github.io/Ollin-site/` URL. If Axel wants something more client-facing, this needs a domain purchase + DNS setup, and then `REPLACE_WITH_DOMAIN` needs updating in both `sitemap.xml` and `robots.txt`.
- **Established workflow to keep following**: build → verify changes in a real browser → `git add` (specific files, not `-A` blindly) → commit with a descriptive message → `git push origin master`. GitHub Pages auto-redeploys within ~1–2 minutes of every push. Remember: never run `git config` (Axel owns that), and there's no working `gh`/GitHub MCP connector — use plain `git` over HTTPS.

---

## 4. Status as of 2026-08-26 (autonomous cleanup pass)

**Note: most of section 3 above is now stale.** Since it was written (2026-08-03), a full separate session rebuilt all three service pages (POV section, named 5-item framework with custom icons, honest "good fit / not a fit" qualifier, FAQ accordion — deliberately no fabricated testimonials/proof), fixed the hero/nav-dropdown/How-It-Works issues, and the AI chat widget was explicitly **declined for now** ("no chatbot creation for now") — it is not planned work, despite still being listed as the "top open build item" above.

This entry documents an autonomous QA/cleanup pass run via `/goal` while Axel was at work, following `AUTONOMOUS_BUILD_BRIEF.md` in this same folder. BLOCKED / NEEDS AXEL first, then what was actually done:

**BLOCKED / NEEDS AXEL (unchanged, still correct from section 3):**
- Formspree: `FORM_ENDPOINT_HERE` placeholder in `contact.html` still needs a real account + endpoint.
- Calendly: `CALENDLY_URL_HERE` (two occurrences in `contact.html`) still needs a real account + link.
- Domain: `REPLACE_WITH_DOMAIN` in `sitemap.xml`/`robots.txt` still needs a real domain purchase.

**Completed this pass, verified live, committed and pushed:**
1. **`sitemap.xml` fixed** — was still listing the deleted `about.html` and missing 4 of the 8 real pages. Now lists all 8 (domain placeholder intentionally left as-is until Axel buys one).
2. **Cross-page consistency audit** — diffed nav, footer, and meta tags across all 8 HTML files. No drift found; everything already consistent.
3. **Full responsive pass** — checked all 8 pages at 375px/768px/1280px via `document.body.scrollWidth` vs `window.innerWidth` (plus visual spot-checks of `.framework-grid`/`.fit-grid` at the 768px breakpoint). Zero overflow or stacking bugs found anywhere.
4. **Accessibility pass** — found and fixed a real gap: FAQ `<details><summary>` elements weren't included in the shared `:focus-visible` rule in `styles.css`, so keyboard focus fell back to the browser default outline instead of the site's gold one. Fixed by adding `summary:focus-visible` to the existing rule. All decorative SVGs were already correctly `aria-hidden` (either directly or via an `aria-hidden` parent container).
5. **Console-errors pass** — checked all 8 live pages, zero console errors/warnings on any of them.
6. **Reduced-motion check** — every continuous/looping animation in `styles.css` is correctly gated behind `@media (prefers-reduced-motion: no-preference)` (or, for `.reveal`, has an explicit `reduce`-query override); the newer framework/fit/FAQ components added no unwrapped motion. No bugs found.

**Known environment quirk hit this session:** the local-file browser preview (`file:///.../freelance-site/...`) intermittently fails to resolve relative resources (styles.css renders as if unstyled, `link.href` resolves to a bare relative string instead of an absolute path) even in a brand-new tab — worse than the previously-documented stale-cache quirk, since cache-busting doesn't fix it. Workaround used successfully: verify against the live GitHub Pages URL instead (push first, wait ~1-2 min, verify live). Worth knowing if a future session sees "unstyled" local previews that a fresh tab doesn't fix.

No items were blocked by ambiguity or design judgment calls — everything in scope this pass was objectively fixable or already correct.
