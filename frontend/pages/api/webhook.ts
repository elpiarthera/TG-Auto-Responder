import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { cors, runMiddleware, rateLimiterMiddleware } from '@/shared/utils/middleware'
import { Telegraf } from 'telegraf'
import { supabase } from '@/backend/lib/supabaseClient'

// ... rest of the file content ...