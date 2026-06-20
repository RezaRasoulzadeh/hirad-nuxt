// server/api/auth/refresh.post.ts
import { performRefresh } from '../../utils/refreshAuth'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const token = await performRefresh(event)
  if (!token) throw createError({ statusCode: 401, message: 'Refresh failed' })
  return { success: true, data: { access_token: token } }
})