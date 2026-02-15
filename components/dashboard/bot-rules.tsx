'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Zap } from 'lucide-react'
import CreateRuleDialog from './create-rule-dialog'

interface Rule {
  id: string
  trigger: string
  response: string
  enabled: boolean
  created_at: string
}

export default function BotRules({ rules, botId }: { rules: Rule[]; botId: string }) {
  const [open, setOpen] = useState(false)

  if (rules.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Automation Rules</h3>
            <p className="text-sm text-muted-foreground">
              Create rules to automate bot responses
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No rules yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Create your first automation rule to get started
            </p>
          </CardContent>
        </Card>
        <CreateRuleDialog open={open} onOpenChange={setOpen} botId={botId} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automation Rules</h3>
          <p className="text-sm text-muted-foreground">
            {rules.length} rule{rules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Trigger: {rule.trigger}</p>
                    <Badge
                      variant={rule.enabled ? 'default' : 'secondary'}
                      className={rule.enabled ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {rule.enabled ? 'enabled' : 'disabled'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Response: {rule.response}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <CreateRuleDialog open={open} onOpenChange={setOpen} botId={botId} />
    </div>
  )
}
