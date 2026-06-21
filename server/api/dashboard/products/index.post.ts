// server/api/dashboard/products/index.post.ts
import { defineEventHandler, createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const res = await authenticatedFetch(event, '/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Backend Validation Reject]:', errText)
      throw createError({ 
        statusCode: res.status, 
        statusMessage: 'Backend rejected product structure' 
      })
    }

    return await res.json()
  } catch (error: any) {
    console.error('[Nitro Product POST Error]:', error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Internal configuration save fault' 
    })
  }
})