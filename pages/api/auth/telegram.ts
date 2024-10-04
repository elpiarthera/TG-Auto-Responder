import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAndStoreUserData } from '@/lib/utils/telegramAuth';
import { handleError } from '@/lib/utils/errorHandler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { hash, ...userData } = req.query as Record<string, string>;

    const verifiedUserData = await verifyAndStoreUserData(userData, hash);

    if (!verifiedUserData) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    res.setHeader(
      "Set-Cookie",
      `session=${verifiedUserData.id}; HttpOnly; Path=/; Max-Age=2592000`,
    );

    res.writeHead(302, { Location: "/dashboard" });
    res.end();
  } catch (error) {
    handleError(error, res);
  }
}
