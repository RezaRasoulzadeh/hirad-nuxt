export default defineEventHandler(async (event) => {
  if (!getCookie(event, 'hirad_session')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const standards = await listStandardPages(event, false)
  return { success: true, data: standards, meta: { total: standards.length } }
})
