import { Outlet } from 'react-router'
import '@mysten/dapp-kit/dist/index.css'
import { Header } from '@/components/common/header'
import { Toaster } from '@/components/ui/sonner'

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <Toaster />
      <Header />
      <main className="w-full flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
