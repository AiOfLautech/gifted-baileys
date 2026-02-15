import { createClient } from '@/lib/supabase/server'
import BotsList from '@/components/dashboard/bots-list'
import CreateBotDialog from '@/components/dashboard/create-bot-dialog'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Fetch user's bots
  const { data: bots, error } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bots</h1>
          <p className="mt-2 text-muted-foreground">Create and manage your WhatsApp bots</p>
        </div>
        <CreateBotDialog userId={user.id} />
      </div>

      <BotsList bots={bots || []} />
    </div>
  )
}
