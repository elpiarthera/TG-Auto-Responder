import { supabase } from '@/lib/supabaseClient'

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserSettings(userId: string, settings: {
  message_template: string
  is_responder_active: boolean
}) {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, ...settings })
    .single()

  if (error) throw error
  return data
}