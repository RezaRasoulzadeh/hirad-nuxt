import { createError, getCookie, getQuery } from 'h3'
import { getAnalyticsStats } from '../../utils/analyticsStore'

export default defineEventHandler(async (event) => {
  if (!getCookie(event, 'hirad_at')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const requestedRange = Number(query.range)
  const range = [7, 30, 90].includes(requestedRange) ? requestedRange : 7

  return {
    success: true,
    data: await getAnalyticsStats(range),
  }
})
