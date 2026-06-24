# Project Context: Hirad Nuxt

Industrial valve and equipment engineering platform (B2B/Catalog) built using Nuxt 3 with a full-stack architecture (frontend public pages and backend Nitro-based proxy/dashboard routes).

## 1. System Architecture & Tech Stack
- **Framework:** Nuxt 3 (Compatibility Version 4 enabled, `compatibilityDate: '2026-06-13'`)
- **Rendering Engine:** Server-Side Rendering (SSR) by default.
  - Public data fetched efficiently via `callOnce` (e.g., layout categories data) or aggregated inside multi-endpoint parallel buffers using `useAsyncData` on page initialization.
  - Hybrid routing exception: `/flipHTML/**` operates with SSR disabled (`ssr: false, static: true`).
- **Language:** TypeScript
- **State/Logic:** Custom atomic Composables (`/composables`) instead of bloated centralized state stores.
- **Styling Architecture:** 
  - Tailwind CSS v4 pipeline initialized using `@tailwindcss/postcss` through Vite.
  - DaisyUI plugin engine loaded with explicit custom color profiles.
  - Typography: LTR-fallback optimized Persian font-face wrapper via `'Vazirmatn'`.
- **UI & Components:** Built using specialized responsive layout drawers, `lucide-vue-next` for dashboards, and a standard CSS layer optimization configuration.
- **Localization & Theme Sync:**
  - Standard RTL layout (`dir: 'rtl'`, `lang: 'fa'`).
  - Pre-render inline validation blocker script executing at absolute baseline priority (`tagPriority: -20`) syncing user preferences across system environments and `localStorage` to avoid flash of unstyled content (FOUC).

---

## 2. Global Styling & Theme Parameters (`main.css`)

### 2.1 Color & Branding Tokens
| Token | Light Theme (`#9d2138` Base) | Dark Theme (`#c7134c` Base) |
|---|---|---|
| `--color-primary` | `#9d2138` (Deep Crimson) | `#c7134c` (Vibrant Crimson) |
| `--color-base-100` | `oklch(100% 0 0)` | `oklch(25.33% 0.016 252.42)` |
| `--color-base-200` | `oklch(98% 0 0)` | `oklch(23.26% 0.014 253.1)` |
| `--color-base-300` | `oklch(95% 0 0)` | `oklch(21.15% 0.012 254.09)` |
| `--color-base-content`| `oklch(21% 0.006 285.885)` | `oklch(97.807% 0.029 256.847)` |

### 2.2 UI System Defaults
- Focus indicators reset via clean transitions (`transition: all 0.2s ease`).
- Input wrappers, dropdown containers, and textareas feature standardized edge geometry values (`--radius-field: 0.75rem` light, downscaled to `0.5rem` dark).

---

## 3. Core Page Topography & Flow

### 3.1 Public Pipeline Layout (`layouts/default.vue`)
- Wraps application state inside a mobile-responsive bottom drawer container.
- Layout categories are loaded globally via unified proxy calls on server startup, minimizing network hops.
- Includes global state tools: `GlobalToast` alert arrays and sticky communication vectors (`FloatingContact`).

### 3.2 Dashboard Framework (`layouts/dashboard.vue`)
- Dual navigation: Sticky persistent multi-tier sidebar layout tailored for large displays (`lg:drawer-open`), accompanied by an ergonomic bottom actions dock on mobile devices.
- Functional nodes:
  - **`داشبورد` (`/dashboard`)**: Analytics tracking dashboard.
  - **`دسته‌بندی` (`/dashboard/categories`)**: Technical hierarchy structure tree editor.
  - **`محصولات` (`/dashboard/products`)**: Content operations desk.
  - **`مدیریت رسانه` (`/dashboard/media`)**: Asset management area.
  - **`بلاگ` / `پیام‌ها` / `خبرنامه`**: Content management modules.

### 3.3 Target Home Page Module (`pages/index.vue`)
Compiles asynchronous operations for metadata construction (`useSeoMeta`), rendering views down through several modular layout blocks:
1. `HeroSection` (Equipped with physical hot-spot markers)
2. `OrderProcess` (B2B pipeline lifecycle steps)
3. `AboutSection` (Company overview)
4. `Catalogue` (Technical documentation downloads)
5. `CertificateCarousel` (Verified legal and quality assurances)
6. `Subscription` (Lead collection block)
7. `BrandPromises` (Service level guarantees)

---

## 4. Key Implementation Patterns
- **Explicit API Proxying:** Client context maps to local Nitro endpoints through `useRuntimeConfig().public.apiBase` (`/api`). Nitro uses server-only `BACKEND_URL` internally and appends `/api` when forwarding requests to the backend.
- **SEO & Social Graphs:** Multi-tier fallback mapping (`ogTitle`, `twitterDescription`) driven by server-resolved content payloads.

---

## 5. VPS Build & Update Runbook

Use this flow for future production updates. The Nuxt app listens on port `4000`, nginx proxies port `80` to it, and the backend API is expected on `http://127.0.0.1:3000/api`.

### 5.1 Build and Upload from Local Machine
```bash
npm install
npm run build
zip -r hirad-build.zip .output
scp -P 9011 hirad-build.zip root@87.107.146.141:/var/www/hirad-nuxt/
```

### 5.2 Deploy on VPS
```bash
ssh -p 9011 root@87.107.146.141
cd /var/www/hirad-nuxt

sudo fuser -k 4000/tcp
unzip -o hirad-build.zip

PORT=4000 HOST=0.0.0.0 BACKEND_URL=http://127.0.0.1:3000 COOKIE_SECURE=false nohup node .output/server/index.mjs > hirad.log 2>&1 &
```

`BACKEND_URL` must be the backend root without `/api`; Nuxt appends `/api` through `internalApiBase`.

`COOKIE_SECURE=false` is required while serving the site over plain HTTP. If the VPS is later moved behind HTTPS, remove it or set `COOKIE_SECURE=true`.

### 5.3 Verify App and Nginx
```bash
sudo ss -tulpn | grep :4000
tail -f hirad.log

sudo nginx -t
sudo systemctl reload nginx
```

After deployment, clear browser cookies for `87.107.146.141`, log in again, and confirm DevTools shows:

```text
hirad_session=1
```

### 5.4 Optional PM2 Runner
```bash
sudo fuser -k 4000/tcp
PORT=4000 HOST=0.0.0.0 BACKEND_URL=http://127.0.0.1:3000 COOKIE_SECURE=false pm2 start .output/server/index.mjs --name hirad-nuxt
pm2 save
```

For later PM2 updates:

```bash
cd /var/www/hirad-nuxt
unzip -o hirad-build.zip
PORT=4000 HOST=0.0.0.0 BACKEND_URL=http://127.0.0.1:3000 COOKIE_SECURE=false pm2 restart hirad-nuxt --update-env
```
