import os
import logging
from pyrogram import Client, filters
from supabase import create_client, Client as SupabaseClient
from dotenv import load_dotenv
from typing import Dict, Any
from bot.utils import handle_telegram_user_data, TelegramUserData

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def validate_env_vars() -> None:
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_KEY",
        "TELEGRAM_API_ID",
        "TELEGRAM_API_HASH",
        "TELEGRAM_BOT_TOKEN"
    ]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

try:
    validate_env_vars()
except EnvironmentError as e:
    logger.error(f"Environment variable validation failed: {str(e)}")
    raise

# Initialize Supabase client
try:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase URL or key is missing")
    supabase: SupabaseClient = create_client(supabase_url, supabase_key)
except ValueError as e:
    logger.error(f"Supabase client initialization failed: {str(e)}")
    raise
except Exception as e:
    logger.error(f"Unexpected error during Supabase client initialization: {str(e)}")
    raise

# Initialize Pyrogram client
try:
    app = Client(
        "auto_responder_bot",
        api_id=os.getenv("TELEGRAM_API_ID"),
        api_hash=os.getenv("TELEGRAM_API_HASH"),
        bot_token=os.getenv("TELEGRAM_BOT_TOKEN")
    )
except ValueError as e:
    logger.error(f"Pyrogram client initialization failed: {str(e)}")
    raise
except Exception as e:
    logger.error(f"Unexpected error during Pyrogram client initialization: {str(e)}")
    raise

@app.on_message(filters.private)
async def handle_message(client: Client, message: Dict[str, Any]) -> None:
    try:
        user = message.from_user
        user_data: TelegramUserData = {
            "id": str(user.id),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "photo_url": user.photo.big_file_id if user.photo else None
        }
        await handle_telegram_user_data(user_data, supabase)
        
        # Fetch user settings from Supabase
        response = supabase.table("user_settings").select("*").eq("user_id", user.id).execute()
        if response.data:
            user_settings = response.data[0]
            if user_settings["is_responder_active"]:
                await message.reply(user_settings["message_template"])
        else:
            logger.warning(f"No settings found for user {user.id}")
    except AttributeError as e:
        logger.error(f"Error accessing message attributes: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in handle_message: {str(e)}")

if __name__ == "__main__":
    try:
        logger.info("Starting the bot...")
        app.run()
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Unexpected error occurred: {str(e)}")