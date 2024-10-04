from typing import TypedDict, Optional
from supabase import Client as SupabaseClient

class TelegramUserData(TypedDict):
    id: str
    first_name: str
    last_name: Optional[str]
    username: Optional[str]
    photo_url: Optional[str]

async def handle_telegram_user_data(user_data: TelegramUserData, supabase: SupabaseClient) -> None:
    # Store or update user in Supabase
    user_response = supabase.table("users").upsert({
        "id": user_data['id'],
        "first_name": user_data['first_name'],
        "last_name": user_data.get('last_name'),
        "username": user_data.get('username'),
        "photo_url": user_data.get('photo_url')
    }).execute()

    if user_response.get("error"):
        raise Exception(f"Error storing user: {user_response['error']}")

    # Create or update user settings
    settings_response = supabase.table("user_settings").upsert({
        "user_id": user_data['id'],
        "is_responder_active": False,  # default value
        "message_template": ""  # default value
    }).execute()

    if settings_response.get("error"):
        raise Exception(f"Error storing user settings: {settings_response['error']}")