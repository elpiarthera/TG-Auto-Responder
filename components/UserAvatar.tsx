import React from 'react'
import Image from 'next/image'

interface UserAvatarProps {
  src: string
  alt: string
  size?: number
}

export function UserAvatar({ src, alt, size = 40 }: UserAvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full"
    />
  )
}