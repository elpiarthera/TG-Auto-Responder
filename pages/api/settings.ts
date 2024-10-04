import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import { cors, runMiddleware, rateLimiterMiddleware } from '@/lib/middleware'
import { AppError, errorResponse } from '@/lib/utils/errors'
import { getUserSettings, updateUserSettings } from '@/lib/services/supabaseService'

const UserSettingsSchema = z.object({
  user_id: z.string().uuid(),
  is_responder_active: z.boolean(),
  message_template: z.string().max(1000)
})

const handler = createRouter<NextApiRequest, NextApiResponse>()

handler.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  await runMiddleware(req, res, cors)
  if (await rateLimiterMiddleware(req, res)) {
    next()
  }
})

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.query.userId as string
    if (!userId) throw new AppError(400, 'User ID is required')

    const data = await getUserSettings(userId)
    res.status(200).json(data)
  } catch (error) {
    errorResponse(res, error as Error | AppError)
  }
})

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const validatedData = UserSettingsSchema.parse(req.body)
    const data = await updateUserSettings(validatedData.user_id, validatedData)
    res.status(200).json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      errorResponse(res, new AppError(400, 'Invalid input data'))
    } else {
      errorResponse(res, error as Error | AppError)
    }
  }
})

export default handler
