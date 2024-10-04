import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";
import { verifyTelegramHash } from "../../../lib/utils";

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
    // Success: user is authenticated
    const { id, first_name, last_name, username, photo_url } =
      userDataFromTelegram;

    // Store or update user in Supabase
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          id,
          first_name,
          last_name,
          username,
          photo_url,
        },
        { onConflict: "id" },
      );

    if (userError) {
      console.error("Error storing user:", userError);
      return res.status(500).json({ message: "Error storing user data" });
    }

    // Create or update user settings
    const { error: settingsError } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: id,
          is_responder_active: false, // default value
          message_template: "", // default value
        },
        { onConflict: "user_id" },
      );

    if (settingsError) {
      console.error("Error storing user settings:", settingsError);
      return res.status(500).json({ message: "Error storing user settings" });
    }

    // Set a session cookie
    res.setHeader(
      "Set-Cookie",
      `session=${id}; HttpOnly; Path=/; Max-Age=2592000`, // 30 days
    );

    // Redirect to dashboard
    res.writeHead(302, { Location: "/dashboard" });
    res.end();
  } else {
    // Error: hash does not match
    res.status(401).json({ message: "Authentication failed" });
  }
}
