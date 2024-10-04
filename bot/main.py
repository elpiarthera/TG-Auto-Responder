import os
import logging
from pyrogram import Client, filters
from supabase import create_client, Client as SupabaseClient
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def validate_env_vars():
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
    supabase: SupabaseClient = create_client(supabase_url, supabase_key)
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    raise

# Initialize Pyrogram client
try:
    api_id = os.getenv("TELEGRAM_API_ID")
    api_hash = os.getenv("TELEGRAM_API_HASH")
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    app = Client("auto_responder_bot", api_id=api_id, api_hash=api_hash, bot_token=bot_token)
except Exception as e:
    logger.error(f"Failed to initialize Pyrogram client: {str(e)}")
    raise

@app.on_message(filters.private)
async def auto_respond(client, message):
    user_id = str(message.from_user.id)
    
    try:
        # Fetch user settings from Supabase
        response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
        
        if response.data:
            user_settings = response.data[0]
            if user_settings["is_responder_active"]:
                template = user_settings["message_template"]
                if template:
                    await message.reply(template)
                else:
                    logger.warning(f"Active responder for user {user_id} has an empty message template")
        else:
            logger.info(f"No settings found for user {user_id}")
    except Exception as e:
        logger.error(f"Error processing message for user {user_id}: {str(e)}")

async def handle_error(client, message, e):
    error_message = f"An error occurred: {str(e)}"
    logger.error(error_message)
    await message.reply("Sorry, an error occurred while processing your message. Please try again later.")

if __name__ == "__main__":
    try:
        logger.info("Starting the bot...")
        app.run()
    except Exception as e:
        logger.critical(f"Critical error running the bot: {str(e)}")