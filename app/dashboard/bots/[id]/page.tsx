import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import BotDetailView from '@/components/dashboard/bot-detail-view'

export default async function BotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch bot
  const { data: bot, error } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !bot) {
    notFound()
  }

  // Fetch bot messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('bot_id', id)
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch bot rules
  const { data: rules } = await supabase
    .from('rules')
    .select('*')
    .eq('bot_id', id)
    .order('created_at', { ascending: false })

  return <BotDetailView bot={bot} messages={messages || []} rules={rules || []} />
}
