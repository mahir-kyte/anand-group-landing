# ANAND Group landing page: handoff

Read this first. It lets anyone (a person or a new Claude chat) pick up the ANAND Group landing-page design reference from where it stands. It covers the context, the rules, the design system, the language, how each section works, and the open items.

Last updated: 27 Sep 2026, after the white home hero with the stories card (film inside it), the design system page, the third full consistency audit, the newsroom's Recent Highlights carousel and the sticky article sidebar. For the latest commit, run `git log -1`.

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
| The pages (the repo) | `Anand & Gabriel/Anand Moodboard/anand-landing/`: `index.html` (home), `newsroom.html`, `newsroom-article.html`, `design-system.html`, plus `assets/`, `data/`, `tools/` |
| GitHub | `https://github.com/mahir-kyte/anand-group-landing` (**private**), branch `main` |
| Gabriel India reference | `Anand Moodboard/gabriel-landing/` (sibling folder, hero only, same design system; its own `HANDOFF.md`; port 5179; not in git yet) |
| Project rules | `Anand & Gabriel/CLAUDE.md` |
| WordPress technical reference | `Anand & Gabriel/Claude Wordpress Context/ANAND_Website_Rebuild_Working_Notes.md`: rules in §2, tokens in §5, landing page in §7, next steps in §15, history in §17 |
| Client context, people, open client questions | `Claude Wordpress Context/ANAND_Gabriel_Project_Context (1).md` |
| Call transcripts | `Claude Wordpress Context/ANAND_Gabriel_Call_Transcripts.md` |
| Nav / IA spec | `Anand & Gabriel/Docs/ANAND_demo_top-nav.txt` |
| Main content source | ANAND Group Corporate Presentation, Jan 2026: `anandgroupindia.com/wp-content/uploads/2026/06/ANAND-Group-Corporate-Presentation.pdf` |
| WordPress site (LocalWP, the only copy) | `/Users/mahirmalde/Local Sites/anand-group/app/public` → `http://anand-group.local` |
| Original Figma Stripe references | Figma file `rFZMc5AIzv9qN5hBhm4alh`, node `22-379` |

**Files in the repo**
- `index.html`: the home page. It is also the **source of the shared shell**: the nav, the dialog (bento details + Partner form), the CTA banner and the footer sit between `<!-- shell:NAME -->` and `<!-- /shell:NAME -->` markers.
- `newsroom.html`, `newsroom-article.html`: the newsroom index and article template (§8.14, §8.15). They carry the same shell markers.
- `design-system.html`: a browsable **design system page** (principles, colour, type scale, layout and the 6° cut, buttons and the hover rule, icons, components, motion, language and facts). It loads the real `site.css`/`newsroom.css` and reads token values from the live stylesheet, so specimens can't drift. When you add a token, component, icon or rule, add it there too. `noindex`; not linked from the nav.
- `tools/sync-shell.py`: copies the shell blocks from `index.html` into the other pages. **Edit the nav/footer/dialog/banner in `index.html` only, then run `python3 tools/sync-shell.py`.**
- `assets/site.css` + `assets/site.js`: shared styles and behaviour for every page (moved out of `index.html` on 26 Sep; each JS block checks for its own elements, so pages without them skip it). The cobe globe module stays inline in `index.html`.
- `assets/newsroom.css` + `assets/newsroom.js`: newsroom-only styles and the renderer for both newsroom pages.
- `data/newsroom.json`: the newsroom CMS feed (§9). Pages fetch it, so they must be opened through the local server, not as files. No build step.
- `assets/`
  - `oem/`: cropped OEM logos
  - `companies/`: 17 group-company logos
  - `leader-*.jpg`: headshots
  - `sujan-*` photos, plus `sujan-wordmark.svg` (gold) and `sujan-wordmark-navy.svg`
  - partner logos, news and product images
  - `news/`: the newsroom sample's photos, newsletter covers and media-kit thumbnails
- `.gitignore`: `.DS_Store`, `.claude/`. The file `.claude/launch.json` holds the preview config and is not committed.

## 3. Run it locally

macOS blocks the preview tool from starting a server inside `Documents`, so start it from a terminal (or Claude's Bash, in the background):

```bash
cd "/Users/mahirmalde/Documents/Documents/Work/Kyte/Anand Group/Anand & Gabriel/Anand Moodboard/anand-landing" && python3 -m http.server 5178 --bind 127.0.0.1
```

Open `http://localhost:5178`. To let phones or colleagues on the same Wi-Fi open it, use `--bind 0.0.0.0` instead and share `http://<this Mac's IP>:5178` (find the IP with `ipconfig getifaddr en0`; allow Python through the macOS firewall if asked). Only people on the same network can reach it. The preview pane attaches with `.claude/launch.json`: `{"version":"0.0.1","configurations":[{"name":"anand-landing","url":"http://localhost:5178","port":5178}]}`

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
- **Hovers are neutral:** cards, tiles, chips and outlined buttons get a light grey (`--soft`) fill and a text colour change on hover. **Never turn a border (or a whole card) brand-coloured on hover**; borders stay `--line`. Filled buttons may darken their fill (primary cyan → navy).
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
| `--error` | `#DF1B41` | Form validation (border and message) |

The CSS rules use these tokens, not raw hex values. The only hardcoded colours left are:
- white and black (white text; black only inside masks)
- the CSR card fill/tint pairs (§8.10)
- white at .72/.82 opacity for secondary text on coloured cards and the hero (.72 for dates and meta, .82 for excerpts; nothing else)

### Layout
- **Width:** `--max:1348px`, which is 1300px of content plus 24px padding on each side.
- **Section padding:** `.sec` 120px, 84px on phones.
- **Radius:** `--radius:4px`.
- **No sideways page scroll:** `overflow-x:clip` on both `html` and `body`. Use `clip`, not `hidden`: on phones `hidden` on body alone still lets Safari pan the page sideways, and `hidden` on both would make body its own scroller and break `position:sticky` (the CSR intro) and the nav's scroll listener. Carousels scroll inside their own containers, so they're unaffected.
- **Breakpoints:**
  - 1360px: "Explore Careers" hides in the nav (below 1,360px)
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
| `--fs-num` | 24 | Numbers inside graphics; the hero stories card headline |
| `--fs-label` | 12 | Captions, all-caps labels, globe and map labels, avatar initials |
| `--fs-mega` | clamp(72,9vw,128) | The single oversized figure: the trust section's **40%+** ("%+" the same size as the digits) |

**No exceptions left.** The second 26 Sep audit (evening) replaced the last raw sizes (globe labels 11px, avatar initials 10.5px/600, phone map pin 9px, phone news excerpt 15px, leader initials 16px, body 16px) with tokens. Rendered check at 1440px: 13 sizes, all on the scale; Geist only; weights 400/500 only; text colours all tokens.

**Form controls:** `button, input, select, textarea` inherit the page font (`font-family:inherit` in `site.css`); browsers otherwise draw buttons in Arial. The 27 Sep audit caught this on the newsroom's "Load More".

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
| `.btn-outline2` | white, `--line` border, cyan text | `--soft` fill, navy text; the border stays `--line` |
| `.st-btn` (square arrow buttons: home stories, newsroom Recent Highlights) | white, `--line` border, navy icon | `--soft` fill, cyan icon; the border stays `--line` |
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
Lucide only (`<i data-lucide>`, v1.48.0), with the same stroke everywhere. Colour is **cyan** for accent icons. Sizes:
- 14–16px inline with links and buttons (chevron-right on CTAs, arrow-right on "see all" links, arrow-up-right on external links)
- **18px** next to 14–15px labels (product-card badges, SNS Foundation focus areas)
- 32px in the governance tiles (white on the fill), 40px for the four trust feature icons (stroke 1.5)

---

## 7. Language, copy and facts
- **Voice:** confident, factual, restrained. Short sentences, no hype.
- **Title Case:**
  - Applies to headings, card titles and all button and link labels, e.g. "Partner with Us", "View All News", "Read the Story".
  - Small words (a, an, the, and, or, for, of, on, in, to, at, by, with) stay lowercase unless they come first.
  - Units stay lowercase ("sq km", "mn").
- **Sentence case** for nav menu labels, menu items and footer link lists, matching the nav spec.
  - Exception: "see all" links inside menus and the footer ("All Companies", "All News") are link labels, so Title Case.
- **Press headlines stay in sentence case** (the newsroom stories quote the publisher's headline); everything we write is Title Case.
- **Currency:** "US$" with no space and a capital B/M: US$2.2B+, US$10.3B, US$408M. Axis labels may say "US$ Bn". Rupee figures follow the source ("₹316.6 crore", "Rs 94.8 crore") because they quote headlines.
- **ANEVOLVE** in caps when it's the platform on its own; the company keeps its registered name "Anevolve Mando eMobility". Write "future-tech platform" (hyphenated).
- **"Our Vision"** is the nav and footer label for the Vision section; the section's eyebrow still reads "Vision & strategy".
- **UK/Indian English:** programme, honours, enquiries, lakh.
- **Brand spellings:** ANAND, SUJÁN, Gabriel India, ANEVOLVE, HL Klemove, MAHLE ANAND, Joyson ANAND.
- **Numbers used everywhere (must match):**

| Fact | Value | Source |
|---|---|---|
| Founded | 1961 | site |
| Companies | **17** | anandgroupindia.com. The Jan 2026 presentation says 23; see §11. |
| People | 22,000+ | site, presentation |
| **Fact labels** (home About facts and newsroom About ANAND, word for word) | "Companies in the ANAND family" · "People across the Group" · "Locations across 14 Indian states" · "Group revenue". Write "people", not "employees" | |
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
- **Items** (from `Docs/ANAND_demo_top-nav.txt`): About ANAND ▾ · Our companies ▾ · Sustainability & CSR ▾ · Careers ▾ · Newsroom ▾ · Our Vision (renamed from "Vision & strategy" and moved last as the only plain link, links to #vision; the IA doc still says "Vision & strategy" second), plus "Explore Careers" (outline) and "Partner with Us ›".
- **Mechanics** (copied from Stripe):
  - a white bar with one shared panel underneath
  - the panel slides ±20% depending on direction, and its height animates
  - other labels dim and the page behind blurs
  - hover intent 80/180ms; Esc, click-outside and scrolling the page close it; Arrow Down opens from the keyboard
  - on short screens the panel is capped to the window height and scrolls inside (the Companies panel is ~650px tall)
- **Widths:**
  - the nav needs about 1200px
  - at ≤1359px "Explore Careers" hides (the full bar needs ~1,325px of the 1,348px max; gaps are 22px between links, 28px between groups)
  - below 1200px it collapses to the menu button
- The logo never shrinks (`.nav-logo{flex:none}`). **The nav logo and the footer logo link to the home page** (`index.html`).
- **Two states:**
  - **Over a full-bleed film hero (`.nav.on-hero`, only when the hero has `.hero--film`; none does now):** transparent bar, white logo (filter), white links and chevrons, and "Explore Careers" as a white outline. "Partner with Us" stays cyan. The current white hero uses the normal filled bar.
  - **Past the film (`.nav.scrolled`):** the normal filled white, blurred bar with dark content.
  - The bar fills as soon as it would reach the hero text: at `.hero-grid` top − 72px (nav height) − 24px, about 114px of scroll.
  - **Menu open:** whenever a menu is open, the bar shows the white card with dark text in either state (`.nav-shell.open`).
- **Phone/tablet menu (below 1200px):** the ☰ button opens a full-height white sheet under the bar (`#mMenu`), and the icon turns into an ✕.
  - It's **built in JS from the desktop mega menu**, so editing the desktop menu updates both. Each dropdown becomes an accordion item (one open at a time) with its column headings as small caps labels, the "Beyond automotive" list, and the panel's "See all" link. "Our Vision" stays a plain link. "Explore Careers" and "Partner with Us" sit full width at the bottom.
  - While open: the bar turns solid white with the normal logo (`.nav.m-open`), the page can't scroll behind it, and Esc, tapping any link, or widening past 1200px closes it. "Partner with Us" closes the menu and opens the partner form.

### 8.2 Hero (`section.hero`, white)
- **Background:** white. The nav uses its normal filled bar here (the see-through `.nav.on-hero` state only applies to a full-bleed film hero, `.hero--film`, which the site no longer has).
- **Layout:** two columns at 1,200px and up: text (max **560px**, enough for "Future of Mobility" at 64px; the rest of the width goes to the card, about 692×443 at 1440px) on the left, the **stories card** on the right (`.hero-grid--story`, 48px gap, centred, then the card is nudged **88px lower** with `position:relative; top:88px` so it sits further over the slash without moving the slash). Below 1,200px the card stacks under the text (max 760px wide).
- **Text** (navy on white):
  - eyebrow "SINCE 1961" (cyan)
  - h1 "Engineering the / Future of Mobility" in navy, **two lines**, with a forced break before "Future" (`br.br-lg`, hidden below 640px so phones wrap naturally)
  - lede in `--slate`
  - one button, "Explore Solutions ›" (chevron, as every primary CTA)
  - **facts row** (`.hero-facts`, shared with the Gabriel hero): 17 · Companies in the ANAND family, 22,000+ · People across the Group, US$2.2B+ · Group revenue (labels word for word as §7). `--fs-num` figures with the cyan tick on a hairline, `--fs-small` muted labels; 18px figures on phones so three fit a row
- The layout is identical to the Gabriel India hero (`../gabriel-landing/`); only the content differs (ANAND's card plays the film and switches by company logos).
- **Stories card** (`#heroStory`, mirrors the "Stories" block on stripe.com/newsroom):
  - The six company stories from the Stories section (Gabriel India, SUJÁN, ANEVOLVE, HL Klemove, MAHLE ANAND, Joyson ANAND), each linking out.
  - **The hero film plays inside the card** (`.hs-reel`, 75% over navy), under each story's colour: a 30% wash in the story colour (navy-2 / royal / navy, alternating) plus a shade from the bottom for the text. White logo top-left, `arrow-up-right` top-right; an all-caps label, the one-line story at `--fs-num` (24px; `min(var(--fs-num), var(--fs-h3))` so it's 22px on phones; 3 lines max, 5 on phones) and, on hover, the CTA ("Explore Gabriel India →"). Hover also settles the film's slight zoom and lifts the copy.
  - Card 713:456 (square on phones).
  - **Logo row below** (Stripe's tabs): six logos, 6 across (3×2 on phones); the current one is full strength, the rest 45% (80% on hover). Clicking one switches slides. On desktop the row sits on the navy slash, so the logos are white; when stacked (below 1,200px) it sits on white, so the logos are dark.
  - **Changing slide:** a panel in the next story's colour wipes across (0.6s), the story swaps under it, and it wipes off (0.6s), `cubic-bezier(.7,0,0,1)`. Autoplay every 8s, paused on hover, keyboard focus and while off screen; arrow keys also work. Reduced motion swaps instantly.
  - Markup is static in `index.html`; behaviour is in `site.js`. On the real site it's a block fed from the company CPT (logo, label, line, link) plus the film.
- **The film** (`assets/hero-reel.mp4`, 15.5s, 1920×1080, H.264, ~5.8 MB, plus `assets/hero-reel-poster.jpg`):
  - Plain `<video muted loop playsinline>` inside the card; it plays only while on screen, and with reduced motion it stays on the poster.
  - **Shots:** ANAND flag → ANAND building → factory floor → robot arm → robotic car-body welding (Pexels 4468754, **temporary**) → aerial coast road → SUJÁN camp at dawn → dusk over the hills → lantern-lit dinner (slowed to 65%). ANAND shots avoid the film's graphics and titles; SUJÁN shots avoid animals. 0.7s crossfades.
  - **Sources:** ANAND homepage film (anandgroupindia.com) and SUJÁN main film (`sujan.b-cdn.net`); both need ANAND's permission. Cut by Kyte, upscaled by Mahir.
  - **Master files:** `Anand Moodboard/hero-reel/` (outside the repo): `ANAND-hero-reel-final-1920x1080.mp4` (high-quality master), `ANAND-hero-reel-final-web.mp4` (same as the site file), and `Final/` (the two upscaled halves it was joined from).
  - **For the real site:** edit one short optimised loop from ANAND's and SUJÁN's master files, then remove the Pexels clip.
- **Band:** the slanted navy band with royal and cyan stripes runs below into the newsroom (a 1px overlap, `.hero+.newsroom{margin-top:-1px}`, hides a sub-pixel seam now that the hero is white).
- **Padding:** `150px 0 calc(180px + …)` on desktop, so the slash rises behind the stories card: the card and its logo row sit above it and overlap the stripes on purpose, as Mahir asked. 340px bottom when stacked (tablet and phone) so the band starts just below the logo row.
- **History:** first a product mockup, then a Stripe-style video carousel, then a full-bleed background film with white text on navy; on 27 Sep the stories card was added, the hero turned white and the film moved into the card.

### 8.3 Newsroom (`section#news`, navy)
- A split panel: image left, navy text right.
- A thumbnail row whose active line is the 7s autoplay bar.
- "View All News".
- Content comes from the `#cms-news` feed (6 real stories; the Livemint joint-venture story was dropped because its image was only two logos).
- 56px top padding so the hero's bottom stripes don't crowd the eyebrow.

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
- **Cards:** 332×448 media with a white logo. On hover **only the photo** zooms 1.036 inside a fixed frame (scaling the whole frame got clipped by the scroller).
- **Arrows:** white with a navy icon (`.st-btn`; hover: `--soft` fill and cyan icon, border stays `--line`). Each click moves **exactly one card** (card width + 16px gap, e.g. 348px at 1440): it goes to the next card's snap position rather than scrolling a set distance, and fast clicks stack (two clicks = two cards). The last step is shorter, just enough to line the final card up with the edge. The arrows disable at either end.

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
- **Top:** 6° slanted stripes, with 300px of top padding. A 6° slant rises 10.5% of the screen width, so on screens wider than about 1,430px the white band (`max(150px, 10.6vw)`) and the top padding (`max(300px, 10.6vw + 150px)`) grow with the width; otherwise the diagonal ran out on large monitors and the right stripe was cut flat. Any new slanted cut needs the same check: band height ≥ 10.6vw.
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
- **Left (desktop, ≥1200px): a sticky intro.** A 440px column that pins 112px from the top and is as tall as the screen (100svh − 168px, clamped 460–760px). The eyebrow, heading, lede and "Explore Sustainability & CSR ›" stack at the top with equal 20px gaps (heading→lede→button). An **SNS Foundation card** sits at the bottom of the column (`.gs-fdn`, soft fill with a hairline border): the title "SNS Foundation" (17px), one 14px line on its namesake Sant Nischal Singhji (1882–1978), and its four focus areas (14px) with 18px cyan Lucide icons, matching the product-card badges (Education, Health & hygiene, Skill development, Community conservation). Source: anandgroupindia.com/snsf/about-snsf. On short screens the column grows to fit (min-height: min-content) so the card never overflows; below 1200px it sits 32px under the button. It stays put while the cards scroll past, then leaves with the section. A 280px bottom margin releases it early so the #trust diagonal stripes never cover the button.
- **Right: 8 guide cards in 2 staggered columns of 4**, starting ~130px after the intro (an 81px spacer column) and filling to the right edge (≈354px wide at 1440, 280px at 1200); the left column starts 200px lower. Column A: wildlife, education, skills, ANAND School. Column B: livelihoods, health, sustainability, scholarships. The intro stays pinned for ~1,240px of scroll at 1440×900.
  - Below 1200px the intro is a normal block above a 3-column (tablet) or 1-column (phone) grid of the same cards.
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
  - ANAND School: 800+ students, 100% Class X board results 2024–25 (anandgroupindia.com/anandschool)
  - SNSF Scholars: free English-medium schooling since 2018–19 (SNSF case studies)
- **Card colours** (no two neighbours the same): A = dark green, royal, cyan, navy-2; B = cyan, navy-2, green, royal. On tablet the 8 cards run 3 across (last row of 2); on phones, one column.
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


### 8.14 Newsroom index (`newsroom.html`, mirrors stripe.com/newsroom)
Measured on stripe.com/newsroom and stripe.com/newsroom/news/* on 26 Sep 2026, then set in ANAND tokens.
- **Grid:** Stripe's 4-column page grid (`.nw-grid`, 24px gutters). **Accented details** (`.acc`): 16px left padding with a 1px cyan tick beside the first line, sitting on a **neutral `--line` hairline that runs the full height of its column** **only where there is content beside it** (news rows: the title column only, as tall as that story's text, with 40px gaps between stories that the line does not bridge; the date column keeps just the tick; guides; the article: one line beside the category and title, and a separate one from the date down to Copy Link, broken by the gap between them). The same device as the home page's trust features and facts.
- **No sub-nav:** a Stripe-style Newsroom sub-menu bar sat under the main bar and was removed on request (the same links are in the main nav's Newsroom menu and the guides row).
- **Hero: featured stories** (Stripe's NewsroomStoryCarousel, from the Stories block on stripe.com/newsroom): an intro in column 1 ("Newsroom" eyebrow, "Latest From ANAND", lede, "See All News ›"); the story card in columns 2–4 (713:456, Stripe's shadow), with previous/next arrows inside it.
  - **Card:** each story has a brand-blue layer (navy-2 / royal / navy) with its photo at 50% on top and a shade fading to the colour at the bottom. Top-left: the lead company's logo on a white chip, in its own colours (Stripe uses all-white logos, but Dana and Inalfa lose their lettering that way); top-right: a Lucide newspaper icon. Bottom: category · date, the title (`--fs-h3`, up to 3 lines), and "Read Story →", which fades in as the copy lifts on hover (always shown on touch screens).
  - **Changing story:** a colour panel wipes across the card (0.6s in, 0.6s out, `cubic-bezier(.7,0,0,1)`) and the story swaps under it. Autoplay every 8s (Stripe's timing); pauses on hover and focus; the keyboard's arrow keys also work; no wipe or autoplay with reduced motion.
  - **Controls** (Stripe's logo tabs were replaced on Mahir's request), bottom-right of the card: a joined previous/next pair (a progress bar per story was tried and removed): frosted (white 12% + 10px backdrop blur, 1px inner hairline), 40px buttons split by a hairline, Lucide chevrons at 18px/1.75. Hover: white fill, navy chevron. They wrap around. The copy keeps 112px clear on the right; on phones the buttons sit bottom-right, under the copy. The chip logo is optically sized from the cropped copies in `assets/news/logos/<company-slug>.png`.
  - **Lead company:** the tagged company named first in the headline.
- **Guides row:** four separate entries, one per newsroom type (each will get its own full page): Latest News, Media Coverage, Newsletter, Media Kit. 40px cyan Lucide icons (newspaper, megaphone, book-open, folder-down), an accented title, one line, and a "See All …" link.
- **"See all" CTAs everywhere:** every section header has a **primary** (`btn-primary`, cyan fill, white text, chevron) "See All …" button (News, Coverage, Newsletters, Full Media Kit, Media Contacts), and the guides use the same labels as links. Until the full pages exist they jump to the section on this page; each carries `data-page` with its planned address: `newsroom/news`, `newsroom/media-coverage`, `newsroom/newsletter`, `newsroom/media-kit`, `newsroom/media-contact`.
- **Diagonal break into News:** the same cut as the home page's CSR → trust break. The white News section overlaps the grey guides area by 125px; its top edge is a slab skewed 6° (rising to the right) with a royal stripe (34% wide, 40px) and a cyan one (19%, 34px) on the left (22/18px on phones). The guides get `calc(260px + 10.5vw)` of bottom padding (≈410px at 1440; 240px on phones) so the slant never covers their links.
- **News** (`#news`, white): **our own articles only** (items that link out to other sites were taken out of this list for the prototype; they live in Media Coverage). The old site's three filters (category chips, company select, year select), "Showing X of Y", then rows: date | category + title + companies | 2:1 picture. 8 rows, then "Load More". The row component can still show a coverage item (publication name on a soft tile, ↗), if coverage is ever mixed back in.
- **Media coverage** (`#coverage`, soft): Stripe's Stories block. Intro on the left (with "See All Coverage"); on a 3-column grid, a **carousel card two cards wide** for the 5 newest coverage items (publication, date, title, 3-line excerpt, "Read on Mint ↗" with the underline only under the label). Each story takes a colour pair from the home page's CSR cards (royal, dark green, cyan, navy-2, green; the ANAND chevron mark in the lighter tint at 55%). Changing story uses **the hero's wipe**: a panel in the next story's colour sweeps across (0.6s), the story swaps under it, and it sweeps off (0.6s), `cubic-bezier(.7,0,0,1)`. The same frosted previous/next pair as the hero sits bottom-right; no autoplay (the hero already autoplays). Below it, **Recent Highlights** (Stripe blog's strip of tall coloured cards, min 368px, 340 on phones), as an **endless carousel of whole cards** inside the page margins: 4 across on desktop, 3 under 1100px, 2 under 780px, 1 under 540px; no card is ever cut off at the left or right. Colours cycle cyan, royal, navy-2, navy, dark green, green (the last card never repeats the first card's colour where the loop joins); white title, publication · date at 72%, 5-line excerpt, "Read Article ↗" pinned to the bottom. Hover lifts the card 4px with a soft shadow (no border). Previous/next buttons (`.st-btn`, as on the home stories carousel) move one card with the site's `cubic-bezier(.7,0,0,1)` 0.6s slide and never stop at an end; arrow keys and swipe work too. (How it loops: the cards are rendered three times and it jumps silently back to the middle copy.)
- **Media contact** (`#media-contact`, white, just above the closing banner, whose band is also white on this page): mirrors Stripe's "Ready to get started?" block. Columns 1–2: "For media" eyebrow, "Media Contact", one line, then a primary "Email the Media Team" button and a "See All Media Contacts ›" link. Columns 3–4: two guide-style items (hairline + cyan tick, 40px cyan Lucide icon): *Press and Media Enquiries* (mail; email link) and *Corporate Communications* (building-2; ANAND Automotive Limited's address and both numbers; "Call the Office"). No card. Tablet: intro full width, items side by side; phone: one column.
- **Newsletter** (`#newsletter`): the 8 newest issues of *ANAND Interaction* as **3D books** (a plain-CSS port of a React "Book" component Mahir supplied; this static site has no React/Tailwind). Each cover sits on a 4:5 portrait soft tile (the "shelf"; book 58% of its width): 2:3 book (the component is 49:60, but the covers are magazine-shaped), binding sheen on the left, a page edge on the right, a back cover behind, the component's book shadow; hover tilts it `rotateY(-20deg) scale(1.066) translateX(-8px)` over 0.5s. Covers were cropped out of the old thumbnails (which had a white frame and baked-in shadow) into `assets/news/covers/`; the originals are kept as `imageOriginal`. Under each: "Vol. LXXIV, November 2020", date, "Download PDF".
- **About + media kit** (`#media-kit`, soft): Stripe's About page (without its colour bar). "Engineering the Future of Mobility Since 1961", the same facts as the home page, then Group Presentation (Sept 2026), Brand Guidelines, Gallery Downloads.
- **Phones:** single column; long headlines drop to `--fs-h3`; rows become title + small square picture.

### 8.15 Newsroom article (`newsroom-article.html?slug=…`, mirrors stripe.com/newsroom/news/*)
- **Head:** category (accented) and the title across columns 1–3 at `--fs-h2` (Stripe uses 56px, but ANAND headlines are much longer).
- **Left column:** date (accented), Categories, Companies, attachment, then share links (LinkedIn, X, Email, Copy Link). Lucide has no brand icons, so share uses text labels with `share-2`/`mail`/`link`. On desktop the column is **sticky** (112px below the top, clear of the nav) and stays in view until the article body ends; on tablet and phone it sits above the body as a normal row.
- **Main (columns 2–4):** 2:1 hero picture, then the body at 18px/1.6 slate, max 800px; old line breaks are tidied (mid-sentence breaks become spaces, "•" lines become lists); extra images become a 2-up gallery; then an "About ANAND Group" boilerplate and the media contact.
- **More From ANAND:** 3 related rows (our own articles only) (most shared companies first, then same category, then newest) on soft, plus "All News".
- **Title and meta description** are set from the item. An unknown slug shows a "We couldn't find that story" state with a link back.
- **Images:** every picture slot shows a soft tile with the ANAND chevron mark until the photo loads (or if it fails).

---

## 9. CMS-style data
- **`#cms-news`** (home page newsroom carousel): 6 news items (category, date, title, excerpt, image, imageAlt, source, url). Becomes the News posts.
- **`data/newsroom.json`** (newsroom pages): a **representative sample migrated from anandgroupindia.com** on 26 Sep 2026: 18 full articles from *Latest at ANAND* across every category (20 were migrated; 2 removed on request: the Gabriel–HL Klemove press release and the Jodalli plant story) (Press Release, Achievement, Celebration, Events, Highlights), the 12 newest media-coverage links, and the 8 newest newsletters. Also `taxonomy`, `mediaContact` and `mediaKit`.
  - **Item fields (the CMS fields for a News post):** `id` (old WordPress `arid`), `slug`, `type` (`article` = full page here, `coverage` = links out), `title`, `date`, `categories`, `companies`, `excerpt`, `image`, `imageAlt`, `gallery`, `body` (cleaned HTML), `publisher`, `externalUrl`, `pdf`, `featured`, `legacyUrl` and `legacyPermalink` (old URLs, for 301 redirects).
  - **How it was pulled:** the old site's WordPress REST API returns a server error, so the lists came from its Ajax Load More endpoint (`admin-ajax.php?action=alm_query_posts`) and each article from `news-detalis/?arid=<id>`. The old site has 399 *Latest* items (290 with full pages), 303 coverage items and 23 newsletters; the scripts are in `tools/migrate-news/` (README there). Ask before re-running: the old server started timing out after ~300 requests.
  - **Companies** in the sample are derived from company names in each item's text; the old `company_belongs_to` field wasn't migrated. Check them during the real migration.
  - **Images are self-hosted** in `assets/news/` (downloaded 26 Sep, mostly from anandgroupindia.com and 3 from the Internet Archive's copies while the old server was down); each item keeps the original URL in `imageSource`. PDFs and coverage links still point at their original hosts.
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
| 1 | ~~Mobile / tablet nav menu~~: built (see §8 Nav). Checked at 375, 768, 1024, 1200, 1280, 1440 and 1920px with no sideways overflow | done |
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
| 14 | ~~Newsroom images~~: the sample images (31 after two articles were removed) are self-hosted in `assets/news/` (3.5 MB; photo PNGs converted to JPEG, nothing wider than 1600px). On the real site, import them into the WordPress media library | done |
| 15 | **Newsroom migration scope:** the reference has a 30-item sample. Decide how much of the 399 + 303 + 23 old items to migrate, confirm company tags, and set up 301 redirects from `legacyUrl`/`legacyPermalink` | Kyte + client |
| 13 | **Hero reel:** now one optimised loop (`assets/hero-reel.mp4`). Still to do: get ANAND's permission for its and SUJÁN's footage, ideally the **master files** for a sharper re-cut, and replace the Pexels welding shot. The previous note on ANAND's site film still applies (the site copy is 2560×1182 and heavily compressed); host an optimised, short loop (10–20s, plus a poster frame) on the new site instead of streaming the 16 MB original | Kyte + client |

## 12. WordPress status (the gap)
The LocalWP site still has the **first concept** homepage. To match this reference it needs:
- **Tokens:**
  - the new type scale
  - 4px radius
  - 1300px width
  - weights 400/500 only
  - no Geist Mono
  - the new colour tokens: `on-dark`, `on-dark-2`, `tint`, `tint-2`, `faint`, `error`; the `fs-mega` size
  - `overflow-x:clip` on html and body (not `hidden`), §6 Layout
- **The mega menu and its mobile menu** (nav order now ends with the plain "Our Vision" link; the mobile accordion is generated from the desktop menu).
- **Sections (new or rebuilt):**
  - the hero background film (one self-hosted loop, `assets/hero-reel.mp4`, with poster) with the inverted nav
  - the newsroom carousel
  - the bento and its dialog
  - stories
  - product cards
  - Vision
  - CSR guide cards with the ANAND mark, a sticky left intro and 2 staggered card columns
  - the trust section with the 6° cut
  - the CTA banner and Partner form
  - the full footer
- **Newsroom templates:** a newsroom index and a single-news template (§8.14–8.15), with News posts carrying the §9 fields (categories and companies as taxonomies, ACF for publisher, external URL, PDF, featured, gallery), and the old news imported with 301 redirects.

Follow the working notes (§2 rules, §7, §15). Back up the database and commit before starting.

## 13. How to take on a new request
1. Read this file and `CLAUDE.md`, start the local server (§3) and look at the current state.
2. If the request references Stripe, open the Stripe page and **measure** the values before building, then map them to the tokens in §6.
3. Use only tokens. Follow §5, use the numbers in §7 and use real content only.
4. Check desktop (1440), the preview pane (~1050), tablet and phone (375), and check for console errors.
5. Update this file and the working notes: the relevant section plus a History row.
6. Commit and push **only when asked**.
