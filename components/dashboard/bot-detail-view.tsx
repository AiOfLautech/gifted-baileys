'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BotOverview from './bot-overview'
import BotMessages from './bot-messages'
import BotRules from './bot-rules'
import BotContacts from './bot-contacts'
import BotSettings from './bot-settings'

interface Bot {
  id: string
  name: string
  description: string
  status: string
  phone_number?: string
  config?: any
  created_at: string
}

interface Message {
  id: string
  content: string
  sender_type: 'incoming' | 'outgoing'
  contact_number: string
  created_at: string
}

interface Rule {
  id: string
  trigger: string
  response: string
  enabled: boolean
  created_at: string
}

export default function BotDetailView({
  bot,
  messages,
  rules,
}: {
  bot: Bot
  messages: Message[]
  rules: Rule[]
}) {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">{bot.name}</h1>
        <p className="mt-1 text-muted-foreground">{bot.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BotOverview bot={bot} />
        </TabsContent>

        <TabsContent value="messages">
          <BotMessages messages={messages} botId={bot.id} />
        </TabsContent>

        <TabsContent value="rules">
          <BotRules rules={rules} botId={bot.id} />
        </TabsContent>

        <TabsContent value="contacts">
          <BotContacts botId={bot.id} />
        </TabsContent>

        <TabsContent value="settings">
          <BotSettings bot={bot} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
