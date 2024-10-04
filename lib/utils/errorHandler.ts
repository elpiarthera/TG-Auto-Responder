import { NextApiResponse } from 'next'

export function handleError(error: unknown, res: NextApiResponse) {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
  console.error(errorMessage)
  
  res.status(500).json({ error: 'Internal Server Error' })
}