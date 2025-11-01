'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'

const queryClient = new QueryClient()

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-zinc-50">
        {/* ===== Sidebar ===== */}
        <Sidebar />

        {/* ===== Main Content ===== */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <Toaster />
      </div>
    </QueryClientProvider>
  )
}
