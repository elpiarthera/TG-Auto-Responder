from typing import TypedDict, Optional
from supabase import Client as SupabaseClient
import logging

logging.basicConfig(level=logging.ERROR, filename='bot_error.log', format='%(asctime)s - %(levelname)s - %(message)s')

class TelegramUserData(TypedDict):
    id: str
    first_name: str
    last_name: Optional[str]
    username: Optional[str]
    photo_url: Optional[str]

def handle_error(error: Exception) -> None:
    logging.error(f"An error occurred: {str(error)}")
    # You can add additional error handling logic here if needed

async def handle_telegram_user_data(user_data: TelegramUserData, supabase: SupabaseClient) -> None:
    try:
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

    except Exception as e:
        handle_error(e)
        raise  # Re-raise the exception after logging