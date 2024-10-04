import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppContext } from '@/lib/context/AppContext'
import { getUserSettings, updateUserSettings } from '@/lib/supabaseHelpers'
import { UserSettings } from '@/types/userSettings'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const { autoResponse, setAutoResponse, isResponderActive, setIsResponderActive } = useAppContext()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    } else if (user) {
      fetchSettings()
    }
  }, [user, loading, router])

  async function fetchSettings() {
    if (user) {
      const userSettings = await getUserSettings(user.id)
      if (userSettings) {
        setSettings(userSettings)
        setAutoResponse(userSettings.message_template)
        setIsResponderActive(userSettings.is_responder_active)
      }
    }
  }

  async function handleUpdateSettings() {
    if (user) {
      const success = await updateUserSettings(user.id, {
        message_template: autoResponse,
        is_responder_active: isResponderActive
      })

      if (success) {
        toast.success('Settings updated successfully!')
      } else {
        toast.error('Failed to update settings')
      }
    }
  }

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Manage your auto-response settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="autoResponse">Auto Response Message</Label>
            <Input
              id="autoResponse"
              value={autoResponse}
              onChange={(e) => setAutoResponse(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="responder-active"
              checked={isResponderActive}
              onCheckedChange={setIsResponderActive}
            />
            <Label htmlFor="responder-active">
              Auto-responder {isResponderActive ? 'active' : 'inactive'}
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleUpdateSettings}>
            Update Settings
          </Button>
          <Button onClick={signOut} variant="outline">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}