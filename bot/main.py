import logging
from pyrogram import filters
from bot.utils.telegram_auth import verify_and_store_user_data
from typing import Dict, Any
from bot.setup import setup

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    supabase, app = setup()
except Exception as e:
    logger.error(f"Setup failed: {str(e)}")
    raise

@app.on_message(filters.private)
async def handle_message(client, message: Dict[str, Any]) -> None:
    try:
        user = message.from_user
        user_data = {
            "id": str(user.id),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "photo_url": user.photo.big_file_id if user.photo else None
        }
        verified_user_data = verify_and_store_user_data(user_data)
        
        if verified_user_data:
            # Fetch user settings from Supabase
            response = supabase.table("user_settings").select("*").eq("user_id", user.id).execute()
            if response.data:
                user_settings = response.data[0]
                if user_settings["is_responder_active"]:
                    await message.reply(user_settings["message_template"])
            else:
                logger.warning(f"No settings found for user {user.id}")
        else:
            logger.warning(f"Failed to verify and store user data for user {user.id}")
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