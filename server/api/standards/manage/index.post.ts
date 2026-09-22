export default defineEventHandler(async (event) => {
  const draft = validatedStandardBody(await readBody(event))
  const response = await createStandardPage(event, draft)
  return { ...response, message: 'استاندارد با موفقیت ایجاد شد.' }
})
