import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  autoResponse: string
  setAutoResponse: (value: string) => void
  isResponderActive: boolean
  setIsResponderActive: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [autoResponse, setAutoResponse] = useState('')
  const [isResponderActive, setIsResponderActive] = useState(false)

  return (
    <AppContext.Provider
      value={{
        autoResponse,
        setAutoResponse,
        isResponderActive,
        setIsResponderActive,
      }}
    >
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