export default defineEventHandler(async (event) => {
  const slug = assertPublicStandardSlug(getRouterParam(event, 'slug'))
  const draft = validatedStandardBody(await readBody(event))
  const response = await updateStandardPage(event, slug, draft)
  return { ...response, message: 'استاندارد با موفقیت بروزرسانی شد.' }
})
