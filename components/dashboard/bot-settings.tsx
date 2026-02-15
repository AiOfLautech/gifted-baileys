'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface Bot {
  id: string
  name: string
  description: string
  config?: any
}

export default function BotSettings({ bot }: { bot: Bot }) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: bot.name,
    description: bot.description,
    autoReply: true,
    greetingMessage: 'Hello! Thanks for contacting us.',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bots/${bot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error('[v0] Error saving settings:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Settings saved successfully!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>Customize your bot behavior and responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3} 
              placeholder="What does this bot do?"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Reply Enabled</Label>
                <p className="text-sm text-muted-foreground mt-1">Automatically respond to incoming messages</p>
              </div>
              <Switch 
                checked={formData.autoReply}
                onCheckedChange={(checked) => setFormData({ ...formData, autoReply: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea 
              id="greeting" 
              value={formData.greetingMessage}
              onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
              rows={3}
              placeholder="Message sent when someone first contacts the bot"
            />
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Bot</Button>
        </CardContent>
      </Card>
    </div>
  )
}
