import { createClient } from '@supabase/supabase-js'
import { getUserSettings, updateUserSettings } from '../lib/utils/supabaseHelpers'
import { handleTelegramUserData } from '../lib/services/supabaseService'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

describe('Critical MVP Functionality', () => {
  const testUserId = 'test-user-id'

  beforeEach(async () => {
    // Clear test data before each test
    await supabase.from('user_settings').delete().eq('user_id', testUserId)
    await supabase.from('users').delete().eq('id', testUserId)
  })

  test('Telegram user data handling', async () => {
    const userData = {
      id: testUserId,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
    }

    await handleTelegramUserData(userData)

    const { data: user } = await supabase.from('users').select('*').eq('id', testUserId).single()
    expect(user).toBeTruthy()
    expect(user.first_name).toBe('Test')
  })

  test('User settings CRUD operations', async () => {
    // Create
    await updateUserSettings(testUserId, {
      message_template: 'Test message',
      is_responder_active: true,
    })

    // Read
    const settings = await getUserSettings(testUserId)
    expect(settings.message_template).toBe('Test message')
    expect(settings.is_responder_active).toBe(true)

    // Update
    await updateUserSettings(testUserId, {
      message_template: 'Updated message',
    })

    const updatedSettings = await getUserSettings(testUserId)
    expect(updatedSettings.message_template).toBe('Updated message')
  })
})