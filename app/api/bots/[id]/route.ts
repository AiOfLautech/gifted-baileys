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

    // Verify bot belongs to user
    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    const { name, description, status } = await request.json()

    const { data, error } = await supabase
      .from('bots')
      .update({
        name,
        description,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] Update bot error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update bot' },
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

    // Verify bot belongs to user
    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    const { error } = await supabase.from('bots').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Bot deleted successfully' })
  } catch (error) {
    console.error('[v0] Delete bot error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete bot' },
      { status: 500 }
    )
  }
}
