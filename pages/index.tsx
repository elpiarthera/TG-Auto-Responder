import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card))
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent))
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription))
const CardFooter = dynamic(() => import('@/components/ui/card').then(mod => mod.CardFooter))
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader))
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle))

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleTelegramLogin = () => {
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID}&origin=${encodeURIComponent(window.location.origin)}&return_to=${encodeURIComponent('/api/auth/telegram')}`
    window.location.href = telegramAuthUrl
  }

  if (loading) {
    return <div className="flex-center min-h-screen">Loading...</div>
  }

  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="flex-center min-h-screen bg-background">
      <Card className="w-[350px] card-hover">
        <CardHeader>
          <CardTitle className="text-gradient">Welcome to TG Auto Responder</CardTitle>
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
            className="w-full btn-primary"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Sign In with Telegram
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
