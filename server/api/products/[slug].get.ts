// server/api/dashboard/products/[slug].get.ts
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product slug parameter is missing'
    })
  }

  // Proxy directly to your backend endpoint using your authenticated wrapper
  const targetPath = `/products/${encodeURIComponent(slug)}`

  try {
    const res = await authenticatedFetch(event, targetPath)
    
    if (!res.ok) {
      throw createError({
        statusCode: res.status,
        statusMessage: `Failed to fetch product from backend: ${res.statusText}`
      })
    }

    return await res.json()
  } catch (error: any) {
    console.error(`[Product Single GET Error for ${slug}]:`, error)
    return { 
      success: false, 
      data: null, 
      message: error.statusMessage || 'Internal proxy service failure fetching single product view context' 
    }
  }
})