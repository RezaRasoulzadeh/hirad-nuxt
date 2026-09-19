import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export interface AnalyticsDay {
  views: number
  visitors: string[]
  sessions: Record<string, AnalyticsSession>
  durationSeconds: number
  pages: Record<string, AnalyticsPage>
  devices: Record<string, number>
  referrers: Record<string, number>
}

export interface AnalyticsPage {
  views: number
  visitors: string[]
  durationSeconds: number
}

export interface AnalyticsSession {
  visitorId: string
  pageViews: number
  durationSeconds: number
}

interface ActiveView {
  date: string
  path: string
  visitorId: string
  sessionId: string
  durationSeconds: number
}

interface AnalyticsStore {
  version: 1
  days: Record<string, AnalyticsDay>
  activeViews: Record<string, ActiveView>
}

const emptyStore = (): AnalyticsStore => ({
  version: 1,
  days: {},
  activeViews: {},
})

const dataPath = () => process.env.HIRAD_ANALYTICS_PATH || resolve(process.cwd(), '.data/analytics.json')

let storePromise: Promise<AnalyticsStore> | null = null
let writeQueue = Promise.resolve()

async function readStore(): Promise<AnalyticsStore> {
  try {
    const raw = await readFile(dataPath(), 'utf8')
    const parsed = JSON.parse(raw) as Partial<AnalyticsStore>
    return {
      version: 1,
      days: parsed.days ?? {},
      activeViews: parsed.activeViews ?? {},
    }
  } catch {
    return emptyStore()
  }
}

async function getStore() {
  if (!storePromise) storePromise = readStore()
  return storePromise
}

async function persist(store: AnalyticsStore) {
  const path = dataPath()
  const temporaryPath = `${path}.tmp`
  await mkdir(dirname(path), { recursive: true })
  await writeFile(temporaryPath, JSON.stringify(store), 'utf8')
  await rename(temporaryPath, path)
}

function withWrite<T>(operation: (store: AnalyticsStore) => Promise<T> | T): Promise<T> {
  const result = writeQueue.then(async () => {
    const store = await getStore()
    const value = await operation(store)
    await persist(store)
    return value
  })

  writeQueue = result.then(() => undefined, () => undefined)
  return result
}

function addUnique(values: string[], value: string) {
  if (!values.includes(value)) values.push(value)
}

function getDay(store: AnalyticsStore, date: string): AnalyticsDay {
  return (store.days[date] ??= {
    views: 0,
    visitors: [],
    sessions: {},
    durationSeconds: 0,
    pages: {},
    devices: {},
    referrers: {},
  })
}

function getPage(day: AnalyticsDay, path: string): AnalyticsPage {
  return (day.pages[path] ??= { views: 0, visitors: [], durationSeconds: 0 })
}

function addDuration(day: AnalyticsDay, page: AnalyticsPage, seconds: number) {
  if (seconds <= 0) return
  day.durationSeconds += seconds
  page.durationSeconds += seconds
}

export async function recordPageView(input: {
  viewId: string
  date: string
  path: string
  visitorId: string
  sessionId: string
  device: string
  referrer: string
}) {
  return withWrite((store) => {
    const day = getDay(store, input.date)
    const page = getPage(day, input.path)

    day.views += 1
    page.views += 1
    addUnique(day.visitors, input.visitorId)
    addUnique(page.visitors, input.visitorId)
    day.sessions[input.sessionId] ??= { visitorId: input.visitorId, pageViews: 0, durationSeconds: 0 }
    day.sessions[input.sessionId].pageViews += 1
    day.devices[input.device] = (day.devices[input.device] ?? 0) + 1
    if (input.referrer) day.referrers[input.referrer] = (day.referrers[input.referrer] ?? 0) + 1

    store.activeViews[input.viewId] = {
      date: input.date,
      path: input.path,
      visitorId: input.visitorId,
      sessionId: input.sessionId,
      durationSeconds: 0,
    }

    const cutoff = Date.now() - 1000 * 60 * 60 * 2
    for (const [viewId, activeView] of Object.entries(store.activeViews)) {
      if (viewId !== input.viewId && activeView.date < new Date(cutoff).toISOString().slice(0, 10)) {
        delete store.activeViews[viewId]
      }
    }
  })
}

export async function recordDuration(viewId: string, durationSeconds: number, endView = false) {
  return withWrite((store) => {
    const activeView = store.activeViews[viewId]
    if (!activeView) return

    const duration = Math.max(0, Math.min(Math.round(durationSeconds), 86400))
    const delta = duration - activeView.durationSeconds
    const day = getDay(store, activeView.date)
    const page = getPage(day, activeView.path)
    const session = day.sessions[activeView.sessionId]

    addDuration(day, page, delta)
    if (session) session.durationSeconds += Math.max(0, delta)
    activeView.durationSeconds = Math.max(activeView.durationSeconds, duration)

    if (endView) delete store.activeViews[viewId]
  })
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function lastDates(days: number) {
  const result: string[] = []
  const today = new Date()
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - index)
    result.push(dateKey(date))
  }
  return result
}

export async function getAnalyticsStats(range: number) {
  const store = await getStore()
  const dates = lastDates(range)
  const days = dates.map((date) => ({ date, data: store.days[date] })).filter((item) => item.data)
  const visitors = new Set<string>()
  const sessions = new Map<string, AnalyticsSession>()
  const pages = new Map<string, AnalyticsPage>()
  const devices = new Map<string, number>()
  const referrers = new Map<string, number>()
  let pageViews = 0
  let durationSeconds = 0
  let bouncedSessions = 0

  for (const { data } of days) {
    if (!data) continue
    pageViews += data.views
    durationSeconds += data.durationSeconds
    data.visitors.forEach((visitor) => visitors.add(visitor))
    Object.entries(data.sessions).forEach(([sessionId, session]) => {
      const existing = sessions.get(sessionId)
      if (existing) {
        existing.pageViews += session.pageViews
        existing.durationSeconds += session.durationSeconds
      } else {
        sessions.set(sessionId, { ...session })
      }
    })
    Object.entries(data.pages).forEach(([path, page]) => {
      const existing = pages.get(path) ?? { views: 0, visitors: [], durationSeconds: 0 }
      existing.views += page.views
      existing.durationSeconds += page.durationSeconds
      page.visitors.forEach((visitor) => addUnique(existing.visitors, visitor))
      pages.set(path, existing)
    })
    Object.entries(data.devices).forEach(([device, count]) => devices.set(device, (devices.get(device) ?? 0) + count))
    Object.entries(data.referrers).forEach(([referrer, count]) => referrers.set(referrer, (referrers.get(referrer) ?? 0) + count))
  }

  sessions.forEach((session) => {
    if (session.pageViews === 1) bouncedSessions += 1
  })

  return {
    range,
    summary: {
      pageViews,
      uniqueVisitors: visitors.size,
      sessions: sessions.size,
      averageSessionDurationSeconds: sessions.size ? Math.round(durationSeconds / sessions.size) : 0,
      bounceRate: sessions.size ? Math.round((bouncedSessions / sessions.size) * 100) : 0,
    },
    daily: dates.map((date) => {
      const day = store.days[date]
      return {
        date,
        pageViews: day?.views ?? 0,
        uniqueVisitors: day?.visitors.length ?? 0,
        sessions: day ? Object.keys(day.sessions).length : 0,
      }
    }),
    topPages: [...pages.entries()]
      .map(([path, page]) => ({
        path,
        views: page.views,
        uniqueVisitors: page.visitors.length,
        averageDurationSeconds: page.views ? Math.round(page.durationSeconds / page.views) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
    devices: [...devices.entries()]
      .map(([name, views]) => ({ name, views, percentage: pageViews ? Math.round((views / pageViews) * 100) : 0 }))
      .sort((a, b) => b.views - a.views),
    referrers: [...referrers.entries()]
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6),
  }
}
