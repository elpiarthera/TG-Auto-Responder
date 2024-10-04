import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  autoResponse: string
  setAutoResponse: (response: string) => void
  isResponderActive: boolean
  setIsResponderActive: (active: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [autoResponse, setAutoResponse] = useState('')
  const [isResponderActive, setIsResponderActive] = useState(false)

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      autoResponse,
      setAutoResponse,
      isResponderActive,
      setIsResponderActive
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}