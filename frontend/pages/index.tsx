import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleTelegramLogin = () => {
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID}&origin=${encodeURIComponent(window.location.origin)}&return_to=${encodeURIComponent('/api/auth/telegram')}`
    window.location.href = telegramAuthUrl
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to TG Auto Responder</CardTitle>
          <CardDescription>Sign in to manage your auto-response settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Automate your Telegram responses with ease.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleTelegramLogin}
            className="w-full"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Sign In with Telegram
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}