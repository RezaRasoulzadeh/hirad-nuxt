# Hirad UI context

This is the design baseline for future AI and human frontend work. It records the
direction agreed during the Engineering Resources refinement on 2026-09-18.
Follow explicit new user instructions when they change this direction, and update
this document when a lasting design decision changes.

## Design intent

Hirad is an industrial equipment and engineering company serving oil, gas,
petrochemical, and process industries. Its public pages should feel like one coherent
company website: light, calm, precise, and professional, with Persian content leading
and burgundy accents supporting the hierarchy.

Treat “beautify” as improving alignment, spacing, readability, and consistency with
the homepage. It is not permission to introduce another visual system or new features.
External mockups guide information architecture; the actual Hirad website defines the
brand treatment.

## Source files to inspect

| Concern | Reference |
| --- | --- |
| Theme, colors, font, radii | [main.css](app/assets/css/main.css) |
| App configuration | [nuxt.config.ts](nuxt.config.ts), [package.json](package.json) |
| Public layout and main landmark | [default.vue](app/layouts/default.vue) |
| Shared header, mobile menu, product drawer | [Header.vue](app/components/layout/Header.vue), [Drawer.vue](app/components/layout/Drawer.vue) |
| Shared footer | [Footer.vue](app/components/layout/Footer.vue) |
| Homepage composition | [index.vue](app/pages/index.vue) |
| Homepage hero and buttons | [HeroSection.vue](app/components/home/HeroSection.vue) |
| Section headings and industrial presentation | [AboutSection.vue](app/components/home/AboutSection.vue), [Catalogue.vue](app/components/home/Catalogue.vue), [OrderProcess.vue](app/components/home/OrderProcess.vue) |
| Approved Resources hero, tabs, container, support block | [ResourcePage.vue](app/components/resources/ResourcePage.vue) |
| Resource and tool cards | [ResourceCard.vue](app/components/resources/ResourceCard.vue) |
| Standards categories and empty state | [standards.vue](app/pages/resources/standards.vue) |
| Resources copy and directory definitions | [resources.ts](app/data/resources.ts) |

The current stack is Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, daisyUI 5, and
`lucide-vue-next`. The README has historical descriptions of Nuxt 3, dark mode,
and different brand colors. For UI decisions, this document and the current theme
and configuration supersede those historical descriptions.

## Theme and typography

- Reuse semantic daisyUI tokens. The current primary color is `#a0103b`, expressed in
  components as `text-primary`, `bg-primary`, `border-primary`, and `btn-primary`.
  Do not scatter the hex value through templates.
- Use `bg-base-100` for white surfaces, `bg-base-200` or a light variant for supporting
  panels, `border-base-300` for subtle boundaries, and `text-base-content` for text.
- The current public theme is light only. Do not add a theme switch or a separate
  dark palette as part of routine UI work.
- Keep Vazirmatn through the existing `font-sans` setup. Do not introduce another font.
- Primary page titles normally use `text-3xl md:text-4xl font-black leading-relaxed`.
  Section headings use `text-2xl md:text-3xl`; compact directory headings use
  `text-xl font-bold`; card titles use `text-base font-bold leading-7`.
- Body text normally uses `text-sm leading-8 text-base-content/65`. Supporting labels
  use `text-xs` and readable muted text. Do not make whole inactive cards translucent.
- English eyebrows use `text-xs font-bold tracking-[0.2em] text-primary uppercase`.
  Apply letter spacing to short English labels, not Persian prose.

## Approved Resources structure

All three routes—`/resources`, `/resources/tools`, and `/resources/standards`—use
`ResourcePage.vue`. Keep their shared structure there rather than copying it into
individual pages.

1. A light hero using the existing `app/assets/hero-background.jpg` asset.
2. A small RTL breadcrumb near the top of the content container.
3. A centered English eyebrow, Persian heading, short burgundy underline, and Persian
   description. The text column is `mx-auto max-w-3xl text-center`.
4. Optional centered hero actions. The Resources overview retains Explore Tools and
   Browse Standards.
5. A full-width white section-navigation strip directly under the hero, with the
   links centered as a group.
6. Page-specific content followed by the shared engineering support/contact block.

The user explicitly chose the Tools page's centered hero for the Resources overview.
Do not restore the split hero, equipment illustration, image frame, or floating image
caption on Resources. The homepage retains its own equipment illustration and layout;
this Resources decision does not call for redesigning the homepage.

The section navigation uses actual route links, not simulated tabs or pill buttons.
The active link has primary-colored text and a thin burgundy bottom border, with
`aria-current="page"`. At mobile widths the links share the available row; at larger
widths they form a centered group. Keep the Resources header link active on its child
routes too.

Nested Resources tool pages use a compact interior layout: keep the shared section
navigation at the top, omit the directory hero image and hero copy, then show the full
route breadcrumb before the tool's own page heading and content.

## Layout, surfaces, and interaction

- Resources containers use `mx-auto max-w-[1720px] px-5 md:px-8 lg:px-12`.
  Hero and content sections typically use `py-12 md:py-16`. Keep text readable with
  narrower text columns while retaining the wide content area for future tables.
- Keep the shared header, footer, drawer, and floating contact control supplied by the
  default layout. It already renders `<main>`; do not nest another `<main>` in a page.
- Use white cards with `rounded-xl border border-base-300 p-6`, orderly internal
  spacing, and small burgundy icons on `bg-primary/5` icon tiles.
- Show Persian card titles first, short English technical labels below, and one Persian
  description. Avoid repeating full paragraphs in both languages on the same page.
- Use grids with `gap-4` or `gap-5`, one column on phones, two on medium widths, and
  three or four only when content fits. Do not truncate meaningful titles to force a grid.
- Linked cards may have `shadow-sm`, a subtle hover shadow, a thin primary edge, and a
  small `motion-safe` movement. Static planned-tool cards have no link cursor or fake
  click/hover affordance. Display their preparation status once.
- Primary actions use `btn btn-primary`; secondary actions use
  `btn btn-outline btn-primary`. Keep `rounded-lg` or `rounded-xl`, clear labels,
  and approximately 44–48px touch targets.
- Use Lucide icons with consistent proportions and roughly 1.5 stroke width for
  decorative feature icons. Mark purely decorative icons `aria-hidden="true"`.
- Empty states are calm informational panels with a small icon, short title, and one
  explanation. The standards page has compact category tiles and one shared empty
  state, not eight repeated empty-message cards.
- Reuse local imagery and `normalizeLocalAssetUrl` for imported asset URLs. Do not
  introduce remote images or generated artwork merely to fill space.
- Avoid oversized display titles, huge rounded containers, glassmorphism, saturated
  gradients, dashboard-style decoration, heavy shadows, and arbitrary technical frames.
  Existing homepage decorations are contextual; do not copy all of them into every page.

## Motion

Resources uses subtle, one-time scroll entrances: a 14px rise with a fade over 600ms,
short stagger delays capped at 210ms, and a small scale reveal for the hero underline.
`ResourcePage.vue` owns the IntersectionObserver and Web Animations lifecycle;
mark content with `data-resource-reveal` and optional `data-resource-delay` rather
than adding animation libraries or separate observers to each card.

Keep content visible by default for SSR, disabled JavaScript, and unsupported browsers.
Honor `prefers-reduced-motion`, including changes while the page is open; cancel an
entrance when its content receives keyboard focus. Disconnect observers and cancel
animations when leaving the page. Use only opacity and transforms for entrances,
without changing layout or delaying navigation. No looping, parallax, or scroll hijacking.

Tab underlines ease into view, and actionable cards/buttons have short hover transitions.
Planned tools remain static on hover. Preserve the centered hero and navigation layout.
Keep technical table rows static during page entrances and limit their scroll containers
to horizontal overflow so row animations cannot create temporary scrollbars.

## Persian, English, and technical content

The app currently uses Persian-first RTL pages. `@nuxtjs/i18n` is installed but is not
activated in `nuxt.config.ts`; there is no global runtime language selector. Do not
assume `useI18n()` or locale-prefixed routes already exist.

Resources text is centralized in `app/data/resources.ts` using `{ fa, en }` fields.
Extend this model for new Resources copy, including labels, accessibility text, and
SEO. Keep both translations available without displaying duplicate descriptions.
A future language-switching project should explicitly migrate this architecture.

Prefer logical spacing/alignment (`ms`, `me`, `ps`, `pe`, `start`, `end`, `text-start`).
Use `lang="en"` and `dir="ltr"` on English labels; isolate technical codes and numeric
values when needed so mixed text remains readable in RTL. Future wide tables should
scroll inside their own container, not make the whole page overflow.

Write concise, customer-facing copy. Avoid implementation language such as “this page
establishes future access points.” Do not invent statistics, certifications, standard
records, engineering values, or downloads. Existing directory cards describe planned
tools; they do not authorize implementing datasets, calculations, APIs, or exports.

Attribute pipe dimension data to Hirad catalogue tables based on ASME B36.10 and
B36.19. Customer-facing references and download names should not expose source page
numbers or filenames; keep detailed provenance in the source data only.

Use the existing `useSeoMeta` approach for page metadata and the appropriate centralized
copy. Do not add packages, a new theme, or a site-wide localization migration to solve a
local styling task.

## Working and validation expectations

Before editing, inspect the current diff, the page's shared layout, and the closest
reference above. Preserve unrelated changes. Reuse a component when the structure is
actually shared; do not build a generic design framework for one-off details.

For frontend changes, run `npm run build` and `git diff --check`. For visual or navigation
changes, also inspect the rendered pages at phone, tablet, and desktop widths when a
browser is available (for example 375, 768, 1024, and 1440px; include 320px for tight
layouts). Check centered alignment, text wrapping, page overflow, active links, keyboard
focus, and mobile menu access. Exercise any changed interaction.

Do not remove focus indicators. Respect reduced motion, retain one page-level heading,
and use links for navigation and buttons for actions. Keep the shared responsive menu;
choose its breakpoint based on available space rather than forcing all links onto a
narrow screen.

Report what was actually verified. A passing build is not a browser check. Offscreen
lazy-loaded images are not broken just because they have not loaded yet. The project
does not currently declare a test or lint script; check local tool availability before
claiming additional validation.
