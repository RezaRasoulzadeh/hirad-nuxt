import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product slug parameter is missing'
    })
  }

  const targetPath = `/products/${encodeURIComponent(slug)}`

  try {
    const res = await authenticatedFetch(event, targetPath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    if (!res.ok) {
      throw createError({ 
        statusCode: res.status, 
        statusMessage: 'Failed to update product on backend' 
      })
    }

    return await res.json()
  } catch (error: any) {
    console.error(`[Nitro Product PUT Error for ${slug}]:`, error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Internal server error updating product data' 
    })
  }
})