# ANAND Group landing page: handoff

Read this first. It lets anyone (a person or a new Claude chat) pick up the ANAND Group landing-page design reference from where it stands. It covers the context, the rules, the design system, the language, how each section works, and the open items.

Last updated: 26 Sep 2026, after a full consistency audit (content, type, colours). For the latest commit, run `git log -1`.

---

## 1. What this is

- **Client:** ANAND Group (New Delhi auto-components group, founded 1961).
- **Agency:** **Kyte** (IA, design, SEO).
- **Engineering partner:** **GIDA** (Sanket), who handles engineering, hosting and QA.
- **This folder** is a **single-page design reference** for the new ANAND Group website: a static HTML page modelled closely on **stripe.com/in** (layout, interactions and motion), with ANAND's content, colours and logo.
- **What happens next:** the real site will be rebuilt in **WordPress (block editor + ACF)** from this reference.
  - The reference is the source of truth for the **look**.
  - WordPress is the source of truth for **how it's built**.
- **Working method:** Mahir reviews visually, one section at a time.
  - Requests are usually "make this like Stripe's X" (with a screenshot or URL) or small visual fixes.
  - When copying Stripe, **measure the real values** on stripe.com (sizes, easing, timing, shadows), then apply the ANAND tokens.

## 2. Where things are

| What | Where |
|---|---|
| This page (the repo) | `Anand & Gabriel/Anand Moodboard/anand-landing/`: `index.html` + `assets/` |
| GitHub | `https://github.com/mahir-kyte/anand-group-landing` (**private**), branch `main` |
| Project rules | `Anand & Gabriel/CLAUDE.md` |
| WordPress technical reference | `Anand & Gabriel/Claude Wordpress Context/ANAND_Website_Rebuild_Working_Notes.md`: rules in §2, tokens in §5, landing page in §7, next steps in §15, history in §17 |
| Client context, people, open client questions | `Claude Wordpress Context/ANAND_Gabriel_Project_Context (1).md` |
| Call transcripts | `Claude Wordpress Context/ANAND_Gabriel_Call_Transcripts.md` |
| Nav / IA spec | `Anand & Gabriel/Docs/ANAND_demo_top-nav.txt` |
| Main content source | ANAND Group Corporate Presentation, Jan 2026: `anandgroupindia.com/wp-content/uploads/2026/06/ANAND-Group-Corporate-Presentation.pdf` |
| WordPress site (LocalWP, the only copy) | `/Users/mahirmalde/Local Sites/anand-group/app/public` → `http://anand-group.local` |
| Original Figma Stripe references | Figma file `rFZMc5AIzv9qN5hBhm4alh`, node `22-379` |

**Files in the repo**
- `index.html`: all HTML, CSS (inline `<style>`) and JS (inline `<script>`). No build step.
- `assets/`
  - `oem/`: cropped OEM logos
  - `companies/`: 17 group-company logos
  - `leader-*.jpg`: headshots
  - `sujan-*` photos, plus `sujan-wordmark.svg` (gold) and `sujan-wordmark-navy.svg`
  - partner logos, news and product images
- `.gitignore`: `.DS_Store`, `.claude/`. The file `.claude/launch.json` holds the preview config and is not committed.

## 3. Run it locally

macOS blocks the preview tool from starting a server inside `Documents`, so start it from a terminal (or Claude's Bash, in the background):

```bash
cd "/Users/mahirmalde/Documents/Documents/Work/Kyte/Anand Group/Anand & Gabriel/Anand Moodboard/anand-landing" && python3 -m http.server 5178 --bind 127.0.0.1
```

Open `http://localhost:5178`. The preview pane attaches with `.claude/launch.json`: `{"version":"0.0.1","configurations":[{"name":"anand-landing","url":"http://localhost:5178","port":5178}]}`

**External libraries** (from CDNs, no npm):
- Google Fonts **Geist** (300–600). Geist Mono was dropped on purpose.
- **Lucide** 1.48.0 UMD icons. Call `lucide.createIcons()` after injecting HTML.
- **cobe** 2.0.1 ESM, for the globe.
- Nothing else. Phosphor Icons was tried and removed.

## 4. Git workflow
- **Only commit and push when Mahir says "push to github".** The repo is private.
- The git user is `Mahir <mahir@kyte-agency.com>`. End commit messages with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Write short commit messages that say what changed visually.

---

## 5. Rules to follow

### Project rules (from `CLAUDE.md`; mainly for the WordPress build)
1. WordPress + block editor + ACF. **No page builders.**
2. All design values are `theme.json` tokens, and blocks store token slugs. **No digit right after a letter in token slugs.**
3. Build component-first: granular blocks → sections of nested blocks → pages. Prefer styled core blocks.
4. Custom blocks render in PHP. Sections are generated (`npm run patterns`), never hand-written.
5. Code goes **up** through git and content comes **down** from the shared server. **Never push a local database up.** Back up the database and commit before big changes.
6. After changing a page outside the editor, reload the editor **without saving**.
7. Keep the context files current: update the relevant section (don't append a chronological one) and add a History row.
8. **Write for Mahir in plain language.** He is a designer, not a WordPress developer.
9. **Confirm before destructive or outward-facing actions.**

### Mahir's design preferences (always apply)
- **Copy Stripe precisely** when asked: the same interaction, timing, easing, proportions and modal. Don't reinterpret.
- **Clean, not "AI-looking":**
  - flat tiles, few shadows, no decorative glows unless asked
  - remove repeated content
- **No gradient text, ever.** Gradients are for shapes only.
- **Blues:**
  - **One light blue: `#00AEEF`** (the logo cyan). All tints derive from it.
  - Where "blue tones only" is asked (e.g. the governance tiles), use **three**: royal, cyan and navy-2.
- **Anything with a blue fill has white text,** including on hover.
- **Card and tile hovers are not brand blue:** use a neutral background and let the text turn blue.
- **4px corner radius on everything.**
- **Icons come from one library: Lucide.** No custom-drawn icons and no second icon library. The only custom SVG is the ANAND logo mark in the CSR cards.
- **Title Case** for headings, card titles and button labels (§7).
- **All-caps eyebrows** above sections.
- **Content is real, never invented.** Sources are anandgroupindia.com, the Jan 2026 corporate presentation and thesujanlife.com. Flag anything unconfirmed in §11.
- **Consistency:** one type scale, one weight for emphasis (500), the same numbers everywhere (§7).
- **Content width 1300px.**
- **Section breaks:**
  - neutral `--soft` backgrounds, not lines
  - slanted cuts at **6°** with royal and cyan stripes (hero, Vision, the cut into the credibility section)

---

## 6. Design system (all tokens are in `:root` in `index.html`)

### Colours
| Token | Hex | Use |
|---|---|---|
| `--navy` / `--ink` | `#021A2C` | Text, dark sections, button hover |
| `--navy-2` | `#06294A` | Second dark tone (tiles, image placeholders) |
| `--royal` | `#0B4EA2` | Deep blue: stripes, tiles, accents |
| `--cyan` | `#00AEEF` | **Logo cyan**: buttons, links, eyebrows, numbers, icons |
| `--green` | `#61A229` | Sustainability only (CSR cards) |
| `--slate` | `#425466` | Body text |
| `--muted` | `#6B7C93` | Secondary text |
| `--line` | `#E3E8EE` | Borders, dividers |
| `--soft` | `#F6F9FC` | Neutral section background (newsroom, bento, stories, trust, CTA banner) |
| `--on-dark` | `#A9C1D6` | Body text on navy |
| `--on-dark-2` | `#88A3BB` | Secondary text on navy |
| `--tint` / `--tint-2` | `#E6F7FD` / `#B3E7FA` | Cyan tints (soft icon boxes, borders) |
| `--faint` | `#9AA8B8` | Placeholders, disabled |

The CSS rules use these tokens, not raw hex values. The only hardcoded colours left are:
- white and black (for masks)
- `#2a2a2a` behind product photos
- the form error red `#DF1B41`
- the CSR card fill/tint pairs (§8.10)

### Layout
- **Width:** `--max:1348px`, which is 1300px of content plus 24px padding on each side.
- **Section padding:** `.sec` 120px, 84px on phones.
- **Radius:** `--radius:4px`.
- **Breakpoints:**
  - 1320px: "Explore Careers" hides in the nav
  - 1200px: the nav collapses; several grids reflow
  - 1020px, 940px: layout steps
  - 640px: phone

### Typography: Geist only
**Every font size is a token. Never use raw px sizes.** An audit on 26 Sep confirmed every visible text element uses these.

| Token | Size | Used for |
|---|---|---|
| `--fs-display` | clamp(40,5.6vw,64) | Hero h1 |
| `--fs-h2` | clamp(28,3.4vw,38) | Every section heading, including the banner, trust and modals |
| `--fs-h3` | clamp(22,2.2vw,28) | Card titles (bento, CSR, products), newsroom headline, Vision stat numbers |
| `--fs-quote` | clamp(22,2.4vw,30) | Pull quotes |
| `--fs-stat` | clamp(32,3.6vw,44) | About facts |
| `--fs-lede` | 18 | Intro paragraphs |
| `--fs-title` | 17 | Small titles (feature row, leaders) |
| `--fs-body` | 16 | Paragraphs |
| `--fs-ui` | 15 | Buttons, nav, links, tile text |
| `--fs-small` | 14 | Secondary text, footer |
| `--fs-ui-sm` | 13 | Eyebrows; text inside product-style graphics |
| `--fs-num` | 24 | Numbers inside graphics |
| `--fs-label` | 12 | Captions and all-caps labels |

**Exceptions:**
- The trust section's **40%+** is `clamp(72px,9vw,128px)`, with "%+" the same size as the digits.
- Globe labels are 11px.

**Weights:**
- 400 for text and stats; **500 for all emphasis**.
- 300 only for pull quotes.
- **Never 600 or bold.**

**Labels:**
- Section eyebrow: `.eyebrow`, 13px, weight 500, cyan, **ALL CAPS**, letter-spacing .08em. Write it in sentence case in the HTML.
- In-card labels: 12px, ALL CAPS, .08em, muted.
- Captions: 12px, sentence case, muted.

### Buttons (`.btn`: 15px/500, 42px tall, 4px radius)
| Class | Default | Hover |
|---|---|---|
| `.btn-primary` | cyan fill, white text | navy fill |
| `.btn-light` (on dark backgrounds) | white fill, navy text | cyan fill, white text |
| `.btn-outline2` | white, `--line` border, cyan text | subtle |
| `.cb-btn` / `.cb-btn-2` (banner) | white with cyan text / white outline | cyan / white fill |

Primary CTAs end with a chevron (›). Every "Partner with Us" button opens the form (§8.12).

### Motion
- Default easing: `--ease: cubic-bezier(.2,.7,.2,1)`.
- **Stripe card easing:** `cubic-bezier(.165,.84,.44,1)`, 800ms (bento grow, media zoom 1.036).
- **Stripe modal:** in over 0.8s with `cubic-bezier(.22,1,.36,1)` from translateY(200px); out over 0.3s.
- **Mega menu:** 80ms open intent, 180ms close intent.
- **Newsroom autoplay:** 7s.
- **CSR cards:** 8px hover lift. The ANAND mark slides in when the card scrolls into view.
- **Sections:** fade up on scroll (`.rv` → `.in`).

### Icons
Lucide only (`<i data-lucide>`), with the same stroke everywhere. The four trust feature icons are 40px cyan at stroke 1.5.

---

## 7. Language, copy and facts
- **Voice:** confident, factual, restrained. Short sentences, no hype.
- **Title Case:**
  - Applies to headings, card titles and all button and link labels, e.g. "Partner with Us", "View All News", "Read the Story".
  - Small words (a, an, the, and, or, for, of, on, in, to, at, by, with) stay lowercase unless they come first.
  - Units stay lowercase ("sq km", "mn").
- **Sentence case** for nav menu labels, menu items and footer link lists, matching the nav spec.
- **UK/Indian English:** programme, honours, enquiries, lakh.
- **Brand spellings:** ANAND, SUJÁN, Gabriel India, ANEVOLVE, HL Klemove, MAHLE ANAND, Joyson ANAND.
- **Numbers used everywhere (must match):**

| Fact | Value | Source |
|---|---|---|
| Founded | 1961 | site |
| Companies | **17** | anandgroupindia.com. The Jan 2026 presentation says 23; see §11. |
| People | 22,000+ | site, presentation |
| Locations | 87, across 14 Indian states | site, presentation |
| Revenue | **US$2.2B+**. Always write "US$", never "$". | presentation |
| JV partners / technical collaborations | 11 / 4 | presentation partner list |
| Targets | top 3 in each segment · 8% return on sales · 2% of sales on R&D | presentation, site |
| Gabriel aftermarket share | >40%, No. 1 in India (FY 2025) | presentation |
| JV partners' revenue (CY 2024) | Forvia 29.5, Valeo 23.8, Henkel 23.3, MAHLE 13.9, Dana 10.3 (US$ Bn) | partner map |

---

## 8. The page, section by section (in page order)

Each section's HTML starts with a `<!-- NAME -->` comment in `index.html`.

### 8.1 Nav: Stripe mega menu (`header.nav#nav`)
- **Items** (from `Docs/ANAND_demo_top-nav.txt`): About ANAND ▾ · Vision & strategy · Our companies ▾ · Sustainability & CSR ▾ · Careers ▾ · Newsroom ▾, plus "Explore Careers" (outline) and "Partner with Us ›".
- **Mechanics** (copied from Stripe):
  - a white bar with one shared panel underneath
  - the panel slides ±20% depending on direction, and its height animates
  - other labels dim and the page behind blurs
  - hover intent 80/180ms; Esc and click-outside close; Arrow Down opens from the keyboard
- **Widths:**
  - the nav needs about 1200px
  - at ≤1320px "Explore Careers" hides
  - below 1200px it collapses to the menu button
- The logo never shrinks (`.nav-logo{flex:none}`).
- **Not built:** the mobile menu. The button does nothing yet.

### 8.2 Hero (`section.hero`)
- **Left:**
  - eyebrow "SINCE 1961"
  - h1 "Engineering the Future of Mobility"
  - plain lede
  - one button, "Explore Solutions"
- **Right:** a product mockup with real logos and figures:
  - **Main card:** the ANAND logo sidebar with the Portfolio list, and the Gabriel "25.4 Dia Rear Suspension" photo with an "In production" tag.
  - **Revenue card:** US$2.2B+ · 17 companies · 22,000+ people · 87 locations.
  - **JV card:** Gabriel × HL Klemove.
- **Background:** slanted navy stripes run into the newsroom.

### 8.3 Newsroom (`section#news`, navy)
- A split panel: image left, navy text right.
- A thumbnail row whose active line is the 7s autoplay bar.
- "View All News".
- Content comes from the `#cms-news` feed (7 real stories).

### 8.4 ANAND at a glance: Stripe bento (`section#glance`, soft)
- **Cards** (five in total):
  - Global footprint: a cobe globe plus a mini bento
  - US$2.2B+ revenue: the ANAND logo and three figures (US$2.2B+, 8% return-on-sales target, 11 global JV partners), then JV-partner bars with dividers
  - 17 Companies: logo grid
  - 22,000+ People: headshots
  - SUJÁN: leopard photo with a white panel showing the navy wordmark and the 3 camps with thumbnails
- **Hover** (Stripe's): clip-path grow, a pointer-following border, and the expand button turns cyan.
- **Modals:**
  - built from the `#cms-bento` feed; the checklist items have dividers
  - the global modal has the interactive partner map
  - the companies modal has a directory of 17 companies
- The four other card graphics are placeholders (`[data-slot]`) for Mahir's 3D components.

### 8.5 OEM logos (`section.logos`)
- Eyebrow "TRUSTED BY THE WORLD'S LEADING OEMS".
- A marquee of cropped logos with per-logo heights.

### 8.6 About (`#about`)
- **Facts:** 1961 · **17** companies · 22,000+ · 87 · **US$2.2B+**. They count up on scroll.
- **Fact style:** a cyan tick on a grey line.

### 8.7 Stories: Stripe case-study carousel (`section#verticals`, soft)
- Six stories with real links.
- **Cards:** 332×448 media with a white logo; the image zooms 1.036 on hover.
- **Arrows:** white with a navy icon.

### 8.8 Products & solutions (`section#solutions`)
- **Structure:** Stripe's ProductFeatureCard (from stripe.com/industries/retail).
- **Header:** the intro text on the left and an "Explore All Products ›" button on the right.
- **Grid:** 3 columns with a 20px gap (16px at 2 columns).
- **Each card:**
  - white, with Stripe's shadow
  - a 3:2 photo inset 4px with a grey-blue bottom fade
  - a badge with a Lucide icon
  - a title in `--fs-h3`, a paragraph naming the real companies and products, and "Explore … ›"
- **Areas:** Chassis, Emission control, Powertrain, Safety, Thermal management, E-mobility.

### 8.9 Vision & Strategy (`section.dark#vision`)
- **Structure:** Stripe's "Why Stripe" stat row, on dark navy.
- **Top:** 6° slanted stripes, with 300px of top padding.
- **Text:**
  - eyebrow "VISION & STRATEGY"
  - h2 "Creating Value Sustainably, Through Excellence and Good Governance"
  - wide lede
- **4 stats:** each has a cyan tick, a cyan number (`--fs-h3`), and a 16px description with cyan key terms.
  - Top 3
  - 8%
  - 2%
  - 600 suppliers (VSME)

### 8.10 Sustainability & CSR (`section#beyond`)
- **Structure:** stripe.com/guides.
- **Left:** an intro with "Explore Sustainability & CSR ›".
- **Right: 6 guide cards in staggered columns**, 2 per column.
  - The columns start at 360, 240 and 120px, a 120px step.
  - Card format: 254:356, category in 12px caps, title in `--fs-h3`, and "Read more ›" on hover.
  - **Art:** one large **filled ANAND double chevron** (the logo mark) in a lighter tint of the card colour at 55% opacity. It's cropped by the card edge and slides in on scroll.
  - Hover: an 8px lift and a bigger shadow.
- **Colours** (card fill / mark tint):
  - green `#61A229` / `#9CCB6E`
  - dark green `#3F7A1C` / `#7AAA55`
  - royal `#0B4EA2` / `#5584C4`
  - cyan `#00AEEF` / `#66CEF5`
  - navy-2 `#06294A` / `#3D5A78`
- **Cards** (SNS Foundation figures from the Jan 2026 presentation):
  - 100 sq km protected
  - 1,000+ self-help groups / 170 mn micro-credit
  - 3.78 lakh students
  - 27 lakh people (health)
  - solar, wind and Miyawaki forests
  - 45,000+ trained, 80% women
- **Bottom of the cards: a 6° diagonal cut.**
  - The next section's `.tr-cut` is a soft-grey block with `skewY(-6deg)` and royal and cyan stripes on its edge.
  - `#trust` is pulled up 125px, so the cut crosses the lower card of every column through the art only.
  - Tablets and phones use a flatter cut and thinner stripes.

### 8.11 Scale, governance & credibility (`section#trust`, soft)
- **Structure:** stripe.com/payments.
- **Top gap:** 120px below the cut.
- **Built for Scale:**
  - a paragraph
  - a **white bordered panel** with the cyan **40%+**: Gabriel India's aftermarket share, No. 1 brand (FY 2025)
- **Governance at the Core:** a paragraph and six tiles.
  - Colours: **three blues only**, royal / cyan / navy-2, two tiles each, with no neighbours matching.
  - Each tile has a white Lucide icon and 15px/500 text.
  - Topics: Supervisory Board; Ethics Committee and Integrity Matters hotline; 360° feedback; ANAND House of Quality (200+ Six Sigma belts); UN SDG CSR since 1976; India's Best Workplaces for Women 2019.
- **Feature row:** 4 columns, 112px below the top block, each with a 40px cyan Lucide icon and a titled line.
  - Close to Every Auto Hub
  - Trusted by Leading OEMs
  - Engineering Depth
  - Recognised for Excellence
- **Bottom padding:** 160px (96px on phones) before the banner.

### 8.12 CTA banner and contact (`section.cta-banner#contact`, soft background)
- **Structure:** Stripe's Sessions banner. Anchors `#contact` and `#careers` both land here.
- **Card:** a navy photo card (Mahendra K. Goyal at an ANAND event).
- **Layout:**
  - **top left:** eyebrow, h2 "Ready to Shape the Future of Mobility?" and lede
  - **top right:** the white ANAND logo over a dark corner fade
  - **bottom left:** "Partner with Us" and "Explore Careers"
  - **bottom right:** the headquarters address, phone and email, right-aligned over a strong bottom fade
- **Phones:** logo → text → buttons → address, with the photo at the bottom.
- **Partner with Us form:**
  - Opened by every "Partner with Us" (`data-partner` or the label), in the bento modal shell over a plain 60% navy overlay.
  - Layout: a single 760px step that fits one screen. Fields: Name / Email · Mobile (code) / Country · Company / Products · Description, all mandatory.
  - Inline validation, then "Thank You, {first name}".
  - **Nothing is sent** (design reference).

### 8.13 Footer
- **Coverage:** every item in the nav spec.
- **Top band:** brand (logo, headquarters, "Partner with Us"), then About ANAND, Sustainability & CSR, Careers and Newsroom, with the spec's column names as caps sub-labels.
- **Our companies band:** all 21 companies, grouped by product area, plus Beyond automotive.
- **Bottom bar:** the © line and legal and social links.
- Links are `#`.

---

## 9. CMS-style data
- **`#cms-news`:** 7 news items (category, date, title, excerpt, image, imageAlt, source, url). Becomes the News posts.
- **`#cms-bento`:** modal content for each card (title, body, CTAs, checklist, graphics, extras, quote, footer).
  - `global.map` holds the partner markers.
  - `companies` holds the directory.
- **Edit the JSON, not the rendering JS.**

## 10. Sources
- **ANAND:**
  - anandgroupindia.com: companies, leadership, partner map, news, awards article, contact form fields
  - **ANAND Group Corporate Presentation, Jan 2026**: vision, targets, product portfolio, SNS Foundation, governance, HR programmes
- **SUJÁN:** thesujanlife.com.
- **OEM and partner logos:** public brand marks.
- **Stripe:** only layout, interaction and motion patterns. No Stripe content or assets.

## 11. Open items and things to confirm
| # | Item | Owner |
|---|---|---|
| 1 | **Mobile / tablet nav menu** isn't built (the menu button does nothing below 1200px) | Kyte |
| 2 | Real links for the nav, footer, "View All News" and all `#` CTAs | after IA sign-off |
| 3 | **Official company count:** the page says 17 (anandgroupindia.com); the Jan 2026 presentation says 23, and the nav spec lists 21 | client |
| 4 | **Figures to confirm:** 40%+ aftermarket share; "170 mn" micro-credit (currency not stated); award wording (ACMA 2025; Great Place to Work 2019, which may be too old) | client |
| 5 | Company links for APAG CoSyst, HL Klemove and Jinhap | client |
| 6 | **Deep C. Anand photo** (an uncaptioned 1951 crop): confirm it's him | client |
| 7 | **SUJÁN image usage rights** | client |
| 8 | Nav spec: Federal-Mogul entities and Valeo Service India left out; Haldex description; footer-only labels "Direction" and "Join us" | client |
| 9 | Product copy for each area (companies and products) | Kyte + client |
| 10 | Bento graphics (revenue, companies, people, SUJÁN): swap in Mahir's 3D components at `[data-slot]` | Mahir |
| 11 | Partner form: wire it to ANAND's inbox; add spam protection and consent text; confirm the product and country lists | GIDA + client |
| 12 | **WordPress hasn't caught up** (§12) | Kyte + GIDA |

## 12. WordPress status (the gap)
The LocalWP site still has the **first concept** homepage. To match this reference it needs:
- **Tokens:**
  - the new type scale
  - 4px radius
  - 1300px width
  - weights 400/500 only
  - no Geist Mono
  - the new colour tokens: `on-dark`, `on-dark-2`, `tint`, `tint-2`, `faint`
- **The mega menu and its mobile menu.**
- **Sections (new or rebuilt):**
  - the hero mockup
  - the newsroom carousel
  - the bento and its dialog
  - stories
  - product cards
  - Vision
  - CSR guide cards with the ANAND mark
  - the trust section with the 6° cut
  - the CTA banner and Partner form
  - the full footer

Follow the working notes (§2 rules, §7, §15). Back up the database and commit before starting.

## 13. How to take on a new request
1. Read this file and `CLAUDE.md`, start the local server (§3) and look at the current state.
2. If the request references Stripe, open the Stripe page and **measure** the values before building, then map them to the tokens in §6.
3. Use only tokens. Follow §5, use the numbers in §7 and use real content only.
4. Check desktop (1440), the preview pane (~1050), tablet and phone (375), and check for console errors.
5. Update this file and the working notes: the relevant section plus a History row.
6. Commit and push **only when asked**.
