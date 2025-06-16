import { createClient } from '@supabase/supabase-js';
// Assuming TelegramUserData might be adapted or a new type for what's stored in 'users' table
// For example, if 'users' table now primarily stores Clerk-related IDs and Telegram profile info:
interface SupabaseUserRecord {
  id: string; // Clerk User ID
  telegram_numeric_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
}

// Keep logger if used, ensure it's correctly imported
import { logger } from './logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Should be server-side client for this
  process.env.SUPABASE_SERVICE_KEY!     // Correct: uses service key
);

export interface ClerkUserData {
  clerkUserId: string;
  telegramNumericId?: string | null; // Assuming Clerk can provide this after Telegram OAuth
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null; // Telegram username
  photoUrl?: string | null; // Telegram photo URL
}

export async function syncClerkUserToSupabase(clerkData: ClerkUserData): Promise<void> {
  logger.info(`Syncing Clerk user to Supabase. Clerk User ID: ${clerkData.clerkUserId}`);

  if (!clerkData.clerkUserId) {
    logger.error("Clerk User ID is missing. Cannot sync to Supabase.");
    throw new Error("Clerk User ID is missing.");
  }

  try {
    // Upsert user data in 'users' table
    const userUpsertData: Partial<SupabaseUserRecord> = { // Use Partial if some fields are optional
      id: clerkData.clerkUserId,
      first_name: clerkData.firstName,
      last_name: clerkData.lastName,
      username: clerkData.username,
      photo_url: clerkData.photoUrl,
    };
    if (clerkData.telegramNumericId) {
      userUpsertData.telegram_numeric_id = clerkData.telegramNumericId;
    }

    const { data: upsertedUser, error: userError } = await supabase
      .from('users')
      .upsert(userUpsertData)
      .select()
      .single();

    if (userError) {
      logger.error('Error upserting user data to Supabase users table:', userError);
      throw new Error(`Failed to upsert user data: ${userError.message}`);
    }
    logger.info(`User data for Clerk ID ${clerkData.clerkUserId} upserted successfully.`);
    if (upsertedUser) { // Optional: log the returned user data
        // logger.debug("Upserted user data from DB:", upsertedUser);
    }


    // Create or update user settings in 'user_settings' table
    const { error: settingsError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: clerkData.clerkUserId, // This is now Clerk's User ID
        is_responder_active: false,    // Default value
        message_template: "",          // Default value
      }, {
        // if user_id is not the PK but has a UNIQUE constraint, specify onConflict
        // onConflict: 'user_id'
      })
      .select(); // No .single() needed if we don't need the result immediately

    if (settingsError) {
      logger.error('Error upserting user settings to Supabase user_settings table:', settingsError);
      throw new Error(`Failed to upsert user settings: ${settingsError.message}`);
    }
    logger.info(`User settings for Clerk ID ${clerkData.clerkUserId} upserted successfully.`);

  } catch (error) {
    logger.error(`Unexpected error in syncClerkUserToSupabase for Clerk ID ${clerkData.clerkUserId}:`, error);
    // Rethrow or handle as per application's error strategy
    if (error instanceof Error && error.message.startsWith('Failed to upsert')) {
        throw error; // Rethrow specific known errors
    }
    throw new Error(`An unexpected error occurred while syncing user data for Clerk ID ${clerkData.clerkUserId}.`);
  }
}

// The old verifyTelegramHash and related TelegramUserData might be deprecated or moved
// if lib/utils/telegramUtils.ts still holds verifyTelegramHash, it's fine.
// For now, focus on the syncClerkUserToSupabase function.
// Ensure the old verifyAndStoreUserData is removed or commented out to avoid confusion.