import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { verifyTelegramHash } from '@/lib/utils'; // Updated import path
import { handleTelegramUserData, TelegramUserData } from '@/shared/utils/telegramUtils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const telegramData = req.query as Record<string, string>;

  // Extract relevant data
  const { hash, ...userDataFromTelegram } = telegramData;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  // Verify the hash
  if (verifyTelegramHash(userDataFromTelegram, hash, botToken)) {
    try {
      // Cast userDataFromTelegram to TelegramUserData
      const userData: TelegramUserData = {
        id: userDataFromTelegram.id,
        first_name: userDataFromTelegram.first_name,
        last_name: userDataFromTelegram.last_name,
        username: userDataFromTelegram.username,
        photo_url: userDataFromTelegram.photo_url,
      };
      await handleTelegramUserData(userData, supabase);

      // Set a session cookie
      res.setHeader(
        "Set-Cookie",
        `session=${userData.id}; HttpOnly; Path=/; Max-Age=2592000`, // 30 days
      );

      // Redirect to dashboard
      res.writeHead(302, { Location: "/dashboard" });
      res.end();
    } catch (error) {
      console.error("Error handling user data:", error);
      res.status(500).json({ message: "Error processing user data" });
    }
  } else {
    // Error: hash does not match
    res.status(401).json({ message: "Authentication failed" });
  }
}
