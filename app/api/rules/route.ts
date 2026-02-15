import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bot_id, trigger, response, enabled } = await request.json()

    // Verify bot belongs to user
    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', bot_id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('rules')
      .insert({
        bot_id,
        trigger,
        response,
        enabled: enabled ?? true,
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('[v0] Create rule error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create rule' },
      { status: 500 }
    )
  }
}
