export default defineEventHandler(async (event) => {
  const standards = await listStandardPages(event, true)
  return {
    success: true,
    data: standards.map(toPublicStandard),
    meta: { total: standards.length },
  }
})
