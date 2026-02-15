'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'

interface WelcomeCardProps {
  userName?: string
  botsCount: number
}

export default function WelcomeCard({ userName, botsCount }: WelcomeCardProps) {
  if (botsCount > 0) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Welcome to WhatsBot!
        </CardTitle>
        <CardDescription>
          Get your first WhatsApp bot running in 3 simple steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <div>
              <h4 className="font-medium">Create Your Bot</h4>
              <p className="text-sm text-muted-foreground">
                Click "Create Bot" and give it a name and description
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </div>
            <div>
              <h4 className="font-medium">Connect WhatsApp</h4>
              <p className="text-sm text-muted-foreground">
                Scan the QR code to link your WhatsApp account
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              3
            </div>
            <div>
              <h4 className="font-medium">Configure & Start</h4>
              <p className="text-sm text-muted-foreground">
                Set up your bot's greeting message and start automating
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex gap-2">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full gap-2" size="sm">
              <MessageSquare className="h-4 w-4" />
              Create Your Bot
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="https://github.com/AiOfLautech/gifted-baileys/wiki" target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Learn More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
