'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth'
import { Menu, X, LogOut, Settings } from 'lucide-react'

export default function DashboardNav({ user }: { user: User }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="border-r border-border bg-card">
      {/* Desktop Nav */}
      <div className="hidden h-screen w-64 flex-col p-6 md:flex">
        <Link href="/dashboard" className="mb-8 inline-block">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">W</span>
            </div>
            <span className="text-xl font-bold">WhatsBot</span>
          </div>
        </Link>

        <div className="flex-1 space-y-4">
          <Link
            href="/dashboard"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Bots
          </Link>
          <Link
            href="/dashboard/analytics"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Analytics
          </Link>
          <Link
            href="/dashboard/contacts"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Contacts
          </Link>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex flex-1 items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex items-center justify-between border-b border-border p-4 md:hidden">
        <Link href="/dashboard" className="inline-block">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">W</span>
            </div>
            <span className="text-lg font-bold">WhatsBot</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="space-y-2 border-b border-border p-4 md:hidden">
          <Link
            href="/dashboard"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Bots
          </Link>
          <Link
            href="/dashboard/analytics"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link
            href="/dashboard/contacts"
            className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contacts
          </Link>
          <div className="border-t border-border pt-4">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
