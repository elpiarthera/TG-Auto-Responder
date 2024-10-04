import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

/**
 * Supabase client instance.
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Fetches user settings from Supabase.
 * @param {string} userId - The ID of the user whose settings are being fetched.
 * @returns {Promise<object>} The user's settings.
 * @throws {Error} If there's an error fetching the settings.
 */
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

/**
 * Updates user settings in Supabase.
 * @param {string} userId - The ID of the user whose settings are being updated.
 * @param {object} settings - The new settings to be applied.
 * @returns {Promise<object>} The updated user settings.
 * @throws {Error} If there's an error updating the settings.
 */
export async function updateUserSettings(userId: string, settings: any) {
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