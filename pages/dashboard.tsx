import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppContext } from '@/lib/context/AppContext'
import { getUserSettings, updateUserSettings } from '@/lib/services/supabaseService'
import { toast } from 'react-toastify'

// Remove the dynamic import for ComplexChart if it's not being used
// If you need it later, make sure the component exists before importing

export default function Dashboard() {
  const { user } = useAuth()
  const { autoResponse, setAutoResponse, isResponderActive, setIsResponderActive } = useAppContext()

  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    if (user) {
      try {
        const settings = await getUserSettings(user.id)
        if (settings) {
          setAutoResponse(settings.message_template || '')
          setIsResponderActive(settings.is_responder_active || false)
        }
      } catch (error) {
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
        <CardDescription>Configure your auto-response message and activation status.</CardDescription>
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
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}