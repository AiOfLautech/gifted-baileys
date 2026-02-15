'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QrCode, Power, CheckCircle, AlertCircle } from 'lucide-react'
import QRCodeModal from './qr-code-modal'

interface Bot {
  id: string
  name: string
  status: string
  phone_number?: string
  created_at: string
}

export default function BotOverview({ bot }: { bot: Bot }) {
  const [showQR, setShowQR] = useState(false)
  const [connectionSuccess, setConnectionSuccess] = useState(false)

  useEffect(() => {
    // Check if bot just got connected (status changed to active/connected)
    if ((bot.status === 'active' || bot.status === 'connected') && !connectionSuccess) {
      setConnectionSuccess(true)
      const timer = setTimeout(() => setConnectionSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [bot.status, connectionSuccess])

  return (
    <div className="space-y-6">
      {connectionSuccess && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Connection Successful!</p>
            <p className="text-sm text-green-700">Your bot is now connected to WhatsApp</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
        <CardHeader>
          <CardTitle>Bot Status</CardTitle>
          <CardDescription>Current connection status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
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
          </div>
          {bot.phone_number && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phone</span>
              <span className="text-sm">{bot.phone_number}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Created</span>
            <span className="text-sm">
              {new Date(bot.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="border-t pt-4 space-y-2">
            {bot.status === 'inactive' ? (
              <Button onClick={() => setShowQR(true)} className="w-full gap-2">
                <QrCode className="h-4 w-4" />
                Connect WhatsApp
              </Button>
            ) : (
              <>
                <Button variant="default" disabled className="w-full gap-2 opacity-50">
                  <Power className="h-4 w-4" />
                  Connected
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Overview of bot activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Messages Today</span>
            <span className="text-2xl font-bold">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Contacts</span>
            <span className="text-2xl font-bold">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rules Enabled</span>
            <span className="text-2xl font-bold">0</span>
          </div>
        </CardContent>
      </Card>

        <QRCodeModal open={showQR} onOpenChange={setShowQR} botId={bot.id} />
      </div>
    </div>
  )
}
