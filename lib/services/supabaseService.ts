import { createClient } from '@supabase/supabase-js'
import winston from 'winston'
import { TelegramUserData, UserSettings } from '@/types/userSettings'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'supabase-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

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

export async function handleTelegramUserData(userData: TelegramUserData) {
  try {
    // Store or update user in Supabase
    const { error: userError } = await supabase
      .from('users')
      .upsert(userData)

    if (userError) throw new Error(`Error storing user: ${userError.message}`)

    // Create or update user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userData.id,
        is_responder_active: false, // default value
        message_template: '', // default value
      })

    if (settingsError) throw new Error(`Error storing user settings: ${settingsError.message}`)

  } catch (error) {
    logger.error('Error handling Telegram user data:', error)
    throw error
  }
}