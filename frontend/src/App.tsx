import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { AppView } from './app/types'
import { AdminPage } from './pages/AdminPage'
import { CourtsPage } from './pages/CourtsPage'
import { LandingPage } from './pages/LandingPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppShell() {
  const [view, setView] = useState<AppView>('landing')

  if (view === 'admin') {
    return <AdminPage onNavigate={setView} />
  }

  if (view === 'courts') {
    return <CourtsPage onNavigate={setView} />
  }

  return <LandingPage onNavigate={setView} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  )
}
