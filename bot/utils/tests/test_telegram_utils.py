import pytest
from unittest.mock import Mock
from ..telegram_utils import handle_telegram_user_data, TelegramUserData, UserSettings

@pytest.fixture
def mock_supabase():
    return Mock()

@pytest.fixture
def valid_user_data():
    return TelegramUserData(id="123", first_name="John", last_name="Doe")

async def test_handle_telegram_user_data_success(mock_supabase, valid_user_data):
    mock_supabase.table().upsert().execute.return_value = {"data": {}, "error": None}
    
    await handle_telegram_user_data(valid_user_data, mock_supabase)
    
    assert mock_supabase.table.call_count == 2
    mock_supabase.table.assert_any_call("users")
    mock_supabase.table.assert_any_call("user_settings")

async def test_handle_telegram_user_data_user_error(mock_supabase, valid_user_data):
    mock_supabase.table().upsert().execute.return_value = {"data": None, "error": "User error"}
    
    with pytest.raises(Exception, match="Error storing user: User error"):
        await handle_telegram_user_data(valid_user_data, mock_supabase)

# Add more tests for other scenarios...