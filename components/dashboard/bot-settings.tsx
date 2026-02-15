'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from './file-upload'

interface Bot {
  id: string
  name: string
  description: string
  config?: any
}

export default function BotSettings({ bot }: { bot: Bot }) {
  const [loading, setLoading] = useState(false)

  const handleUploadConfig = async (file: File) => {
    setLoading(true)
    try {
      // Parse and validate the config file
      const content = await file.text()
      const config = JSON.parse(content)
      console.log('[v0] Config uploaded:', config)
      // TODO: Save config to Supabase
    } catch (err) {
      console.error('[v0] Error parsing config:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>Update your bot settings and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input id="name" defaultValue={bot.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue={bot.description} rows={3} />
          </div>
          <Button disabled={loading}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Configuration File</CardTitle>
          <CardDescription>
            Upload a JSON file with bot behavior rules and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload onFileSelect={handleUploadConfig} accept=".json" />
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
