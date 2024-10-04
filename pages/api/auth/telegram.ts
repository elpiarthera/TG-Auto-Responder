import { NextApiRequest, NextApiResponse } from 'next';
import { verifyTelegramHash } from '@/lib/utils';
import { handleTelegramUserData } from '@/lib/services/supabaseService';
import { TelegramUserData } from '@/types/userSettings';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const telegramData = req.query as Record<string, string>;

  const { hash, ...userDataFromTelegram } = telegramData;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (verifyTelegramHash(userDataFromTelegram, hash, botToken)) {
    try {
      const userData: TelegramUserData = {
        id: userDataFromTelegram.id,
        first_name: userDataFromTelegram.first_name,
        last_name: userDataFromTelegram.last_name,
        username: userDataFromTelegram.username,
        photo_url: userDataFromTelegram.photo_url,
      };
      await handleTelegramUserData(userData);

      res.setHeader(
        "Set-Cookie",
        `session=${userData.id}; HttpOnly; Path=/; Max-Age=2592000`,
      );

      res.writeHead(302, { Location: "/dashboard" });
      res.end();
    } catch (error) {
      console.error("Error handling user data:", error);
      res.status(500).json({ message: "Error processing user data" });
    }
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
}
