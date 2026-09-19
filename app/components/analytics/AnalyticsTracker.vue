<script setup lang="ts">
const router = useRouter()

const storageKeys = {
  visitor: 'hirad-analytics-visitor',
  session: 'hirad-analytics-session',
}

let visitorId = ''
let sessionId = ''
let currentViewId = ''
let currentPath = ''
let activeMilliseconds = 0
let lastActiveAt = 0
let isActive = true
let hasEnded = false
let heartbeatTimer: ReturnType<typeof setInterval> | undefined

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`

function post(payload: Record<string, unknown>, keepalive = false) {
  const body = JSON.stringify(payload)
  if (keepalive && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/collect', new Blob([body], { type: 'application/json' }))
    return
  }

  $fetch('/api/analytics/collect', {
    method: 'POST',
    body: payload,
  }).catch(() => undefined)
}

function elapsedSeconds() {
  let total = activeMilliseconds
  if (isActive && lastActiveAt) total += Date.now() - lastActiveAt
  return Math.max(0, Math.round(total / 1000))
}

function checkpoint(endView = false, keepalive = false) {
  if (!currentViewId) return
  if (isActive && lastActiveAt) {
    activeMilliseconds += Date.now() - lastActiveAt
    lastActiveAt = Date.now()
  }

  post({
    event: endView ? 'session_end' : 'duration',
    view_id: currentViewId,
    session_id: sessionId,
    duration_seconds: Math.round(activeMilliseconds / 1000),
  }, keepalive)

  if (endView) hasEnded = true
}

function beginPage(path: string) {
  currentPath = path.split('?')[0] || '/'
  currentViewId = createId()
  activeMilliseconds = 0
  lastActiveAt = Date.now()
  isActive = true
  hasEnded = false

  post({
    event: 'pageview',
    view_id: currentViewId,
    visitor_id: visitorId,
    session_id: sessionId,
    path: currentPath,
  })
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    checkpoint(false, true)
    isActive = false
    return
  }

  if (!isActive) {
    isActive = true
    lastActiveAt = Date.now()
  }
}

onMounted(() => {
  visitorId = localStorage.getItem(storageKeys.visitor) || createId()
  sessionId = sessionStorage.getItem(storageKeys.session) || createId()
  localStorage.setItem(storageKeys.visitor, visitorId)
  sessionStorage.setItem(storageKeys.session, sessionId)

  beginPage(router.currentRoute.value.fullPath)
  heartbeatTimer = setInterval(() => checkpoint(), 30000)
  router.afterEach((to) => {
    if (!hasEnded) checkpoint(true)
    beginPage(to.fullPath)
  })
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('pagehide', () => checkpoint(true, true), { once: true })
})

onBeforeUnmount(() => {
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  if (!hasEnded) checkpoint(true)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <span class="hidden" aria-hidden="true">{{ currentPath }}{{ elapsedSeconds() }}</span>
</template>
