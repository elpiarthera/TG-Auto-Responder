import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server'; // To get authenticated user server-side
import { clerkClient } from '@clerk/clerk-sdk-node'; // To fetch full user details if needed
import { syncClerkUserToSupabase, ClerkUserData } from '@/lib/utils/telegramAuth'; // Assuming path
import { logger } from '@/lib/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userId: clerkUserId } = getAuth(req); // Get Clerk user ID from session

    if (!clerkUserId) {
      logger.warn('/api/ensure-user-synced: User not authenticated via Clerk.');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    logger.info(`/api/ensure-user-synced: Authenticated Clerk User ID: ${clerkUserId}`);

    // Fetch the full Clerk user object to get external account details (Telegram info)
    // and profile details that Clerk has synced from Telegram.
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    if (!clerkUser) {
      logger.error(`/api/ensure-user-synced: Clerk user not found with ID: ${clerkUserId}`);
      return res.status(404).json({ error: 'Clerk user not found' });
    }

    // Extract Telegram specific data from Clerk's user object
    // This part is CRITICAL and depends on how Clerk stores external OAuth provider data.
    // Typically, it's in externalAccounts or user.providerData.
    // We need to find the entry for 'oauth_telegram'.
    const telegramAccount = clerkUser.externalAccounts.find(acc => acc.provider === 'oauth_telegram');

    let telegramNumericId: string | undefined = undefined;
    let photoUrl = clerkUser.imageUrl; // Clerk's primary image URL
    let username = clerkUser.username; // Clerk's primary username, might not be Telegram's
    let firstName = clerkUser.firstName;
    let lastName = clerkUser.lastName;

    if (telegramAccount) {
      logger.info(`/api/ensure-user-synced: Found Telegram external account for Clerk ID ${clerkUserId}`, telegramAccount);
      telegramNumericId = telegramAccount.providerUserId; // This is usually the Telegram numeric ID

      // Clerk might also store email, first/last name, username from the provider.
      // We need to check if externalAccount has specific profile data we prefer over clerkUser root fields.
      // For example, if externalAccount has its own 'username' or 'imageUrl' from Telegram.
      // For now, we assume clerkUser's root properties are sufficiently synced or are the source of truth.
      // If Clerk's `clerkUser.username` is not necessarily the Telegram username, and
      // `telegramAccount.username` exists, that might be preferable for the `users.username` field.
      // This needs verification against Clerk's actual data structure for Telegram OAuth.
      if (telegramAccount.username) { // Example: if Clerk provides it here
          username = telegramAccount.username;
      }
      if (telegramAccount.imageUrl) { // Example
          photoUrl = telegramAccount.imageUrl;
      }
      // firstName and lastName are usually taken from clerkUser.firstName/lastName
      // which Clerk populates from provider data.

    } else {
      logger.warn(`/api/ensure-user-synced: No linked Telegram account found for Clerk User ID: ${clerkUserId}. User might have signed up with a different method or data is missing.`);
      // We might still proceed to sync based on Clerk's primary data if that's desired,
      // or return an error if Telegram linkage is strictly required.
      // For an auto-responder, the Telegram ID is essential.
      // However, if they signed up via email then linked Telegram, this flow might be different.
      // For now, let's assume direct Telegram signup via Clerk is the primary path.
      // If telegramNumericId is critical and not found, we might want to error.
      // For now, syncClerkUserToSupabase will handle a potentially undefined telegramNumericId.
    }

    const clerkDataForSupabase: ClerkUserData = {
      clerkUserId: clerkUser.id, // Ensure this is the non-nullable ID
      telegramNumericId: telegramNumericId,
      firstName: firstName,
      lastName: lastName,
      username: username, // This should ideally be the Telegram username
      photoUrl: photoUrl,
    };

    await syncClerkUserToSupabase(clerkDataForSupabase);
    logger.info(`/api/ensure-user-synced: User data sync successful for Clerk ID: ${clerkUserId}`);
    return res.status(200).json({ message: 'User synced successfully' });

  } catch (error: any) {
    logger.error('/api/ensure-user-synced: Error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.message) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    // Check for Clerk specific errors if any have distinct structure
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        errorMessage = error.errors.map((e: any) => e.message || e.longMessage).join(', ');
    }
    return res.status(500).json({ error: 'Failed to sync user', details: errorMessage });
  }
}
