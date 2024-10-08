import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // per 1 second
})

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export async function rateLimiterMiddleware(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  try {
    await rateLimiter.consume(req.socket.remoteAddress!)
    return true
  } catch {
    res.status(429).json({ message: 'Too Many Requests' })
    return false
  }
}

export { cors }