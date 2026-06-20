// server/api/dashboard/stats.get.ts
import { authenticatedFetch } from '../../utils/authenticatedFetch'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const res = await authenticatedFetch(event, '/dashboard-stats')

    if (!res.ok) {
      const text = await res.text()
      let data: any

      try {
        data = JSON.parse(text)
      } catch {
        throw createError({
          statusCode: res.status || 500,
          message: `Backend error: ${text.substring(0, 200)}`
        })
      }

      throw createError({
        statusCode: res.status,
        message: data?.message || 'Dashboard stats failed'
      })
    }

    return await res.json()

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Dashboard stats error'
    })
  }
})