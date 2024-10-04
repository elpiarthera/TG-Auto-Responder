import crypto from 'crypto'

export function generateTelegramHash(data: Record<string, string>, botToken: string): string {
  const secret = crypto.createHash('sha256').update(botToken).digest()
  const checkString = Object.keys(data)
    .sort()
    .map(k => `${k}=${data[k]}`)
    .join('\n')
  return crypto.createHmac('sha256', secret).update(checkString).digest('hex')
}

export function verifyTelegramHash(data: Record<string, string>, hash: string, botToken: string): boolean {
  const generatedHash = generateTelegramHash(data, botToken)
  return generatedHash === hash
}

// Keep the existing cn function
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
