
---

**Project: Hirad — Nuxt 3 SSR migration, dashboard pages**

Stack: Nuxt 3 (srcDir layout, `app/` for frontend, `server/` at root), TypeScript, DaisyUI v5, RTL Persian UI, backend is a separate Rust/Axum API.

**Auth is fully working — BFF pattern, finalized state:**

Cookies (all `httpOnly` except `hirad_session`):
- `hirad_at` — access token, 15 min
- `refresh_token` — refresh token, 30 days, **same name as the backend's own cookie** (no rename layer)
- `hirad_session` — JS-readable flag (`'1'`), no real token, just gates middleware

Token transport rule: tokens travel only in JSON response bodies between Rust backend ↔ Nuxt server (`{ data: { access_token, refresh_token } }`). Never rely on `Set-Cookie` header forwarding from the backend — Node's `fetch`/undici (`response.headers.getSetCookie()`) was found unreliable for relaying rotated cookies on localhost/server-to-server calls. Both Rust login and refresh handlers already return `refresh_token` in their JSON body.

`refresh_token` is never echoed back to the browser in any Nuxt API response — routes return explicit field lists (`{ success, data: { access_token } }`, `{ success, user }`), never `return body` or a spread.

Refresh token rotation is single-use (Rust revokes old, issues new on every `/refresh` call). Refresh logic lives in a shared function, not behind an internal `$fetch` HTTP hop, because internal calls create a separate nested event — `setCookie()` inside a nested call never reaches the real browser-facing response. Current structure:
- `server/utils/refreshAuth.ts` — `performRefresh(event)`, sets all cookies directly on the passed event, returns new access token or `null`
- `server/api/auth/refresh.post.ts` — thin wrapper calling `performRefresh(event)`
- `server/utils/authenticatedFetch.ts` — calls `performRefresh(event)` directly as a function (not via internal `$fetch`)
- `server/api/auth/login.post.ts` — sets cookies from backend JSON fields explicitly, returns only non-token user fields

`app/middleware/auth.global.ts` (current, decided version — using direct `$fetch` with `credentials: 'include'`, not `useRequestFetch`):
```typescript
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const sessionFlag = useCookie('hirad_session')
  if (!sessionFlag.value) {
    return navigateTo('/login')
  }

  try {
    await $fetch('/api/dashboard/stats', { credentials: 'include' })
  } catch (error: any) {
    if ([401, 403].includes(error.statusCode)) {
      try {
        await $fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        await $fetch('/api/dashboard/stats', { credentials: 'include' })
      } catch {
        return navigateTo('/login')
      }
    } else {
      return navigateTo('/login')
    }
  }
})
```

**Next task: building out dashboard pages.** Will share existing files/components as needed per page. Backend API base: `useRuntimeConfig().public.apiBase` → `http://localhost:3000/api`. Dev ports: Nuxt `:4000`, backend `:3000`.

---

