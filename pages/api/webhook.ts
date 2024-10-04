import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { cors, runMiddleware, rateLimiterMiddleware } from '../../lib/middleware'
import { Telegraf } from 'telegraf'
import { supabase } from '../../lib/supabaseClient'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(async (req, res, next) => {
    await runMiddleware(req, res, cors)
    if (await rateLimiterMiddleware(req, res)) {
      next()
    }
  })
  .post(async (req, res) => {
    const { message } = req.body

    if (message && message.text) {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('message_template')
        .eq('user_id', message.from.id)
        .single()

      if (error) {
        console.error('Error fetching user settings:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
      }

      if (settings && settings.message_template) {
        await bot.telegram.sendMessage(message.chat.id, settings.message_template)
      }
    }

    res.status(200).json({ ok: true })
  })

export default handler
