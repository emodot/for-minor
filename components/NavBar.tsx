'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Don't show nav on landing or login pages
  if (pathname === '/' || pathname === '/login') {
    return null
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const showBackButton = pathname !== '/home'

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link
              href="/home"
              className="flex items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          )}
          {!showBackButton && (
            <Link
              href="/home"
              className="text-lg font-light text-zinc-900 dark:text-zinc-50"
            >
              For Minor
            </Link>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </nav>
  )
}
