import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { cors, runMiddleware, rateLimiterMiddleware } from '@/lib/middleware'
import { Telegraf } from 'telegraf'
import { supabase } from '@/lib/supabaseClient'

// ... rest of the file content ...