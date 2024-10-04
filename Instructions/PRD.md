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
