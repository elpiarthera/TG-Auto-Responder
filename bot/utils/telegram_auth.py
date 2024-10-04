import os
import logging
from typing import Dict, Optional
from supabase import create_client, Client

logger = logging.getLogger(__name__)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

def verify_and_store_user_data(user_data: Dict[str, str]) -> Optional[Dict[str, str]]:
    try:
        # Store user data in Supabase
        user_response = supabase.table("users").upsert({
            "id": user_data['id'],
            "first_name": user_data['first_name'],
            "last_name": user_data.get('last_name'),
            "username": user_data.get('username'),
            "photo_url": user_data.get('photo_url')
        }).execute()

        if user_response.get("error"):
            logger.error(f"Error storing user: {user_response['error']}")
            raise Exception(f"Error storing user: {user_response['error']}")

        if user_response.get("data"):
            logger.info(f"User data {'updated' if len(user_response['data']) > 0 else 'inserted'} successfully")

        # Create or update user settings
        settings_response = supabase.table("user_settings").upsert({
            "user_id": user_data['id'],
            "is_responder_active": False,  # default value
            "message_template": ""  # default value
        }).execute()

        if settings_response.get("error"):
            logger.error(f"Error storing user settings: {settings_response['error']}")
            raise Exception(f"Error storing user settings: {settings_response['error']}")

        if settings_response.get("data"):
            logger.info(f"User settings {'updated' if len(settings_response['data']) > 0 else 'inserted'} successfully")

        return user_data
    except Exception as e:
        logger.error(f"Unexpected error in verify_and_store_user_data: {str(e)}")
        return None