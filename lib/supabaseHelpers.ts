import { supabase } from './supabaseClient'
import { UserSettings } from '../types/userSettings'

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user settings:', error)
    return null
  }

  return data
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...settings
    })

  if (error) {
    console.error('Error updating user settings:', error)
    return false
  }

  return true
}

export async function getAutoResponse(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('message_template')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching auto response:', error)
    return null
  }

  return data?.message_template || null
}