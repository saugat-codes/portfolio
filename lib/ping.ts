// Utility to periodically ping Supabase to keep it awake
let pingInterval: NodeJS.Timeout | null = null

export function startPeriodicPing() {
  // Don't start if already running or in production
  if (pingInterval || process.env.NODE_ENV === 'production') {
    return
  }

  console.log('Starting periodic Supabase ping...')
  
  // Ping every 11 hours (just under 12 hours to be safe)
  const interval = 11 * 60 * 60 * 1000 // 11 hours in milliseconds
  
  pingInterval = setInterval(async () => {
    try {
      const response = await fetch('/api/ping')
      const result = await response.json()
      console.log('Ping result:', result)
    } catch (error) {
      console.error('Failed to ping Supabase:', error)
    }
  }, interval)

  // Also ping immediately on start
  setTimeout(async () => {
    try {
      const response = await fetch('/api/ping')
      const result = await response.json()
      console.log('Initial ping result:', result)
    } catch (error) {
      console.error('Failed to ping Supabase initially:', error)
    }
  }, 5000) // Wait 5 seconds after app starts
}

export function stopPeriodicPing() {
  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
    console.log('Stopped periodic Supabase ping')
  }
}

// Auto-start in browser environment
if (typeof window !== 'undefined') {
  // Start pinging when the app loads
  startPeriodicPing()
  
  // Stop pinging when the page is about to unload
  window.addEventListener('beforeunload', stopPeriodicPing)
}
