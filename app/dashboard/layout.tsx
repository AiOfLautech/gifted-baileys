import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard/nav'

export const metadata: Metadata = {
  title: 'Dashboard - WhatsApp Bot Platform',
  description: 'Manage your WhatsApp bots',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav user={user} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
