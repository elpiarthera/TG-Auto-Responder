import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { getUserSettings, updateUserSettings } from '@/lib/services/supabaseService';
import { logger } from '@/lib/utils/logger'; // Assuming logger is setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    logger.warn('/api/settings: Unauthorized attempt. No Clerk userId found.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  logger.info(`/api/settings: Request received for user ${userId}, method: ${req.method}`);

  try {
    if (req.method === 'GET') {
      const settings = await getUserSettings(userId);
      if (settings) {
        logger.info(`/api/settings: Successfully fetched settings for user ${userId}`);
        return res.status(200).json(settings);
      } else {
        // This case might occur if user_settings row hasn't been created yet
        // The sync API /api/ensure-user-synced should handle initial creation with defaults.
        logger.info(`/api/settings: No settings found for user ${userId}, returning default structure or empty.`);
        // Consider what to return: 404 or default object.
        // For now, let's assume sync API has run and settings should exist. If not, getUserSettings might throw.
        // If getUserSettings returns null for no settings (instead of throwing for RLS/other errors):
        return res.status(200).json({ is_responder_active: false, message_template: '' }); // Or 404
      }
    } else if (req.method === 'POST') {
      const { is_responder_active, message_template } = req.body;

      // Basic validation
      if (typeof is_responder_active !== 'boolean' || typeof message_template !== 'string') {
        logger.warn(`/api/settings: Invalid request body for user ${userId}:`, req.body);
        return res.status(400).json({ error: 'Invalid request body: is_responder_active (boolean) and message_template (string) are required.' });
      }

      await updateUserSettings(userId, { is_responder_active, message_template });
      logger.info(`/api/settings: Successfully updated settings for user ${userId}`);
      return res.status(200).json({ message: 'Settings updated successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      logger.warn(`/api/settings: Method ${req.method} not allowed for user ${userId}.`);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    logger.error(`/api/settings: Error processing request for user ${userId}:`, error);
    // Check if error is from Supabase or elsewhere to customize message
    let statusCode = 500;
    let message = 'Failed to process settings.';
    if (error.message && error.message.toLowerCase().includes('failed to fetch')) { // Example check
        message = 'Failed to retrieve settings from database.';
    } else if (error.message && error.message.toLowerCase().includes('failed to update')) {
        message = 'Failed to save settings to database.';
    }
    return res.status(statusCode).json({ error: message, details: error.message });
  }
}
