export default defineEventHandler(async (event) => {
  const slug = assertPublicStandardSlug(getRouterParam(event, 'slug'))
  const standard = await getStandardPage(event, slug, true)
  if (!standard) {
    throw createError({ statusCode: 404, statusMessage: 'Standard not found' })
  }
  return { success: true, data: toPublicStandard(standard) }
})
