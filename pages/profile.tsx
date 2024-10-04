import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {user.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              alt={`${user.name}'s profile`}
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p>{user.email}</p>
          {/* Add more user details as needed */}
        </div>
      </CardContent>
    </Card>
  )
}