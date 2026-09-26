# ANAND Group landing page: handoff

Read this first. It lets anyone (a person or a new Claude chat) pick up the ANAND Group landing-page design reference from where it stands. It covers the context, the rules, the design system, the language, how each section works, and the open items.

Last updated: 26 Sep 2026 · latest commit `61f27dc` on `main`.

---

## 1. What this is

- **Client:** ANAND Group (New Delhi auto-components group, founded 1961). Agency: **Kyte** (IA, design, SEO). Engineering partner: **GIDA** (Sanket), who handles engineering, hosting and QA.
- **This folder** is a **single-page design reference** for the new ANAND Group website. It is a static HTML page inspired by **stripe.com/in**: Stripe's layout, interactions and motion are copied closely, with ANAND's content, colours and logo.
- The real site will be rebuilt in **WordPress (block editor + ACF)** from this reference. The reference is the source of truth for the look. WordPress is the source of truth for how it gets built.
- **The working method:** Mahir reviews visually, one section at a time. A request is often "make this exactly like Stripe's X" (with a screenshot or URL), followed by small visual fixes. Match Stripe's exact mechanics (timings, easings, sizes), then apply the ANAND tokens.

## 2. Where things are

| What | Where |
|---|---|
| This page (the repo) | `Anand & Gabriel/Anand Moodboard/anand-landing/`: `index.html` + `assets/` |
| GitHub | `https://github.com/mahir-kyte/anand-group-landing` (**private**), branch `main` |
| Project rules | `Anand & Gabriel/CLAUDE.md` |
| Technical reference (WordPress) | `Anand & Gabriel/Claude Wordpress Context/ANAND_Website_Rebuild_Working_Notes.md`: rules in §2, landing page in §7, open items in §15, history in §17 |
| Client context and people | `Claude Wordpress Context/ANAND_Gabriel_Project_Context (1).md` |
| Call transcripts | `Claude Wordpress Context/ANAND_Gabriel_Call_Transcripts.md` |
| Nav spec | `Anand & Gabriel/Docs/ANAND_demo_top-nav.txt` |
| Site audit | `Anand & Gabriel/Audit/` |
| WordPress site (LocalWP, the only copy) | `/Users/mahirmalde/Local Sites/anand-group/app/public` → `http://anand-group.local` (theme `anand-theme`, plugin `anand-blocks`; its `wp-content` has its own `CLAUDE.md`) |
| Original Figma Stripe references | Figma file `rFZMc5AIzv9qN5hBhm4alh`, node `22-379` |

### Files in the repo
- `index.html` (~150 KB): all HTML, CSS (inline `<style>`) and JS (inline `<script>`). There is no build step.
- `assets/`
  - `oem/`: OEM logos, cropped tight (toyota, honda, bmw, marutisuzuki, tatamotors, mahindrarise, hyundai, volkswagen)
  - `companies/`: 17 group-company logos from anandgroupindia.com
  - `leader-*.jpg`: leadership headshots
  - `sujan-*.jpg` and `sujan-wordmark.svg`: SUJÁN photos and wordmark
  - news images, partner logos (`kyb.png`, `koni.png`, `Yamaha.png`), `global.png`, `global-partners.jpeg`, etc.
- `.gitignore`: `.DS_Store`, `.claude/`
- `.claude/launch.json` (git-ignored): the preview config

## 3. Run it locally

macOS blocks the preview tool from starting a server inside `Documents`, so start it from a terminal (or Claude's Bash, in the background):

```bash
cd "/Users/mahirmalde/Documents/Documents/Work/Kyte/Anand Group/Anand & Gabriel/Anand Moodboard/anand-landing" && python3 -m http.server 5178 --bind 127.0.0.1
```

Then open `http://localhost:5178`. The preview pane attaches with `.claude/launch.json`:
`{"version":"0.0.1","configurations":[{"name":"anand-landing","url":"http://localhost:5178","port":5178}]}`

**External libraries (CDN, no npm):**
- Google Fonts: **Geist** (weights 300–600). Geist Mono was dropped on purpose; don't reintroduce it.
- **Lucide** 1.48.0 UMD (icons; call `lucide.createIcons()` after injecting HTML)
- **cobe** 2.0.1 ESM (`https://cdn.jsdelivr.net/npm/cobe@2.0.1/dist/index.esm.js`), loaded in a `<script type="module">` for the globe

## 4. Git workflow
- **Only commit and push when Mahir asks** ("push to github"). The repo is private.
- The repo-level git user is `Mahir <mahir@kyte-agency.com>`.
- End each commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Write short, plain commit messages that say what changed visually (e.g. "Nav text at 15px to match site; white text on blue button hover").
- History: `21a1fdb` concept → `e050573` newsroom + bento → `b5839f6` globe, map, headshots, 1300px → `35e8911` SUJÁN card → `a7342bf` stories carousel, directory → `e83e772` polish → `ef509a1` mega menu → `61f27dc` nav type.

---

## 5. Rules to follow

### Project rules (from `CLAUDE.md`, mainly for the WordPress build)
1. WordPress + block editor + ACF. **No page builders.**
2. All design values are `theme.json` tokens, and blocks store token slugs. **No digit right after a letter in token slugs.**
3. Component-first: granular blocks → sections of nested blocks → pages. Prefer styled core blocks.
4. Custom blocks render in PHP. Sections are generated (`npm run patterns`), never hand-written.
5. Code goes **up** through git and content comes **down** from the shared server. **Never push a local database up.** Back up the DB and commit before big changes.
6. After changing a page outside the editor, reload the editor **without saving**. (A stale editor tab once overwrote the homepage.)
7. Keep the context files current: **update the relevant section** (don't append a chronological section) and **add a line to the History table**.
8. **Write for Mahir in plain language.** He is a designer, not a WordPress developer.
9. **Confirm before destructive or outward-facing actions** (deleting, pushing, publishing, messaging).

### Preferences Mahir has given in this project (keep applying them)
- **Copy Stripe precisely** when asked: the same interaction, timing, easing, layout proportions and modal. Don't reinterpret.
- **Clean, not "AI-looking".** Flat tiles, few or no shadows, no decorative glows unless asked, no gimmicks. Remove repetitive content: if a fact appears twice in a card, drop one.
- **No gradient text.** Ever.
- **One light blue only: `#00AEEF`** (the logo cyan). Every light-blue use, tint or accent derives from it.
- **Buttons: a blue (cyan) fill always has white text,** including hover states (e.g. the white button turns cyan on hover with white text).
- **Hover on tiles and cards is not brand blue.** Use a neutral tone for the card background; the text or title can turn blue.
- **4px corner radius on everything** (buttons, cards, images, modals). An earlier "sharp / 0 radius" direction was replaced by 4px.
- **All icons from one library (Lucide),** with the same stroke and size treatment.
- **Title Case for headings and titles.** Exception: news headlines stay exactly as published.
- **Content is real, never invented.** Source only from anandgroupindia.com (plus its partner map and annual figures) and thesujanlife.com. If something is an assumption, flag it in the code comment and in the handoff.
- **Consistent type sizes.** Nav text matches body UI text (15px). Don't let a component drift smaller than the rest of the site.
- **Content width is 1300px** across all sections.
- Break up sections with a slightly darker neutral background (`--soft`), not lines, where asked.

---

## 6. Design system

### Colour tokens (`:root` in `index.html`)
| Token | Hex | Use |
|---|---|---|
| `--navy` / `--ink` | `#021A2C` | Text, dark sections, the hero band, button hover |
| `--navy-2` | `#06294A` | The second dark tone |
| `--royal` | `#0B4EA2` | Deep blue accent (glows, the globe) |
| `--cyan` | `#00AEEF` | **Logo cyan**: primary buttons, links, eyebrows, the only light blue |
| `--green` | `#61A229` | Sustainability accents only |
| `--slate` | `#425466` | Body copy, lede |
| `--muted` | `#6B7C93` | Secondary text, captions |
| `--line` | `#E3E8EE` | Borders and dividers |
| `--soft` | `#F6F9FC` | Section-break background, the neutral hover background |
| `--white` | `#FFFFFF` | |

Cyan tints in use: `#E6F7FD` and `#B3E7FA`. Only use tints of `#00AEEF`.
`--grad` (cyan → royal) is for **shapes only, never text**. `--shadow-md` is `none` on purpose.

### Layout
- `--max: 1348px` = **1300px content** + 24px side padding (`.wrap`).
- Section padding: `.sec{padding:120px 0}`.
- `--radius: 4px` everywhere.
- Main breakpoints:
  - 1320px: the "Explore careers" nav button hides
  - 1020px: the nav collapses to the menu button
  - 940px: the bento and stories layouts change
  - 640px: phone

### Typography: Geist only (no Geist Mono)
**Every font size is a token in `:root`. Never write a raw px size.** The scale below replaced 33 ad-hoc sizes (audit, 26 Sep 2026).

| Token | Size | Used for |
|---|---|---|
| `--fs-display` | clamp(40px, 5.6vw, 64px) | h1 (hero) |
| `--fs-h2` | clamp(28px, 3.4vw, 38px) | Section headings, modal headings, CTA heading |
| `--fs-h3` | clamp(22px, 2.2vw, 28px) | Card titles (bento), newsroom headline, beyond-business cards, modal subheads |
| `--fs-quote` | clamp(22px, 2.4vw, 30px) | Pull quotes |
| `--fs-stat` | clamp(32px, 3.6vw, 44px) | Big counters (About facts, partner numbers) |
| `--fs-lede` | 18px | Intro paragraph under a section heading |
| `--fs-title` | 17px | Small card titles, featured-card titles, leader names |
| `--fs-body` | 16px | Paragraphs (body default) |
| `--fs-ui` | 15px | Buttons, nav, links, list items, card descriptions |
| `--fs-small` | 14px | Secondary text: descriptions under items, captions, footer |
| `--fs-ui-sm` | 13px | Section eyebrows; text inside product-style graphics (hero cards, bento graphics, map tooltip) |
| `--fs-num` | 24px | Big numbers inside graphics |
| `--fs-label` | 12px | Captions and all-caps labels |

Headings use weight 500 (not bold) with tight negative tracking, in the Stripe style.

**Label rules (one style each):**
- **Section eyebrow** (the small cyan text above a section heading): `.eyebrow`, `--fs-ui-sm` (13px), weight 500, cyan, **ALL CAPS**, letter-spacing .08em. Write it in sentence case in the HTML; CSS capitalises it.
- **In-card key label** (a label above a value, or a group heading inside a card or menu, e.g. HEADQUARTERS, PARTNERS AROUND THE WORLD, JOINT VENTURE PARTNERS): `--fs-label`, **ALL CAPS**, letter-spacing .08em, muted grey (cyan in the dark partners section).
- **Dates and map/globe tags:** Geist, all caps, .08em, `--fs-label` (globe labels 11px).
- **Captions** (e.g. "JV partners' global revenue, US$ Bn"): `--fs-label`, sentence case, muted.

### Buttons (`.btn`: 15px/500, padding 9px 16px 9px 18px, 4px radius)
| Class | Default | Hover |
|---|---|---|
| `.btn-primary` | cyan fill, white text | navy fill, white text |
| `.btn-light` (on dark) | white fill, navy text | **cyan fill, white text** |
| `.btn-outline2` (secondary) | white, `--line` border, cyan text | subtle |
| `.btn-ghost` | text-only, cyan | — |

Arrow chevrons (›) sit after the label on primary CTAs, e.g. "Partner with us ›".

### Motion
- The site's default easing is `--ease: cubic-bezier(.2,.7,.2,1)`.
- **Stripe card easing:** `cubic-bezier(.165,.84,.44,1)` over **800ms** for bento growth and carousel media zoom.
- **Stripe modal:** in `cubic-bezier(.22,1,.36,1)` over .8s, from translateY(200px); out over .3s to translateY(100px). Content fades up in a stagger (`.bd-reveal`).
- Mega menu hover intent: **80ms** open, **180ms** close.
- Newsroom autoplay: **7s**.
- Keep motion subtle. No bouncing and no parallax on this page.

### Icons
Use Lucide only (`<i data-lucide="name">`), with the same stroke everywhere. Don't mix in inline SVG icon sets. Custom SVG is fine for arrows or graphics built to Stripe's shapes.

---

## 7. Language and copy
- **Voice:** confident, factual and restrained, like an established industrial group and not a startup. Short sentences. No hype words or buzzword stacks.
- **Title Case** for headings, card titles and **all button and link labels** ("Partner with Us", "View All News", "Explore Our Companies"). Small words (a, an, the, and, or, for, of, on, in, to, at, by, with) stay lowercase unless they come first. Nav menu labels and menu item names stay sentence case, as in the nav spec (e.g. "A Global Mobility Group, Built on Six Decades of Partnership"). Keep "&" in names such as "Sustainability & CSR".
- **Brand spellings:** **ANAND** (capitals), **SUJÁN** (with the accent), Gabriel India, ANEVOLVE and Anevolve as on the source, HL Klemove, MAHLE ANAND, Joyson ANAND, and the partner names as on ANAND's partner map.
- **UK/Indian English** (programme, honours, enquiries). Currency is "US$2.2B+". Use "22,000+ people", "87 locations" and "17 companies".
- **Facts in use** (from anandgroupindia.com, CY 2024):
  - founded 1961 · HQ New Delhi · 87 locations · 17 companies · 22,000+ people · revenue US$2.2B+
  - an **8% RoS target**
  - top JV partners by revenue share: Forvia 29.5, Valeo 23.8, Henkel 23.3, MAHLE 13.9, Dana 10.3
- **When writing for Mahir** (chat replies, notes): plain language, short, with no WordPress or code jargon unless it's needed.

---

## 8. The page, section by section (top to bottom)

Every section's HTML starts with a `<!-- SECTION NAME -->` comment in `index.html`.

### 8.1 Nav: Stripe mega menu (`header.nav#nav`)
- **Structure:** from `Docs/ANAND_demo_top-nav.txt`.
  - Items: About ANAND ▾ · Vision & strategy (plain link) · Our companies ▾ · Sustainability & CSR ▾ · Careers ▾ · Newsroom ▾
  - Right side: "Explore careers" (outline) and "Partner with us ›" (primary)
- **Mechanics** (copied from Stripe):
  - a white card bar with one shared panel (`#navPop`) attached underneath
  - the panel content slides ±20% translateX depending on the direction you move
  - the panel height animates; the other labels dim
  - the page behind blurs (`#navOverlay`, `backdrop-filter: blur(6px)`)
  - hover intent of 80ms open and 180ms close
- **Each panel** is `.np#np-{key}` with `--cols:N`: `section.np-col` columns (h4 heading + list of title/description) + `aside.np-aside` (soft background, featured card) + `.np-foot` "See all" link.
- **Links are `#`.** Per the spec, links don't click through in the demo.
- **Not built yet:** the **mobile menu**. `.menu-btn` shows at ≤1020px but does nothing.

### 8.2 Hero (`section.hero`)
- Stripe-style slanted navy stripes band (`.stripes`) that runs below the hero into the newsroom so no white wedge shows.
- The hero bottom padding scales with the viewport (`calc(170px + max(0px,(100vw - 1348px)*.0792))`); on mobile it's 40px.
- Floating cards on the right.

### 8.3 Newsroom (`section#news.newsroom`, navy)
- Header "Newsroom / Latest at ANAND" and one white button, "View all news" (`#` for now).
- A **split panel**: image left, navy text panel right. (Text over images was hard to read, so it was split.)
- A thumbnail row below. The active thumb's top line is also the **7s autoplay progress bar**.
- Pauses on hover and focus. Swipe and arrow keys work.
- **Content comes from the JSON feed** `#cms-news` (see §9).

### 8.4 ANAND at a glance: Stripe bento (`section#glance.bento-sec`, soft background)
- h2: "A Global Mobility Group, Built on Six Decades of Partnership".
- Five `button.bento-card[data-bento]`. From 940px the grid is 3 columns: **global** spans 2, and the top row is a third shorter.
- **Card hover** (Stripe):
  - a clip-path "grow" of 6px vertically (4px on the large card), scaled horizontally by aspect ratio
  - a mouse-following radial-gradient border (`--mouse-x/y`)
  - the title and expand button shift, and the expand button fills cyan
  - 800ms `cubic-bezier(.165,.84,.44,1)`
- **Cards:**
  1. **global** (large):
     - a **cobe globe**: New Delhi HQ, 8 partner-country markers and arcs; CSS anchor-positioned labels (New Delhi, USA, France, Germany, Korea · Japan), hidden in browsers without `position-anchor`
     - a mini bento on the right: Headquarters New Delhi · Locations 87 · Partners around the world
     - cyan and royal glows (glows were requested here only)
  2. **revenue:** US$2.2B+, the 8% RoS target, and bars for the top 5 JV partners (CY 2024).
  3. **companies:** "17 Companies, One Unified Group". A repeating logo grid (duplicate logos are `aria-hidden`) with a bottom mask fade.
  4. **people:** "22,000+ People, Led with Purpose". A leadership card with headshots (Deep C. Anand, Anjali Singh, Mahendra K. Goyal). The photo starts at 210px with a short fade, so no head is covered.
  5. **sujan:** "Experiential Luxury, Rooted in Conservation". The leopard-on-rocks photo (`sujan-leopard-rocks.jpg`) with a navy fade at the top so the title can be white. A white panel at the bottom matches the other cards: the navy SUJÁN wordmark (`sujan-wordmark-navy.svg`) with a HOSPITALITY label, then the 3 camps, each with a thumbnail and its place. On hover only the photo zooms (1.036, 800ms); the camp thumbnails stay still. (This replaced a weak "ANAND Way" card.)
- **Modal** (Stripe `hds-dialog`):
  - Overlay `rgb(229 237 245/.8)` with blurred cyan and royal orbs.
  - Opens and closes with the modal motion in §6.
  - Esc, outside click and a close button work; focus is trapped; the page scroll locks (`html.bd-lock`).
  - Modal layout: header + checklist → 7:5 graphic → extras → quote → footer CTA.
  - **The global modal** has a **full-width interactive partner map**, a port of the shadcn WorldMap:
    - a pre-generated dotted map, run-length encoded (~4 KB) and drawn on canvas
    - SVG arcs with moving dots
    - markers placed with dotted-map `getPin` (x,y in a 198×100 viewBox)
    - hover, focus or tap a marker for a card with the logo, revenue and employees; on phones the card docks to the bottom of the screen
  - **The companies modal** has a directory of 17 equal-height tiles (`a.bd-co`: logo, name, products, link) with a **neutral hover** (soft background, blue text).
- **Placeholders:** the other card graphics are marked `[data-slot]` and are meant to be swapped for Mahir's final 3D components.

### 8.5 OEM logos (`section.logos`)
- A border above and below, and an infinite marquee (JS duplicates the track).
- The logos are cropped files in `assets/oem/`, with per-logo inline heights so the wordmarks look equal: toyota 50, honda 42, bmw 50, marutisuzuki 20, tatamotors 19, mahindrarise 28, hyundai 21, volkswagen 52.

### 8.6 About (`#about`)
The facts count up on scroll. The divider line above it was removed on request.

### 8.7 Stories: Stripe case-study carousel (`section#verticals.stories`, soft background)
- h2 on two lines: "One Group, Many Journeys / Across Mobility and Beyond" (nowrap on desktop), with an "Explore our companies" button and a lede.
- Arrows (`.st-btn`): white with a navy icon, navy on hover, faded when disabled.
- Six cards (332×448 media, a white logo over the image, media scale 1.036 on hover over 800ms): Gabriel, SUJÁN, ANEVOLVE, HL Klemove JV, MAHLE ANAND and Joyson ANAND, each with a real link.

### 8.8 CTA banner, above the footer (`section.cta-banner`)
- A copy of Stripe's Sessions banner:
  - a photo card 400–544px tall with a 4px radius
  - a light-weight (300) white headline at `--fs-banner` (48px max)
  - a white button with cyan text that turns cyan with white text on hover
  - the white ANAND logo in the bottom-right corner
- **Content:** "Join 22,000+ People Shaping the Future of Mobility" and "Explore Careers" (the link is `#` for now). The photo is `news1-scaled-1.jpeg` (Mahendra K. Goyal at an ANAND event), placed on the right and fading into navy on the left.
- **On phones** the photo drops to the lower part of the card so the headline doesn't cover the speaker.
- **Overlap to note:** the CTA section just above it also has a "Careers at ANAND" column.

### 8.9 After the stories
Solutions (6 product cards) · Partners (dark, wave canvas) · Beyond business (sustainability and CSR) · CTA/contact · CTA banner (§8.8) · Footer (HQ: 1, Sri Aurobindo Marg, Hauz Khas, New Delhi 110016 · +91-11-42092300).
These sections date from the first concept and haven't had a Stripe-exact pass yet.

---

## 9. CMS-style data (in `index.html`)
Content is kept in JSON blocks so it maps cleanly to WordPress or ACF later:
- `<script type="application/json" id="cms-news">`: 7 news items, each with `category, date, title, excerpt, image, imageAlt, source, url`. In WordPress this becomes the latest posts (news).
- `<script type="application/json" id="cms-bento">`: modal content keyed by `global | revenue | companies | people | sujan`:
  - heading, checklist, graphic, extras, quote and CTA
  - `global.map`: partner markers with coordinates, logo, revenue and employees
  - `companies`: the directory items (name, products, logo, url)

The JS renders the newsroom and the modals from these feeds. **To change content, edit the JSON, not the rendering code.**

---

## 10. Content sources and credits
- **ANAND:** anandgroupindia.com (company pages, leadership, partner map, news), logos and figures from the same site. The news images and headlines are ANAND's published stories.
- **SUJÁN:** thesujanlife.com (the photos, wordmark and camp names).
- **OEM logos:** the public brand marks, cropped.
- **Stripe:** only the layout and interaction patterns are copied. None of Stripe's content or assets are used.

## 11. Open items and things to confirm
| # | Item | Owner |
|---|---|---|
| 1 | **Mobile nav menu** isn't built (the `.menu-btn` does nothing) | Kyte |
| 2 | Real links for the nav items and "View all news" (all `#`) | after the IA is signed off |
| 3 | Company links for **APAG CoSyst, HL Klemove and Jinhap**; these currently fall back to ANAND's companies page | confirm with the client |
| 4 | **Deep C. Anand photo:** a 1951 B&W crop that wasn't captioned on the source; confirm it's him | client |
| 5 | **SUJÁN image usage rights** | client |
| 6 | Nav: Federal-Mogul ANAND Sealings, Federal-Mogul ANAND Bearings and Valeo Service India are left out; confirm. Also confirm Haldex ANAND India's description | client |
| 7 | Bento graphics for revenue, companies, people and sujan are placeholders; swap in Mahir's 3D components at `[data-slot]` | Mahir |
| 8 | Stripe-exact pass on Solutions, Partners, Beyond, CTA and Footer | Kyte |
| 9 | **The WordPress build hasn't caught up** (see §12) | Kyte + GIDA |

## 12. WordPress status (the gap)
The LocalWP site (`http://anand-group.local`) has the **older** homepage (the first concept: navbar, hero, stats, story cards and a news list). It still needs:
- the newsroom carousel (latest-posts feed)
- the bento plus modals (ACF-driven content)
- the stories carousel
- the mega menu
- the 4px radius token
- the 1300px content width

Follow the working notes (§2 rules, §7 landing page, §15 "Build next") and the project rules in §5 above. **Back up the DB and commit before starting.**

## 13. How to take on a new request (checklist)
1. Read this file and `CLAUDE.md`. Start the local server (§3) and look at the current state in the preview.
2. If the request references Stripe, open stripe.com/in and **measure the real values** (sizes, easing, timings, colours) before building. Then map them to the ANAND tokens.
3. Use only the tokens in §6 and follow the preferences in §5 (cyan only, white text on blue, neutral hovers, 4px, Title Case, no gradient text, no heavy shadows).
4. Use real content only. Flag any assumptions.
5. Check desktop (≥1300), tablet (~900) and phone (375) in the preview, and look for console errors.
6. Update this file and the working notes (the relevant section plus a History row) when something structural changes.
7. Commit and push **only when asked**.
