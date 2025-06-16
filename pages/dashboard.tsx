import { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUser } from '@clerk/nextjs';
import { useAppContext } from '@/lib/context/AppContext'
import { getUserSettings, updateUserSettings } from '@/lib/services/supabaseService'
import { toast } from 'react-toastify'
// import { useRouter } from 'next/router'; // If manual redirect is needed

// Remove the dynamic import for ComplexChart if it's not being used
// If you need it later, make sure the component exists before importing

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  // const router = useRouter(); // If manual redirect is needed
  const { autoResponse, setAutoResponse, isResponderActive, setIsResponderActive } = useAppContext()

  // New useEffect for syncing user
  useEffect(() => {
    const ensureSync = async () => {
      if (isSignedIn && user) { // Check if user is signed in and user object is available
        console.log(`Dashboard: User ${user.id} is signed in. Attempting to sync user data.`);
        try {
          const response = await fetch('/api/ensure-user-synced', {
            method: 'POST',
          });
          if (!response.ok) {
            const errorData = await response.json();
            toast.error(`Failed to sync user data: ${errorData.error || response.statusText}`);
            console.error('Failed to sync user data with backend:', errorData);
          } else {
            console.log('User data sync initiated successfully or already up-to-date.');
            // After successful sync, then load user settings
            // The existing loadUserSettings useEffect might depend on `user`, which is fine.
            // Or, explicitly call loadUserSettings here if it's not triggered automatically.
          }
        } catch (error) {
          toast.error('An error occurred while trying to sync user data.');
          console.error('Error calling /api/ensure-user-synced:', error);
        }
      }
    };

    ensureSync();
  }, [isSignedIn, user]); // Dependency array ensures this runs when auth state is confirmed

  const loadUserSettings = useCallback(async () => {
    if (isSignedIn && user) { // Ensure user object is available
      try {
        const settings = await getUserSettings(user.id) // user.id is now Clerk's user ID
        if (settings) {
          setAutoResponse(settings.message_template || '')
          setIsResponderActive(settings.is_responder_active || false)
        }
      } catch (error) {
        toast.error('Failed to load settings')
      }
    }
  }, [isSignedIn, user, setAutoResponse, setIsResponderActive]) // getUserSettings and toast are stable

  useEffect(() => {
    if (isSignedIn && user) { // Ensure user object is available before loading settings
      loadUserSettings()
    }
  }, [isSignedIn, user, loadUserSettings])

  const handleSaveSettings = async () => {
    if (isSignedIn && user) { // Ensure user object is available
      try {
        await updateUserSettings(user.id, { // user.id is now Clerk's user ID
          message_template: autoResponse,
          is_responder_active: isResponderActive
        })
        toast.success('Settings saved successfully')
      } catch (error) {
        toast.error('Failed to save settings')
      }
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isSignedIn) {
    // Middleware should ideally handle this redirect for protected pages.
    // If accessed directly and not signed in, Clerk might show its own UI or redirect.
    // router.push('/'); // Example of manual redirect if needed
    return <div>Redirecting to login...</div>;
  }

  // If execution reaches here, user is loaded and signed in.
  // And user object should be available.
  if (!user) {
    // This case should ideally not be reached if isLoaded and isSignedIn are true.
    // But as a safeguard:
    return <div>Error: User data not available.</div>;
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