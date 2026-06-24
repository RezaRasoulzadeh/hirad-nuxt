// server/api/dashboard/products/duplicate/[slug].post.ts
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product slug parameter is missing'
    })
  }

  try {
    // 1. Fetch the existing product details from backend
    const getRes = await authenticatedFetch(event, `/products/${encodeURIComponent(slug)}`)
    if (!getRes.ok) {
      throw createError({ statusCode: getRes.status, statusMessage: 'Original product not found' })
    }
    const originPayload = await getRes.json()
    const productData = originPayload.data

    if (!productData) {
      return { success: false, data: null }
    }

    // 2. Sanitize and update specific payload configurations to prevent DB collisions
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4)
    
    // Create safe variations for unique keys
    productData.slug = `${productData.slug}-copy-${timestamp}`
    productData.name = `${productData.name} (Copy)`
    
    if (productData.short_description) {
      productData.short_description.name_fa = `${productData.short_description.name_fa || productData.name || ''} (کپی)`
    }

    // Strip primary keys out of database-bound object tree arrays
    delete productData.id
    if (productData.short_description) delete productData.short_description.id

    // 3. Post sanitized data payload as a new product profile
    const postRes = await authenticatedFetch(event, '/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })

    if (!postRes.ok) {
      const errText = await postRes.text()
      console.error('[Duplicate Validation Rejection Backend Input]:', errText)
      throw createError({ statusCode: postRes.status, statusMessage: 'Backend rejected duplicated payload structural layout' })
    }

    return await postRes.json()
  } catch (error: any) {
    console.error(`[Product Duplication Pipeline Failure for ${slug}]:`, error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal configuration save fault duplicating item record template'
    })
  }
})