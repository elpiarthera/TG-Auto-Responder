import React, { useEffect } from 'react'
import Image from 'next/image' // Add this import
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppContext } from '@/lib/context/AppContext'
import { getUserSettings, updateUserSettings } from '@/lib/utils/supabaseHelpers'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

const ComplexChart = dynamic(() => import('@/components/ComplexChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // If the chart library doesn't support SSR
})

export default function Dashboard() {
  const { user } = useAuth()
  const { autoResponse, setAutoResponse, isResponderActive, setIsResponderActive } = useAppContext()

  useEffect(() => {
    if (user) {
      fetchUserSettings()
    }
  }, [user])

  const fetchUserSettings = async () => {
    if (user) {
      try {
        const settings = await getUserSettings(user.id)
        setAutoResponse(settings.message_template)
        setIsResponderActive(settings.is_responder_active)
      } catch (error) {
        console.error('Error fetching user settings:', error)
        toast.error('Failed to load settings')
      }
    }
  }

  const handleSaveSettings = async () => {
    if (user) {
      try {
        await updateUserSettings(user.id, {
          message_template: autoResponse,
          is_responder_active: isResponderActive
        })
        toast.success('Settings saved successfully')
      } catch (error) {
        console.error('Error saving settings:', error)
        toast.error('Failed to save settings')
      }
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto Responder Settings</CardTitle>
        {user && user.profileImageUrl && (
          <div className="flex items-center space-x-4">
            <Image
              src={user.profileImageUrl}
              alt={`${user.name}'s profile`}
              width={50}
              height={50}
              className="rounded-full"
            />
            <span>{user.name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="auto-response">Auto Response Message</Label>
            <Input
              id="auto-response"
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
            <Label htmlFor="responder-active">Activate Auto Responder</Label>
          </div>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}