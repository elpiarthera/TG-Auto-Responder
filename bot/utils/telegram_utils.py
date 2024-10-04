from typing import Optional
from pydantic import BaseModel, Field
from supabase import Client as SupabaseClient

class TelegramUserData(BaseModel):
    """
    Represents user data received from Telegram.

    Attributes:
        id (str): Unique identifier for the user.
        first_name (str): User's first name.
        last_name (Optional[str]): User's last name, if available.
        username (Optional[str]): User's username, if available.
        photo_url (Optional[str]): URL of user's profile photo, if available.
    """
    id: str
    first_name: str
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None

class UserSettings(BaseModel):
    """
    Represents user settings for the auto-responder.

    Attributes:
        user_id (str): Unique identifier for the user.
        is_responder_active (bool): Whether the auto-responder is active.
        message_template (str): The message template for auto-responses.
    """
    user_id: str
    is_responder_active: bool = Field(default=False)
    message_template: str = Field(default="", max_length=1000)

async def handle_telegram_user_data(user_data: TelegramUserData, supabase: SupabaseClient) -> None:
    """
    Handles the storage and update of Telegram user data in Supabase.

    Args:
        user_data (TelegramUserData): The user data received from Telegram.
        supabase (SupabaseClient): The Supabase client for database operations.

    Raises:
        Exception: If there's an error storing user data or settings.
    """
    validated_user_data = TelegramUserData(**user_data).dict(exclude_none=True)
    
    user_response = supabase.table("users").upsert(validated_user_data).execute()
    if user_response.get("error"):
        raise Exception(f"Error storing user: {user_response['error']}")

    default_settings = UserSettings(user_id=user_data.id)
    settings_response = supabase.table("user_settings").upsert(default_settings.dict()).execute()
    if settings_response.get("error"):
        raise Exception(f"Error storing user settings: {settings_response['error']}")