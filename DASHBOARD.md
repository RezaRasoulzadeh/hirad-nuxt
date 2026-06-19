PROJECT CONTEXT — Hirad dashboard migration to Nuxt SSR + DaisyUI (continued)

Migrating an old Vue 3 SPA admin dashboard into Nuxt 3 SSR + TypeScript +
DaisyUI v5, inside the existing Hirad project (same codebase, not separate).

STACK: Nuxt 3 SSR (Nuxt 4-style structure — see below), TypeScript,
DaisyUI v5, Vazirmatn font, RTL Persian UI, Lucide icons (lucide-vue-next),
pages/ dir routing, auto-imports, Composition API only (script setup).

IMPORTANT — PROJECT STRUCTURE (Nuxt 4 srcDir convention):
- Frontend concerns live under app/: app/pages/, app/components/,
  app/composables/, app/layouts/, app/middleware/, app/plugins/, app/assets/
- server/ (Nitro) and public/ stay at PROJECT ROOT, sibling to app/ and
  nuxt.config.ts — NOT inside app/. This caused a real bug already (see
  "bugs fixed" below) — don't repeat the mistake when creating new
  server/api or server/utils files.
- Image paths confirmed working as /assets/Logo-Dark.png etc (served from
  public/ or app/assets via Nuxt's asset handling — already working in
  login page).

THEME TOKENS (Hirad):
- Light: primary #9d2138, base-100 oklch(100%), base-200 oklch(98%),
  base-300 oklch(95%), radius-box 1rem, radius-selector/field 0.75rem
- Dark ([data-theme="dark"]): primary #c7134c,
  base-100 oklch(25.33% 0.016 252.42), base-200 oklch(23.26% 0.014 253.1),
  base-300 oklch(21.15% 0.012 254.09), radius-selector/field 0.5rem
- Both: border 1px, depth 0, noise 0

CONVENTIONS: null-guard everything, NuxtLink not RouterLink, inline Persian
text (no i18n keys), Persian numerals via toFaDigits/toLocaleString('fa-IR'),
minimal comments (filename + section separators only), DaisyUI theme tokens
over hardcoded Tailwind colors, container mx-auto px-4 lg:px-0, API base via
useRuntimeConfig().public.apiBase (default http://localhost:3000/api).
ALWAYS show actual file contents before I write code depending on their
shape — don't guess at API responses or import paths.

DEV PORTS: Nuxt dev server runs on :4000 (not default :3000). Real backend
API runs on :3000 (http://localhost:3000/api).

EXISTING LAYOUT: layouts/default.vue (public site) — checkbox-based DaisyUI
drawer, LayoutHeader, LayoutFooter, LayoutDrawer, GlobalToast,
FloatingContact, RTL root div. Dashboard needs its OWN separate layout.

EXISTING COMPOSABLES: useContact, useToast, useCategories, useCategoryTree,
useCategoryPage, useProductList, useProduct, useSearch, useAboutCompany,
useHomePage, useCertificates, useAuth (see below).

=== AUTH FOUNDATION — BUILT AND WORKING ===

Real backend (unchanged, fixed shape), confirmed via curl:
- POST /login { identifier, password } → on success: { data: { access_token,
  user? } }, sets a refresh_token cookie itself. On failure: 401
  {"code":401,"success":false,"message":"Invalid credentials"} for wrong
  password, OR 406 for password-format validation issues (e.g. missing
  uppercase/special char) — 406 should be treated as generic auth failure on
  our end, not surfaced as a policy hint to the user.
- POST /refresh (credentials: include) → { data: { access_token } }
- POST /logout

Architecture: BFF pattern. Browser never sees real tokens. Nuxt server
re-issues its own httpOnly cookies on top of the backend's response.

Files written and working (at PROJECT ROOT under server/, not app/server/):
- server/utils/cookies.ts — AUTH_COOKIE='hirad_at', REFRESH_COOKIE='hirad_rt',
  SESSION_FLAG_COOKIE='hirad_session' (non-sensitive, JS-readable, drives UI
  only), extractSetCookieValue() helper
- server/utils/authErrors.ts — mapLoginErrorMessage(status, backendMessage)
  maps backend status codes to generic Persian messages (401/406 both →
  "ایمیل یا رمز عبور اشتباه است", etc.) — added to avoid leaking backend
  password-policy details and to avoid putting Persian text in
  createError's statusMessage (Node enforces ASCII there; Persian must go
  in createError's `message` field instead, which is just JSON body)
- server/utils/backendAuth.ts — loginUpstream() [wraps fetch in try/catch
  for network failures, uses mapLoginErrorMessage for non-2xx responses],
  refreshUpstream() — talk to real API only, never exposed to client
- server/api/auth/login.post.ts — calls loginUpstream, sets hirad_at (httpOnly,
  15min), hirad_rt (httpOnly, 30d), hirad_session (readable flag, 30d).
  Error throws use message field (Persian) not statusMessage (ASCII-only)
- server/api/auth/logout.post.ts — best-effort upstream logout, clears all 3
  cookies
- server/utils/authenticatedFetch.ts — wraps every future dashboard API call;
  reads hirad_at cookie, attaches Authorization header, auto-refreshes via
  refreshUpstream() on 401, re-sets cookie, retries once
- app/composables/useAuth.ts — exposes user (useState), isLoggedIn (computed
  from hirad_session cookie), login(), logout()
- app/middleware/auth.global.ts — redirects to /login if hitting /dashboard/*
  without hirad_session cookie
- app/pages/login/index.vue — DaisyUI card form, layout: false, logo
  (light/dark variants), password show/hide toggle, calls useAuth().login(),
  toast.success on success, error handling reads err?.data?.message first
  (then statusMessage, then err.message) since server now sends Persian via
  `message` field

BUGS FOUND AND FIXED ALONG THE WAY:
1. Regex capture group TS strict-mode error in extractSetCookieValue —
   fixed via match?.[1] + intermediate `value` variable instead of
   match[1] directly.
2. server/ directory didn't exist on disk at all yet (project uses Nuxt 4
   app/ srcDir convention) — initial assumption was that server/ should go
   inside app/. Resolved: server/ stays at project root, sibling to app/,
   nuxt.config.ts, public/. Once created at the correct path and dev server
   restarted, routes worked.
3. Persian text in createError's statusMessage would throw ERR_INVALID_CHAR
   at runtime (Node enforces ASCII on HTTP reason phrases) — fixed by moving
   all Persian user-facing text to createError's `message` field instead.

KNOWN GAP (not built yet, intentionally deferred): no /api/auth/me + plugin
to repopulate `user` object after a hard page reload. isLoggedIn still works
correctly (cookie-based), but user.name/email will be null until a fresh
login in the current session.

=== OLD DASHBOARD — STRUCTURE TO PORT (not started yet) ===

Old stack: Vue 3 SPA, vue-router, vue-i18n ($t), vue3-toastify, Tailwind
(brand colors), lucide-vue-next icons.

Old layout shown (header w/ mobile hamburger + Breadcrumbs + profile button,
collapsible JS-driven sidebar w/ resize listener, nav array: داشبورد,
دسته‌بندی محصولات, محصولات, مدیریت رسانه, بلاگ, پیام‌ها, خبرنامه, تنظیمات,
logout button) — not yet ported to layouts/dashboard.vue. This is the
immediate next piece of layout work.

Old component tree (src/components/Dashboard/) to migrate:
- Breadcrumbs.vue, DashboardCard.vue, DashboardScreen.vue, SettingsScreen.vue,
  Subscribers.vue
- Blog/ — BlogEditor.vue, BlogList.vue, BlogPreview.vue
- Category/ — CategoriesList.vue, CategoryCreateModal.vue,
  CategoryEditModal.vue, CategoryItem.vue, CategoryPageEditorModal.vue,
  CategoryParentGroup.vue
- FormSubmission/ — InboxPage.vue, MessageModal.vue
- MediaAsset/ — MediaAssetPage.vue, MediaEditModal.vue, MediaPreviewModal.vue,
  MediaSelector.vue, MediaUploadModal.vue
- Product/ — FeaturesSection.vue, ProductCategoryChild.vue,
  ProductCategoryParent.vue, ProductEdit.vue, ProductImageGalleryEditor.vue,
  ProductLongDes.vue, ProductManagement.vue

NEXT STEP (where we left off, in progress): building app/pages/dashboard/
index.vue (main dashboard home page with stat cards) + app/layouts/
dashboard.vue (header/sidebar shell). A real stats endpoint exists on the
backend for this (counts of products/categories/messages/subscribers) —
route + response shape not yet provided. Still need from Reza, in this order:
1. The stats endpoint route + sample response shape (curl/Postman style)
2. DashboardCard.vue (old component — stat card display)
3. Breadcrumbs.vue (old component — used in header)
Once those three are provided, build app/layouts/dashboard.vue and
app/pages/dashboard/index.vue together.

TASK FOR THIS CHAT: get those three remaining files, build the dashboard
layout shell + main page, then continue migrating feature sections one at a
time (Category first is reasonable — useCategories/useCategoryTree
composables already exist on the public side and may be reusable/adaptable).
Always ask for old component file content before porting each one.