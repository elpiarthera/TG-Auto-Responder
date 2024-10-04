import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const telegramData = req.query as Record<string, string>;

  // Step 1: Extract relevant data
  const { hash, ...userDataFromTelegram } = telegramData;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const secret = crypto.createHash('sha256').update(botToken || '', 'utf8').digest();

  // Step 2: Build the string to verify against the hash
  const checkString = Object.keys(userDataFromTelegram)
    .sort()
    .map((key) => `${key}=${userDataFromTelegram[key]}`)
    .join('\n');

  // Step 3: Generate the hash and compare
  const computedHash = crypto.createHmac('sha256', secret).update(checkString).digest('hex');

  if (computedHash === hash) {
    // Success: user is authenticated
    const { id, first_name, last_name, username, photo_url } = userDataFromTelegram;
    
    // Store or update user in Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({ 
        id, 
        first_name, 
        last_name, 
        username, 
        photo_url 
      }, { onConflict: 'id' });

    if (userError) {
      console.error('Error storing user:', userError);
      return res.status(500).json({ message: 'Error storing user data' });
    }

    // Create or update user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .upsert({ 
        user_id: id,
        is_responder_active: false, // default value
        message_template: '' // default value
      }, { onConflict: 'user_id' });

    if (settingsError) {
      console.error('Error storing user settings:', settingsError);
      return res.status(500).json({ message: 'Error storing user settings' });
    }

    // Set a session cookie
    res.setHeader('Set-Cookie', `session=${id}; HttpOnly; Path=/; Max-Age=2592000`); // 30 days

    // Redirect to dashboard
    res.writeHead(302, { Location: '/dashboard' });
    res.end();
  } else {
    // Error: hash does not match
    res.status(401).json({ message: 'Authentication failed' });
  }
}