import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This webhook receives messages from the Baileys bot instance
// In a real implementation, this would be called by the bot server when it receives messages

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bot_id, from_number, message_content, message_type = 'incoming' } = body

    if (!bot_id || !from_number || !message_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Store message in database
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        bot_id,
        contact_number: from_number,
        sender_type: message_type,
        content: message_content,
      })
      .select()

    if (messageError) throw messageError

    // Get bot rules to see if any match
    const { data: rules } = await supabase
      .from('rules')
      .select('*')
      .eq('bot_id', bot_id)
      .eq('enabled', true)

    let auto_response = null

    // Check if any rule matches the message
    if (rules && message_type === 'incoming') {
      for (const rule of rules) {
        const triggerLower = rule.trigger.toLowerCase()
        const messageLower = message_content.toLowerCase()

        if (messageLower.includes(triggerLower)) {
          auto_response = rule.response

          // Store the outgoing response message
          await supabase.from('messages').insert({
            bot_id,
            contact_number: from_number,
            sender_type: 'outgoing',
            content: auto_response,
          })

          break
        }
      }
    }

    return NextResponse.json({
      message: 'Message processed',
      auto_response,
    })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
