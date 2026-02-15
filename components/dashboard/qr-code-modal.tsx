'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

interface QRCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  botId: string
}

export default function QRCodeModal({ open, onOpenChange, botId }: QRCodeModalProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setLoading(true)
      setError(null)
      setQrCode(null)
      return
    }

    const fetchQRCode = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/bots/${botId}/qr`)
        if (!response.ok) {
          throw new Error('Failed to generate QR code')
        }

        const data = await response.json()
        setQrCode(data.qr_code)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      } finally {
        setLoading(false)
      }
    }

    fetchQRCode()
  }, [open, botId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp</DialogTitle>
          <DialogDescription>
            Scan this QR code with your WhatsApp to connect your bot
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8">
          {loading ? (
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/5">
              <div className="flex flex-col items-center gap-2 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : qrCode ? (
            <div className="rounded-lg border bg-white p-4 inline-block">
              <img 
                src={qrCode} 
                alt="WhatsApp QR Code" 
                className="h-64 w-64"
              />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Scan with your WhatsApp device to connect
              </p>
            </div>
          ) : (
            <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  QR code will appear once the bot server is running
                </p>
                <p className="text-xs text-muted-foreground">
                  Make sure your Baileys bot instance is connected
                </p>
              </div>
            </div>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            This will connect bot {botId} to WhatsApp Web
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Make sure you have WhatsApp installed on your device
          </p>
          {error && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
