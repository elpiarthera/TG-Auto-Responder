export interface TelegramUserData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface UserSettings {
  user_id: string;
  is_responder_active: boolean;
  message_template: string;
}