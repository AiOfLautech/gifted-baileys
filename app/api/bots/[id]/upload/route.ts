import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate JSON file
    const text = await file.text()
    let config
    try {
      config = JSON.parse(text)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 })
    }

    // Update bot config
    const { error: updateError } = await supabase
      .from('bots')
      .update({
        config: config,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({
      message: 'Configuration uploaded successfully',
      config,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
