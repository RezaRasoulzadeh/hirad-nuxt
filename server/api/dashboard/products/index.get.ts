// server/api/dashboard/products/index.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryParam = query.category ? String(query.category) : ''

  if (!categoryParam) {
    return { success: true, data: [] }
  }

  const targetPath = `/products?category=${encodeURIComponent(categoryParam)}&sort=newest&only_active=false`

  try {
    const res = await authenticatedFetch(event, targetPath)
    
    if (!res.ok) {
      throw createError({
        statusCode: res.status,
        statusMessage: 'Failed to fetch products from backend'
      })
    }

    return await res.json()
  } catch (error: any) {
    console.error('[Products Backend Error]:', error)
    return { success: false, data: [] }
  }
})