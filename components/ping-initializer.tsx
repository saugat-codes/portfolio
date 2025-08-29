"use client"

import { useEffect } from 'react'

export default function PingInitializer() {
  useEffect(() => {
    // Import and start the ping system only on client side
    import('@/lib/ping').then(({ startPeriodicPing }) => {
      startPeriodicPing()
    })
  }, [])

  // This component renders nothing
  return null
}
