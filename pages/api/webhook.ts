import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import { cors, runMiddleware, rateLimiterMiddleware } from '@/lib/middleware'
import { Telegraf } from 'telegraf'
import { supabase } from '@/lib/supabaseClient'
import { AppError, errorResponse } from '@/lib/utils/errors'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)

const handler = createRouter<NextApiRequest, NextApiResponse>()

handler.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  await runMiddleware(req, res, cors)
  if (await rateLimiterMiddleware(req, res)) {
    next()
  }
})

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { message } = req.body

    if (message && message.text) {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('message_template')
        .eq('user_id', message.from.id)
        .single()

      if (error) {
        throw new AppError(500, 'Error fetching user settings')
      }

      if (settings && settings.message_template) {
        await bot.telegram.sendMessage(message.chat.id, settings.message_template)
      }
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    errorResponse(res, error as Error | AppError)
  }
})

export default handler
