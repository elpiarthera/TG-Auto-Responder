import { SupabaseClient } from '@supabase/supabase-js';

export interface TelegramUserData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export async function handleTelegramUserData(
  userData: TelegramUserData,
  supabase: SupabaseClient
): Promise<void> {
  const { id, first_name, last_name, username, photo_url } = userData;

  // Store or update user in Supabase
  const { error: userError } = await supabase
    .from("users")
    .upsert(
      {
        id,
        first_name,
        last_name,
        username,
        photo_url,
      },
      { onConflict: "id" }
    );

  if (userError) {
    console.error("Error storing user:", userError);
    throw new Error("Error storing user data");
  }

  // Create or update user settings
  const { error: settingsError } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: id,
        is_responder_active: false, // default value
        message_template: "", // default value
      },
      { onConflict: "user_id" }
    );

  if (settingsError) {
    console.error("Error storing user settings:", settingsError);
    throw new Error("Error storing user settings");
  }
}