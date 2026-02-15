'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Zap, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface Bot {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'connected'
  phone_number?: string
  created_at: string
  message_count?: number
}

export default function BotsList({ bots }: { bots: Bot[] }) {
  if (bots.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No bots yet</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create your first WhatsApp bot to get started
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bots.map((bot) => (
        <Link key={bot.id} href={`/dashboard/bots/${bot.id}`}>
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1">{bot.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {bot.description || 'No description'}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={bot.status === 'active' ? 'default' : 'secondary'}
                  className={
                    bot.status === 'active'
                      ? 'bg-green-500 hover:bg-green-600'
                      : bot.status === 'connected'
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : ''
                  }
                >
                  {bot.status}
                </Badge>
                {bot.phone_number && (
                  <span className="text-xs text-muted-foreground">{bot.phone_number}</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>{bot.message_count || 0} messages</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
