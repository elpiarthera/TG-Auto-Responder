import { NextApiResponse } from 'next'
import winston from 'winston'

// Initialize logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' })
  ]
})

export function handleError(error: unknown, res: NextApiResponse) {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
  logger.error(errorMessage)
  
  res.status(500).json({ error: 'Internal Server Error' })
}