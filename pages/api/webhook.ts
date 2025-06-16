import type { NextApiRequest, NextApiResponse } from 'next';
// import { Telegraf } from 'telegraf'; // Original import, commented out
// import { supabase } from '@/lib/supabaseClient'; // Original import, commented out
// import { cors, runMiddleware, rateLimiterMiddleware } from '@/lib/middleware'; // These were from the old middleware.ts
// import { AppError, errorResponse } from '@/lib/utils/errors'; // Original error handling
// import { createRouter } from 'next-connect'; // Original router
import { logger } from '@/lib/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Review necessity and security of this webhook.
  // The original logic has been commented out due to middleware changes
  // and to prevent build failures. If this webhook is still required,
  // it needs to be refactored with appropriate authentication (e.g., Clerk for user-specific webhooks,
  // or a secret token for generic webhooks) and updated logic.

  /*
  // Original handler logic (example, adapt to actual original logic):
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)

  const router = createRouter<NextApiRequest, NextApiResponse>()

  router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
    // await runMiddleware(req, res, cors) // Old middleware
    // if (await rateLimiterMiddleware(req, res)) { // Old middleware
    //   next()
    // }
    next(); // Placeholder if middleware was essential for structure
  })

  router.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { message } = req.body

      if (message && message.text) {
        // const { data: settings, error } = await supabase // Original supabase client
        //   .from('user_settings')
        //   .select('message_template')
        //   .eq('user_id', message.from.id) // This ID type would need to match new schema
        //   .single()

        // if (error) {
        //   throw new AppError(500, 'Error fetching user settings')
        // }

        // if (settings && settings.message_template) {
        //   await bot.telegram.sendMessage(message.chat.id, settings.message_template)
        // }
      }

      res.status(200).json({ ok: true })
    } catch (error) {
      // errorResponse(res, error as Error | AppError) // Original error handling
      logger.error("/api/webhook: Error in original logic (now commented):", error);
      res.status(500).json({ error: "Internal server error in original logic."});
    }
  })

  // router(req, res); // This would execute the next-connect router
  */

  logger.info('/api/webhook: Received call, currently placeholder.');
  res.status(200).json({ message: 'Webhook received (placeholder response)' });
}
