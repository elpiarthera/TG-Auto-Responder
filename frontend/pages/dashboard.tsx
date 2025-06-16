import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAppContext } from '@/lib/context/AppContext'
import { getUserSettings, updateUserSettings } from '@/lib/utils/supabaseHelpers'
import { toast } from 'react-toastify'

// ... rest of the file content ...