pages/index.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@supabase/supabase-js'
import { BrandTelegram } from 'lucide-react'

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LoginPage() {
const [isAuthenticated, setIsAuthenticated] = useState(false)
const router = useRouter()

useEffect(() => {
checkAuth()
}, [])

async function checkAuth() {
const { data: { user } } = await supabase.auth.getUser()
if (user) {
setIsAuthenticated(true)
router.push('/dashboard')
}
}

const handleLogin = async () => {
const { error } = await supabase.auth.signInWithOAuth({
provider: 'telegram',
})
if (error) console.error('Error logging in:', error)
}

const handleLogout = async () => {
const { error } = await supabase.auth.signOut()
if (error) console.error('Error logging out:', error)
else setIsAuthenticated(false)
}

return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
<Card className="w-[350px]">
<CardHeader>
<CardTitle className="text-center">Telegram Auto-Responder</CardTitle>
<CardDescription className="text-center">Login to manage your auto-responder</CardDescription>
</CardHeader>
<CardContent>
{!isAuthenticated ? (
<Button className="w-full bg-[#0088cc] hover:bg-[#0077b5]" onClick={handleLogin}>
<BrandTelegram className="mr-2 h-4 w-4" />
Login with Telegram
</Button>
) : (
<Button className="w-full" variant="outline" onClick={handleLogout}>
Logout
</Button>
)}
</CardContent>
</Card>
</div>
)
}

pages/dashboard.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createClient } from '@supabase/supabase-js'
import { LogOut, Save } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function DashboardPage() {
const [user, setUser] = useState(null)
const [isResponderActive, setIsResponderActive] = useState(false)
const [messageTemplate, setMessageTemplate] = useState('')
const router = useRouter()

useEffect(() => {
checkAuth()
fetchUserSettings()
}, [])

async function checkAuth() {
const { data: { user } } = await supabase.auth.getUser()
if (user) {
setUser(user)
} else {
router.push('/')
}
}

async function fetchUserSettings() {
const { data, error } = await supabase
.from('user_settings')
.select('is_responder_active, message_template')
.single()

    if (data) {
      setIsResponderActive(data.is_responder_active)
      setMessageTemplate(data.message_template)
    } else if (error) {
      console.error('Error fetching user settings:', error)
    }

}

async function updateSettings() {
const { error } = await supabase
.from('user_settings')
.upsert({
user_id: user.id,
is_responder_active: isResponderActive,
message_template: messageTemplate
})

    if (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    } else {
      toast.success('Settings updated successfully!')
    }

}

const handleLogout = async () => {
const { error } = await supabase.auth.signOut()
if (error) console.error('Error logging out:', error)
else router.push('/')
}

if (!user) {
return <div className="flex items-center justify-center min-h-screen">Loading...</div>
}

return (
<div className="container mx-auto p-4">
<Card className="w-full max-w-2xl mx-auto">
<CardHeader className="flex flex-row items-center justify-between">
<div>
<CardTitle>Dashboard</CardTitle>
<CardDescription>Manage your auto-responder settings</CardDescription>
</div>
<Button variant="outline" size="icon" onClick={handleLogout}>
<LogOut className="h-4 w-4" />
</Button>
</CardHeader>
<CardContent className="space-y-6">
<div>
<h3 className="text-lg font-medium">Welcome, {user.user_metadata?.username || 'User'}</h3>
</div>
<div className="flex items-center space-x-2">
<Switch
              id="auto-responder"
              checked={isResponderActive}
              onCheckedChange={setIsResponderActive}
            />
<Label htmlFor="auto-responder">Auto-Responder {isResponderActive ? 'On' : 'Off'}</Label>
</div>
<div className="space-y-2">
<Label htmlFor="message-template">Message Template</Label>
<Input
id="message-template"
placeholder="Enter your auto-response message"
value={messageTemplate}
onChange={(e) => setMessageTemplate(e.target.value)}
/>
</div>
</CardContent>
<CardFooter>
<Button className="w-full" onClick={updateSettings}>
<Save className="mr-2 h-4 w-4" />
Save Settings
</Button>
</CardFooter>
</Card>
<ToastContainer position="bottom-right" />
</div>
)
}

lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
