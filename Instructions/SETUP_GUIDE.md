# Comprehensive Setup Guide for TG Auto Responder

This guide provides step-by-step instructions for configuring all necessary services and environment variables for the Telegram Auto Responder application.

## Part 1: Telegram Bot Setup (via BotFather)

1.  **Create or Identify your Telegram Bot:**
    *   Open Telegram and search for "BotFather".
    *   If you don't have a bot, create one by sending `/newbot` to BotFather. Follow the prompts to choose a name and username for your bot (e.g., username `TGReplyForMe_bot`).
    *   BotFather will give you an **HTTP API token**. This is your `TELEGRAM_BOT_TOKEN`. Keep it secure.
2.  **Set Bot Domain (for Clerk OAuth Redirect):**
    *   Later, when configuring Clerk (Part 2), Clerk will provide a **Redirect URI**.
    *   You will need to come back to BotFather, use the `/mybots` command, select your bot, go to "Bot Settings" -> "Domain", and set the domain that Clerk provides. This is crucial for Telegram OAuth to redirect back to Clerk correctly.

## Part 2: Clerk Setup (Authentication)

1.  **Sign up/Log in to Clerk:** Go to [https://clerk.com/](https://clerk.com/) and create an account or log in.
2.  **Create a New Application in Clerk:**
    *   Give your application a name.
    *   Choose your preferred sign-in methods. For this project, you primarily need **Telegram** OAuth.
3.  **Configure Telegram as an OAuth Provider:**
    *   In your Clerk application dashboard, navigate to "User & Authentication" -> "Social Login".
    *   Enable "Telegram".
    *   Clerk will ask for:
        *   **Bot Username:** Enter the username of your Telegram bot (e.g., `TGReplyForMe_bot`).
        *   **Bot Token:** Enter the `TELEGRAM_BOT_TOKEN` you got from BotFather.
    *   Clerk will then display a **Redirect URI** (something like `https://your-clerk-frontend-api-hostname/.clerk/oauth_callback/oauth_telegram`). **Copy this URI.** You'll need it for Part 1, Step 2 (setting your bot's domain in BotFather).
4.  **Get API Keys:**
    *   Navigate to "API Keys" in your Clerk dashboard.
    *   Copy the **Publishable key** (this will be `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`).
    *   Copy the **Secret key** (this will be `CLERK_SECRET_KEY`).
5.  **Review Session Settings:**
    *   Check session token lifetime and other settings as per your preference. Clerk's defaults are usually fine to start.
6.  **(Optional) Configure User Profile Data Sync:**
    *   Clerk can sync some profile data from Telegram (like name, photo). Ensure this is enabled if you rely on it for the `users` table population.

## Part 3: Supabase Setup (Database)

1.  **Create or Select your Supabase Project:**
    *   Go to [https://supabase.com/](https://supabase.com/) and create a project or use an existing one.
2.  **Get Supabase API Keys:**
    *   In your Supabase project dashboard, go to "Project Settings" -> "API".
    *   Find the **Project URL** (this will be `NEXT_PUBLIC_SUPABASE_URL`).
    *   Find the **`anon` `public` key** (this will be `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    *   Find the **`service_role` `secret` key** (this will be `SUPABASE_SERVICE_KEY`).
3.  **Perform Database Schema Migration:**
    *   Navigate to the "SQL Editor" in your Supabase project.
    *   **Backup your data if you have existing user data you wish to preserve and migrate.** The steps below are for schema alteration.
    *   Execute the following SQL (adapt carefully if you have existing constraints with different names):

    **3.1. Modify the `users` Table:**
    ```sql
    -- If your table is not public.users, adjust schema name accordingly.
    -- Backup your 'users' table first if it has data!
    -- CREATE TABLE users_backup AS TABLE users;

    -- If you need to remove PK to change type (depends on Supabase UI/SQL behavior)
    -- ALTER TABLE public.users DROP CONSTRAINT users_pkey;

    -- Change id column type to TEXT for Clerk User ID
    ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;

    -- Re-add PK if dropped
    -- ALTER TABLE public.users ADD PRIMARY KEY (id);

    -- Add new column for numeric Telegram ID (ensure it doesn't exist first)
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS telegram_numeric_id TEXT;
    -- Consider adding a unique constraint if desired and appropriate for your logic
    -- ALTER TABLE public.users ADD CONSTRAINT unique_telegram_numeric_id UNIQUE (telegram_numeric_id);

    -- Ensure other profile columns are TEXT and nullable as needed
    ALTER TABLE public.users ALTER COLUMN first_name TYPE TEXT;
    ALTER TABLE public.users ALTER COLUMN last_name TYPE TEXT;
    ALTER TABLE public.users ALTER COLUMN username TYPE TEXT;
    ALTER TABLE public.users ALTER COLUMN photo_url TYPE TEXT;
    ```

    **3.2. Modify the `user_settings` Table:**
    ```sql
    -- Backup 'user_settings' table first if it has data!
    -- CREATE TABLE user_settings_backup AS TABLE user_settings;

    -- Identify and remove old FK constraint if it exists and references a numeric users.id
    -- (Find constraint_name from Table Editor or information_schema.table_constraints)
    -- Example: ALTER TABLE public.user_settings DROP CONSTRAINT <your_old_fk_constraint_name>;

    -- If user_id is PK and you need to drop to change type
    -- ALTER TABLE public.user_settings DROP CONSTRAINT user_settings_pkey;

    -- Change user_id column type to TEXT for Clerk User ID
    ALTER TABLE public.user_settings ALTER COLUMN user_id TYPE TEXT;

    -- Re-add PK or UNIQUE constraint on user_id (using Clerk User ID)
    -- If making it PK:
    -- ALTER TABLE public.user_settings ADD PRIMARY KEY (user_id);
    -- Or if it has its own PK and user_id should just be unique:
    -- ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);


    -- Add new FK constraint to users table (on Clerk userId)
    -- Ensure the referenced 'users' table and 'id' column match your setup.
    ALTER TABLE public.user_settings
    ADD CONSTRAINT fk_user_settings_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE; -- Or your preferred ON DELETE/UPDATE action
    ```
4.  **Row Level Security (RLS) - IMPORTANT for next steps:**
    *   RLS will be discussed and configured in a later step of the development plan. For now, ensure you understand that client-side Supabase queries (using the `anon` key) will require RLS policies to function correctly. The `service_role` key bypasses RLS.

## Part 4: Vercel Environment Variables Setup

1.  **Go to your Vercel Project Settings.**
2.  Navigate to "Environment Variables".
3.  Add the following variables:

    *   **Clerk Variables:**
        *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key.
        *   `CLERK_SECRET_KEY`: Your Clerk Secret Key.

    *   **Supabase Variables:**
        *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase `anon` `public` key.
        *   `SUPABASE_SERVICE_KEY`: Your Supabase `service_role` `secret` key.

    *   **Telegram Bot Token (for Pyrogram bot AND potentially server-side logic):**
        *   `TELEGRAM_BOT_TOKEN`: The HTTP API token for your Telegram bot from BotFather.

4.  **Redeploy your Vercel application** for the environment variables to take effect.

## Part 5: Pyrogram Bot (Heroku/Other Deployment) Environment Variables

If you are deploying the Python Pyrogram bot separately (e.g., on Heroku):

1.  Set the following environment variables in that bot's deployment environment:
    *   `API_ID`: Your Telegram Core API ID (from my.telegram.org).
    *   `API_HASH`: Your Telegram Core API Hash (from my.telegram.org).
    *   `BOT_TOKEN`: Same `TELEGRAM_BOT_TOKEN` used above.
    *   `SUPABASE_URL`: Your Supabase Project URL (same as `NEXT_PUBLIC_SUPABASE_URL`).
    *   `SUPABASE_KEY`: Your Supabase `service_role` `secret` key (same as `SUPABASE_SERVICE_KEY`), as the bot will likely need privileged access to read all user settings or act on behalf of users. Alternatively, if the bot only reads, the `anon` key might suffice if RLS is set up for it. Service role is safer if it needs to write or bypass RLS for reads.

---

Once all these steps are completed, the application should be correctly configured to use Clerk for authentication, Supabase for data storage with the new ID scheme, and Vercel for hosting the Next.js frontend/backend. The Pyrogram bot will also be ready to interact with users and Supabase.

## Part 6: Supabase Row Level Security (RLS) Setup

This section explains how to set up Row Level Security (RLS) for your Supabase tables, particularly `user_settings`. RLS is essential to ensure that users can only access and modify their own data when interacting with Supabase from the frontend (client-side) using the anonymous key.

**Context:**
- Your Next.js application (specifically the dashboard) uses functions like `getUserSettings` and `updateUserSettings`.
- These functions, located in `lib/services/supabaseService.ts`, use Supabase's `anon` key.
- Queries made with the `anon` key are subject to RLS policies. Without RLS, these queries will likely fail or could expose data insecurely.

**Core Principle for RLS with Clerk:**
You need a way for your RLS policies in Supabase to identify the currently authenticated Clerk user. There are primarily two scenarios:

**Scenario A: Clerk is Configured to Issue Supabase-Compatible JWTs**
   - **How it works:** Clerk can be configured (using JWT Templates) to issue JWTs that Supabase can verify and use. In this setup, the `sub` (subject) claim of the JWT typically contains the Clerk User ID. Supabase's `auth.uid()` function in RLS policies would then correctly return this Clerk User ID.
   - **Action:** You need to investigate your Clerk application settings for "JWT Templates" or specific Supabase integration features. If you enable this, the RLS policies below using `auth.uid()` will work directly.

**Scenario B: Clerk is NOT Issuing Supabase-Compatible JWTs (or it's complex to set up)**
   - **How it works:** If `auth.uid()` in Supabase RLS policies does not directly correspond to the Clerk User ID, direct client-side calls to Supabase with the `anon` key become difficult to secure properly for user-specific data.
   - **Recommended Solution:** Use **Supabase Edge Functions** (or Next.js API routes that internally use the Supabase service key).
      1. Your frontend (dashboard) calls a Next.js API route (e.g., `/api/get-settings`, `/api/update-settings`). These API routes are protected by Clerk middleware, so they know the authenticated Clerk user.
      2. These Next.js API routes then either:
          a. Call Supabase Edge Functions, passing the Clerk User ID. The Edge Function uses the **service key** to perform Supabase operations, explicitly filtering by the passed Clerk User ID.
          b. Directly use the Supabase **service key** within the Next.js API route to perform operations, explicitly filtering by the Clerk User ID obtained from `getAuth(req)`.
      3. This way, RLS isn't strictly needed for the `anon` key on these tables, as all access goes through your controlled, authenticated backend layer which uses the service key with explicit user ID filtering. However, it's still good practice to have RLS as a defense-in-depth measure (e.g., default DENY).

**RLS Policies Implementation (Assuming Scenario A, or as a general secure default):**

1.  **Enable RLS on the `user_settings` Table:**
    *   In your Supabase Dashboard, navigate to "Authentication" -> "Policies".
    *   Find the `user_settings` table and click "Enable RLS". If RLS is already enabled, it will say "RLS is enabled".

2.  **Add Policies using the Supabase SQL Editor:**
    *   Go to "SQL Editor" -> "New query".

    *   **Policy for Allowing Users to Read Their Own Settings:**
        ```sql
        CREATE POLICY "Allow individual user read access to their own settings"
        ON public.user_settings
        FOR SELECT
        USING (auth.uid() = user_id);
        -- Assumes 'user_id' column stores Clerk User ID and auth.uid() matches it.
        ```

    *   **Policy for Allowing Users to Update Their Own Settings:**
        ```sql
        CREATE POLICY "Allow individual user update access to their own settings"
        ON public.user_settings
        FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        -- Assumes 'user_id' column stores Clerk User ID and auth.uid() matches it.
        ```

    *   **Policy for Allowing Users to Insert Their Own Settings (Less common for client-side on a settings table that's usually seeded):**
        The `syncClerkUserToSupabase` function (called by `/api/ensure-user-synced`) uses the `service_key` and will bypass these RLS policies for inserting the initial settings. If your client-side code ever needs to *insert* into `user_settings` directly (which is unlikely for this table, as `upsert` is used for updates), you'd add:
        ```sql
        CREATE POLICY "Allow individual user to insert their own settings"
        ON public.user_settings
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        -- Assumes 'user_id' column stores Clerk User ID and auth.uid() matches it.
        ```
    *   **Policy for the `users` table (if client-side queries are ever made to it):**
        If your client-side code (using `anon` key) ever needs to read from the `users` table (e.g., to get a user's public profile):
        ```sql
        -- First, ensure RLS is enabled on the 'users' table.
        CREATE POLICY "Allow individual users to read their own user entry"
        ON public.users
        FOR SELECT
        USING (auth.uid() = id);
        -- Assumes 'id' column is Clerk User ID and auth.uid() matches it.

        -- Or, if any authenticated user can read any user's public profile (less common for 'users' table):
        -- CREATE POLICY "Allow authenticated users to read user entries"
        -- ON public.users
        -- FOR SELECT
        -- USING (auth.role() = 'authenticated');
        ```

**Important Considerations:**
*   **Test Thoroughly:** After implementing RLS and configuring Clerk (especially JWT templates if pursuing Scenario A), test that users can log in, load their settings, and save changes. Also test that they *cannot* access data they shouldn't (though this is harder to test without trying to act as another user).
*   **Service Key vs. Anon Key:** Remember, operations using the `service_key` (like in `syncClerkUserToSupabase` or your secure backend/Edge Functions) bypass RLS. RLS primarily applies to queries made using the `anon` key or other user-specific JWTs.
*   **Default DENY:** Supabase's default behavior when RLS is enabled and no policies match is to DENY access. This is good for security.

Setting up RLS correctly is vital. If you are unsure about the Clerk JWT integration for `auth.uid()`, leaning towards using Next.js API routes (protected by Clerk) that internally use the Supabase service key (Scenario B) is a more explicitly secure pattern for data access, as you are not relying on client-side JWTs for RLS policy enforcement directly.
```
