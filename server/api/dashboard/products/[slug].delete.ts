// server/api/dashboard/products/[slug].delete.ts
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const productSlug = event.context.params?.slug

  if (!productSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug is required' })
  }

  const res = await authenticatedFetch(event, `/products/${productSlug}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: 'Failed to delete the selected product'
    })
  }

  return { success: true }
})