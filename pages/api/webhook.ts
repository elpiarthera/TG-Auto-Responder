import type { NextApiRequest, NextApiResponse } from 'next';
// import { Telegraf } from 'telegraf'; // Original import, commented out
// import { supabase } from '@/lib/supabaseClient'; // Original import, commented out
// import { cors, runMiddleware, rateLimiterMiddleware } from '@/lib/middleware'; // These were from the old middleware.ts
// import { AppError, errorResponse } from '@/lib/utils/errors'; // Original error handling
// Imports that were only for the commented out block and are now truly unused can be removed.
// For example, if Telegraf and supabaseClient were only for the old logic.
// Keep `logger` as it's used.
import { logger } from '@/lib/utils/logger';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // TODO: Review necessity and security of this webhook.
  // The original logic has been commented out due to middleware changes
  // and to prevent build failures. If this webhook is still required,
  // it needs to be refactored with appropriate authentication (e.g., Clerk for user-specific webhooks,
  // or a secret token for generic webhooks) and updated logic.

  logger.info('/api/webhook: Received call, currently placeholder.');
  res.status(200).json({ message: 'Webhook received (placeholder response)' });
}
