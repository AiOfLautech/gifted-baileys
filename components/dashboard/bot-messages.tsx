'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender_type: 'incoming' | 'outgoing'
  contact_number: string
  created_at: string
}

export default function BotMessages({ messages, botId }: { messages: Message[]; botId: string }) {
  if (messages.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Messages will appear here once your bot starts receiving them
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message History</CardTitle>
        <CardDescription>Recent messages from your bot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
              <Badge
                variant={message.sender_type === 'incoming' ? 'default' : 'secondary'}
                className={
                  message.sender_type === 'incoming'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-green-500 hover:bg-green-600'
                }
              >
                {message.sender_type}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">{message.contact_number}</p>
                <p className="mt-1 text-sm text-muted-foreground">{message.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
