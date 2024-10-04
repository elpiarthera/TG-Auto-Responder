import os
import re
import logging
from supabase import create_client, Client as SupabaseClient
from pyrogram import Client
from dotenv import load_dotenv
from bot.utils.env_validation import validate_env, get_env_var

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

class EnvironmentError(Exception):
    pass

class SupabaseError(Exception):
    pass

class PyrogramError(Exception):
    pass

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
    
    # Validate SUPABASE_KEY format (assuming it should be a long alphanumeric string)
    supabase_key = os.getenv("SUPABASE_KEY")
    if not re.match(r'^[a-zA-Z0-9]{50,}$', supabase_key):
        raise EnvironmentError("SUPABASE_KEY format is invalid")
    
    # Validate TELEGRAM_BOT_TOKEN format
    telegram_token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not re.match(r'^\d+:[a-zA-Z0-9_-]{35}$', telegram_token):
        raise EnvironmentError("TELEGRAM_BOT_TOKEN format is invalid")

def setup_supabase() -> SupabaseClient:
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        if not supabase_url or not supabase_key:
            raise SupabaseError("Supabase URL or key is missing")
        return create_client(supabase_url, supabase_key)
    except Exception as e:
        logger.error(f"Supabase client initialization failed: {str(e)}")
        raise SupabaseError(f"Supabase client initialization failed: {str(e)}")

def setup_pyrogram() -> Client:
    try:
        validate_env('TELEGRAM_API_ID', 'TELEGRAM_API_HASH', 'TELEGRAM_BOT_TOKEN')
        api_id = get_env_var('TELEGRAM_API_ID')
        api_hash = get_env_var('TELEGRAM_API_HASH')
        bot_token = get_env_var('TELEGRAM_BOT_TOKEN')
        return Client("my_bot", api_id=api_id, api_hash=api_hash, bot_token=bot_token)
    except Exception as e:
        logger.error(f"Pyrogram client initialization failed: {str(e)}")
        raise PyrogramError(f"Pyrogram client initialization failed: {str(e)}")

def setup():
    try:
        validate_env_vars()
        supabase = setup_supabase()
        pyrogram = setup_pyrogram()
        return supabase, pyrogram
    except (EnvironmentError, SupabaseError, PyrogramError) as e:
        logger.error(f"Setup failed: {str(e)}")
        raise