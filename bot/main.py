import os
from pyrogram import Client, filters
from supabase import create_client, Client as SupabaseClient

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: SupabaseClient = create_client(supabase_url, supabase_key)

# Initialize Pyrogram client
api_id = os.environ.get("TELEGRAM_API_ID")
api_hash = os.environ.get("TELEGRAM_API_HASH")
bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")

app = Client("auto_responder_bot", api_id=api_id, api_hash=api_hash, bot_token=bot_token)

@app.on_message(filters.private)
async def auto_respond(client, message):
    user_id = str(message.from_user.id)
    
    # Fetch user settings from Supabase
    response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
    
    if response.data:
        user_settings = response.data[0]
        if user_settings["is_responder_active"]:
            template = user_settings["message_template"]
            if template:
                await message.reply(template)

app.run()