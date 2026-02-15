import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get rule and verify bot belongs to user
    const { data: rule } = await supabase
      .from('rules')
      .select('bot_id')
      .eq('id', id)
      .single()

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', rule.bot_id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { trigger, response, enabled } = await request.json()

    const { data, error } = await supabase
      .from('rules')
      .update({
        trigger,
        response,
        enabled,
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] Update rule error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update rule' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get rule and verify bot belongs to user
    const { data: rule } = await supabase
      .from('rules')
      .select('bot_id')
      .eq('id', id)
      .single()

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', rule.bot_id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase.from('rules').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Rule deleted successfully' })
  } catch (error) {
    console.error('[v0] Delete rule error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete rule' },
      { status: 500 }
    )
  }
}
