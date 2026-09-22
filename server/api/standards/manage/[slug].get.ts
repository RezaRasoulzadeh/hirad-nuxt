export default defineEventHandler(async (event) => {
  if (!getCookie(event, 'hirad_session')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const slug = assertPublicStandardSlug(getRouterParam(event, 'slug'))
  const standard = await getStandardPage(event, slug, false)
  if (!standard) throw createError({ statusCode: 404, statusMessage: 'Standard not found' })
  return { success: true, data: standard }
})
