# Product Requirements Document (PRD) for Telegram Auto-Responder MVP

## Project Overview

This document outlines the requirements for building a Telegram Auto-Responder mini-app. The app will allow users to log in via Telegram OAuth, configure an auto-responder message, and toggle its activation status. The auto-responder will reply automatically to incoming Telegram messages based on the user's configured settings. The solution will leverage Supabase for data storage, Clerk for authentication, Pyrogram for the Telegram bot, and several tools for frontend and backend development.

## Product Objectives

- **Authentication**: Users will authenticate through Telegram OAuth using Clerk.
- **Auto-Responder Configuration**: Users can create and save message templates for the auto-responder.
- **Toggle Activation**: Users can enable/disable the auto-responder via a toggle switch in the dashboard.
- **Telegram Bot**: The bot will respond to messages when the auto-responder is active.

## Tech Stack

### Frontend

- **Framework**: Next.js (React-based, for both frontend and server-side rendering)
- **UI**: Leveraging v0.dev and shadcn/ui for quick and efficient UI generation.
- **CSS Framework**: Tailwind CSS for styling.
- **Deployment**: Vercel (for deploying the app with server-side rendering support).

### Backend

- **Database**: Supabase (Postgres-based, with built-in auth and database management).
- **Telegram Bot**: Pyrogram (Python-based framework to interact with the Telegram API).
- **Bot Deployment**: Heroku (or similar cloud service) for bot deployment.

### Authentication

- **Auth Service**: Clerk (for OAuth authentication with Telegram).

## Tools and Services

1. **Vercel**: To deploy and manage the Next.js application with fast CI/CD.
2. **Clerk**: For handling user authentication (Telegram OAuth).
3. **Supabase**: For data storage (user settings) and real-time API.
4. **v0.dev**: To quickly generate UI components for the app's frontend.
5. **Cursor**: For improving collaboration and navigating code effectively.
6. **Claude Sonnet & ChatGPT**: For assisted coding, code review, and generating API logic.
7. **Heroku**: To host and run the Python-based Telegram bot (using Pyrogram).
8. **Pyrogram**: The Telegram bot framework for interacting with the Telegram API.

## Key Features and Requirements

### 1. User Authentication

- **Goal**: Allow users to log in using their Telegram account.
- **Framework**: Clerk for OAuth with Telegram.
- **Functionality**:
  - **Login**: Users authenticate via Clerk's pre-built OAuth flow.
  - **Session Management**: Clerk manages sessions, ensuring users remain logged in.
  - **Logout**: Users can log out, and Clerk will clear the session.

### 2. Auto-Responder Dashboard

- **Goal**: Provide users with a UI to configure the auto-responder.
- **Framework**: Next.js (React-based)
- **UI Generation**: Leverage v0.dev for quick component creation.
- **UI Components**:
  - **User Info**: Display the Telegram username and profile picture (fetched from Clerk).
  - **Toggle Switch**: Enable or disable the auto-responder.
  - **Message Template Input**: Text field for entering the custom auto-responder message.
  - **Save Button**: Save changes to the user's auto-responder settings in Supabase.

### 3. Supabase Integration

- **Goal**: Store and manage user settings (auto-responder status and message template).
- **Framework**: Supabase (Postgres and API management).
- **Data to Store**:
  - **User ID**: Clerk's userId, used as the foreign key.
  - **Auto-Responder Status**: Boolean field indicating whether the auto-responder is active.
  - **Message Template**: Text field containing the user's custom message.
- **API Endpoints**:
  - GET /api/templates: Fetch the user's message template.
  - POST /api/templates: Create or update the user's message template.
  - POST /api/settings: Update the auto-responder status.

### 4. Telegram Bot Integration

- **Goal**: The bot will respond automatically to incoming messages based on user settings.
- **Framework**: Pyrogram (Python framework for interacting with the Telegram API).
- **Functionality**:
  - **Bot Setup**: Use Pyrogram to create a bot that listens to incoming messages.
  - **Message Handling**:
    - If the auto-responder is active, the bot will fetch the message template from Supabase and respond with it.
    - If the responder is disabled, the bot will ignore the message.
  - **Supabase Integration**: Fetch the user's settings (auto-responder status and template) via API.

## Detailed Functionality and Dependencies

### Frontend Components

1. **Login Page**:

   - **Dependencies**:
     - Clerk (@clerk/nextjs): To embed the login form.
     - Tailwind CSS: For responsive and clean UI design.
   - **Functionality**: Renders Clerk's SignIn component for Telegram OAuth.

2. **Dashboard Page**:
   - **Dependencies**:
     - Supabase (@supabase/supabase-js): For managing user settings.
     - shadcn/ui (@radix-ui/react-avatar, @radix-ui/react-switch): To build UI components.
     - Tailwind CSS: For layout and styling.
     - react-toastify: For success/error notifications.
   - **Functionality**:
     - Shows user info (from Clerk).
     - Auto-responder toggle switch.
     - Message input field.
     - Save button to update settings in Supabase.

### API and Backend

1. **Supabase API Integration**:

   - **Dependencies**:
     - Supabase (@supabase/supabase-js): For API calls to handle user data.
   - **API Routes**:
     - GET /api/templates: Fetch the user's saved message template.
     - POST /api/templates: Update or create the message template.
     - POST /api/settings: Toggle the auto-responder's status.

2. **Telegram Bot (Pyrogram)**
   - **Dependencies**:
     - Pyrogram: The framework for handling the bot's interactions with the Telegram API.
     - Supabase Python client (supabase-py): To interact with Supabase from the bot's backend.
   - **Functionality**:
     - Listens for incoming messages.
     - Fetches user settings (responder status and message) from Supabase.
     - Responds with the user's custom message if the auto-responder is active.
   - **Deployment**: The bot is deployed on Heroku for continuous uptime.

## Estimated Time Breakdown

1. **Supabase Setup**: 2–3 hours

   - Set up project, database, and tables.
   - Create API routes for saving and fetching settings.

2. **Clerk Authentication Integration**: 1 hour

   - Integrate Clerk for Telegram OAuth.
   - Add session management.

3. **Frontend Development**: 2–3 hours

   - Build login and dashboard pages with v0.dev for quick UI component generation.
   - Style components with Tailwind CSS.
   - Integrate Supabase to fetch and save user settings.

4. **Telegram Bot Development**: 2–3 hours

   - Set up Pyrogram.
   - Write the logic to fetch user settings and respond to messages.
   - Deploy the bot on Heroku.

5. **Testing and Debugging**: 1–2 hours
   - Test the flow from login to configuring the auto-responder and receiving messages.

## Final Dependencies List

### Frontend (Next.js)

- next: Next.js framework for React.
- @supabase/supabase-js: Supabase client for API integration.
- @clerk/nextjs: Clerk for authentication.
- @radix-ui/react-avatar, @radix-ui/react-switch: UI components for building the dashboard.
- react-toastify: For showing notifications.
- tailwindcss: CSS framework for styling.

### Backend (Supabase & Pyrogram)

- Supabase: Hosted Postgres database with built-in API.
- Pyrogram: Python framework for Telegram Bot API.
- supabase-py: Python client for interacting with Supabase.

## Appendix: Supabase Schema Migration for Clerk Integration

This guide outlines the necessary schema changes in your Supabase database to align with Clerk authentication, where Clerk's `userId` becomes the primary identifier for users.

**Important Assumptions:**
*   You are transitioning to use Clerk's `userId` (a string, e.g., `user_123abc...`) as the primary key for user-related data.
*   The following steps assume you are making these changes directly in the Supabase SQL editor or table editor.
*   **Backup your data before making schema changes if you have existing user data you wish to preserve and migrate.** The steps below primarily focus on schema alteration for new data compatibility. Data migration is a more complex process.

**Step 1: Modify the `users` Table**

1.  **Navigate to your `users` table in the Supabase Dashboard.**
2.  **Change the `id` column:**
    *   **Current Type (Likely):** `bigint` or `numeric` (for Telegram numeric ID).
    *   **New Type:** `TEXT` or `VARCHAR`. This column will now store Clerk's `userId`.
    *   **Primary Key:** Ensure this `id` column remains the Primary Key.
    *   If you are using the Supabase Table Editor, you might need to temporarily remove the Primary Key constraint, change the type, and then re-add the Primary Key constraint.
3.  **Add a new column for the numeric Telegram ID (Recommended):**
    *   **Column Name:** `telegram_numeric_id` (or similar).
    *   **Type:** `BIGINT` (if Telegram IDs are numbers) or `TEXT`.
    *   **Constraints:** Consider adding a `UNIQUE` constraint to this column if you want to ensure no two Clerk users can be associated with the same numeric Telegram ID.
    *   This column will store the original numeric ID from Telegram, which can be useful for linking or for the Pyrogram bot.
4.  **Review other columns:** Ensure `first_name`, `last_name`, `username`, `photo_url` are of type `TEXT` or `VARCHAR` and are nullable as needed.

**Example SQL (Illustrative - adapt carefully):**
```sql
-- Backup your 'users' table first!
-- Example: CREATE TABLE users_backup AS TABLE users;

-- If you need to remove PK to change type (depends on Supabase UI/SQL behavior)
-- ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Change id column type
ALTER TABLE users ALTER COLUMN id TYPE TEXT;

-- Re-add PK if dropped
-- ALTER TABLE users ADD PRIMARY KEY (id);

-- Add new column for numeric Telegram ID
ALTER TABLE users ADD COLUMN telegram_numeric_id BIGINT UNIQUE;
-- Or TEXT if Telegram ID is treated as string:
-- ALTER TABLE users ADD COLUMN telegram_numeric_id TEXT UNIQUE;

-- Ensure other profile columns are appropriate
ALTER TABLE users ALTER COLUMN first_name TYPE TEXT;
ALTER TABLE users ALTER COLUMN last_name TYPE TEXT;
ALTER TABLE users ALTER COLUMN username TYPE TEXT;
ALTER TABLE users ALTER COLUMN photo_url TYPE TEXT;
```

**Step 2: Modify the `user_settings` Table**

1.  **Navigate to your `user_settings` table.**
2.  **Change the `user_id` column:**
    *   **Current Type (Likely):** `bigint` or `numeric`.
    *   **New Type:** `TEXT` or `VARCHAR`. This will store Clerk's `userId`.
3.  **Primary Key / Unique Constraint:**
    *   It's common for `user_id` in a settings table to be the Primary Key or at least have a `UNIQUE` constraint to ensure one settings row per user.
4.  **Foreign Key Constraint:**
    *   Remove any existing Foreign Key constraint on `user_id` that points to the old `users.id` (numeric).
    *   Add a new Foreign Key constraint: `user_id` in `user_settings` should reference `id` in the `users` table (which is now Clerk's `userId`).
    *   Ensure `ON DELETE CASCADE` or other appropriate actions are set if desired.
5.  **Review other columns:** `is_responder_active` (BOOLEAN), `message_template` (TEXT) should be fine.

**Example SQL (Illustrative - adapt carefully):**
```sql
-- Backup 'user_settings' table first!
-- Example: CREATE TABLE user_settings_backup AS TABLE user_settings;

-- Remove old FK constraint (get constraint name from Supabase dashboard)
-- ALTER TABLE user_settings DROP CONSTRAINT <your_old_fk_constraint_name>;

-- If user_id is PK and you need to drop to change type
-- ALTER TABLE user_settings DROP CONSTRAINT user_settings_pkey;

-- Change user_id column type
ALTER TABLE user_settings ALTER COLUMN user_id TYPE TEXT;

-- Re-add PK or UNIQUE constraint on user_id
-- ALTER TABLE user_settings ADD PRIMARY KEY (user_id);
-- or
-- ALTER TABLE user_settings ADD CONSTRAINT unique_user_id UNIQUE (user_id);


-- Add new FK constraint to users table (on Clerk userId)
ALTER TABLE user_settings
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE; -- Or your preferred ON DELETE action
```

**After Schema Changes:**
*   The application code (which I will modify) will assume this new schema.
*   Calls to `getUserSettings(clerkUserId)` and `updateUserSettings(clerkUserId, ...)` from the dashboard should now work with these tables.
*   The logic for initially populating the `users` and `user_settings` tables after a new user signs up via Clerk will need to be updated (this will be part of my code changes).

Please review these SQL commands carefully and adapt them to your exact table structure and constraint names. Using the Supabase Table Editor GUI might be safer if you are not comfortable with direct SQL execution.
