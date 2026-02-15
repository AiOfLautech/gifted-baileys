import { createClient } from '@/lib/supabase/server'
import BotsList from '@/components/dashboard/bots-list'
import CreateBotDialog from '@/components/dashboard/create-bot-dialog'
import WelcomeCard from '@/components/dashboard/welcome-card'

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

  const botsCount = bots?.length || 0

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bots</h1>
          <p className="mt-2 text-muted-foreground">Create and manage your WhatsApp bots</p>
        </div>
        {botsCount > 0 && <CreateBotDialog userId={user.id} />}
      </div>

      {botsCount === 0 && <WelcomeCard userName={user.email} botsCount={botsCount} />}

      {botsCount > 0 && (
        <>
          <CreateBotDialog userId={user.id} />
          <BotsList bots={bots || []} />
        </>
      )}

      {botsCount === 0 && <BotsList bots={bots || []} />}
    </div>
  )
}
