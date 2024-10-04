import { createClient } from '@supabase/supabase-js'
import { TelegramUserData } from '@/types/userSettings'
import { verifyTelegramHash } from './index'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function verifyAndStoreUserData(
  userData: Record<string, string>,
  hash: string
): Promise<TelegramUserData | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    logger.error("Server configuration error: Missing bot token")
    throw new Error("Server configuration error: Missing bot token")
  }

  if (!verifyTelegramHash(userData, hash, botToken)) {
    logger.warn("Telegram hash verification failed")
    return null
  }

  const telegramUserData: TelegramUserData = {
    id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    username: userData.username,
    photo_url: userData.photo_url,
  }

  try {
    // Store user data in Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: telegramUserData.id,
        first_name: telegramUserData.first_name,
        last_name: telegramUserData.last_name,
        username: telegramUserData.username,
        photo_url: telegramUserData.photo_url,
      })
      .select()

    if (userError) {
      logger.error('Error storing user data:', userError)
      throw new Error('Failed to store user data')
    }

    if (userData) {
      logger.info(`User data ${userData.length > 0 ? 'updated' : 'inserted'} successfully`)
    }

    // Create or update user settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: telegramUserData.id,
        is_responder_active: false, // default value
        message_template: "", // default value
      })
      .select()

    if (settingsError) {
      logger.error('Error storing user settings:', settingsError)
      throw new Error('Failed to store user settings')
    }

    if (settingsData) {
      logger.info(`User settings ${settingsData.length > 0 ? 'updated' : 'inserted'} successfully`)
    }

    return telegramUserData
  } catch (error) {
    logger.error('Unexpected error in verifyAndStoreUserData:', error)
    throw error
  }
}