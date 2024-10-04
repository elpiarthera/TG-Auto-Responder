# Telegram Auto-Responder

## Overview

Telegram Auto-Responder is a web application that allows users to set up automatic responses for their Telegram messages. Users can log in via Telegram OAuth, configure their auto-responder message, and toggle its activation status.

## Features

- Telegram OAuth authentication
- Customizable auto-responder message
- Toggle to activate/deactivate the auto-responder
- Dashboard to manage settings
- Telegram bot to handle incoming messages

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API routes, Supabase
- Authentication: Clerk (Telegram OAuth)
- Database: Supabase (PostgreSQL)
- Telegram Bot: Pyrogram (Python)
- Testing: Jest (TypeScript), pytest (Python)

## Prerequisites

- Node.js (v14 or later)
- Python 3.9 or later
- Supabase account
- Clerk account
- Telegram Bot API credentials

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/telegram-auto-responder.git
   cd telegram-auto-responder
   ```

2. Install dependencies:
   ```
   npm install
   cd bot && pip install -r requirements.txt
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in the required values.

4. Run the development server:
   ```
   npm run dev
   ```

5. Start the Telegram bot:
   ```
   cd bot && python main.py
   ```

## Testing

- Run TypeScript tests:
  ```
  npm test
  ```

- Run Python tests:
  ```
  cd bot && pytest
  ```

## Deployment

- Frontend and Next.js API routes: Deploy to Vercel
- Telegram Bot: Deploy to Heroku or similar service

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.