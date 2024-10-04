import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { cors, runMiddleware, rateLimiterMiddleware } from '../../lib/middleware'
import { supabase } from '../../lib/supabaseClient'

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(async (req, res, next) => {
    await runMiddleware(req, res, cors)
    if (await rateLimiterMiddleware(req, res)) {
      next()
    }
  })
  .get(async (_, res) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  })
  .post(async (req, res) => {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(req.body)
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  })

export default handler
