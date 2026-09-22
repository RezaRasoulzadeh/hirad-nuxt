export default defineEventHandler(async (event) => {
  const slug = assertPublicStandardSlug(getRouterParam(event, 'slug'))
  const response = await deleteStandardPage(event, slug)
  return { ...response, message: 'استاندارد با موفقیت حذف شد.' }
})
