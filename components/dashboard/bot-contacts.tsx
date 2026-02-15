'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function BotContacts({ botId }: { botId: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No contacts yet</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Contacts will appear here as users start interacting with your bot
        </p>
      </CardContent>
    </Card>
  )
}
