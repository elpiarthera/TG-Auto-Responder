import { createClient } from '@supabase/supabase-js'
import { TelegramUserData, UserSettings } from '@/types/userSettings'
import { logger } from '../utils/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getUserSettings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    logger.error('Error fetching user settings:', error)
    throw new Error('Failed to fetch user settings')
  }
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ user_id: userId, ...settings })
      .select()

    if (error) throw error

    return data
  } catch (error) {
    logger.error('Error updating user settings:', error)
    throw new Error('Failed to update user settings')
  }
}