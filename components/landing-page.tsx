'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle, Zap, BarChart3, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">WhatsBot</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition">
              Pricing
            </a>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 mb-8">
              <span className="text-xs font-medium text-primary">✨ NEW</span>
              <span className="text-xs text-muted-foreground">Advanced automation features available</span>
            </div>
            <h1 className="text-balance text-4xl font-bold sm:text-6xl">
              Create WhatsApp Bots That <span className="text-primary">Actually Work</span>
            </h1>
            <p className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl">
              Build and deploy powerful WhatsApp bots without coding. Connect to WhatsApp in seconds, 
              automate your business, and manage everything from one dashboard.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-balance text-3xl font-bold sm:text-4xl">Powerful Features Built for Growth</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to create, manage, and scale your WhatsApp bot automation
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="group rounded-xl border border-border bg-card/50 p-6 hover:border-primary/50 transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-balance text-3xl font-bold sm:text-4xl">Get Started in 3 Steps</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="absolute right-0 top-8 hidden sm:block h-1 w-1/3 bg-gradient-to-r from-primary/50 to-transparent -mr-1/3" />
                )}
                <div className="rounded-xl border border-border bg-card/50 p-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card/50 p-8 text-center">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card/50 p-12 text-center">
            <h2 className="text-balance text-3xl font-bold sm:text-4xl">Ready to Automate?</h2>
            <p className="mt-4 text-muted-foreground">Join thousands of businesses automating their WhatsApp communication</p>
            <Link href="/auth/sign-up" className="mt-8 inline-block">
              <Button size="lg" className="gap-2">
                Create Your First Bot <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                W
              </div>
              <span className="font-semibold">WhatsBot</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 WhatsBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    name: 'Instant Connection',
    description: 'Connect to WhatsApp with a simple QR code scan',
    icon: <MessageCircle className="h-6 w-6" />,
  },
  {
    name: 'Smart Automation',
    description: 'Create rules and automate responses instantly',
    icon: <Zap className="h-6 w-6" />,
  },
  {
    name: 'Advanced Analytics',
    description: 'Track messages, engagement, and bot performance',
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    name: 'Team Collaboration',
    description: 'Manage multiple bots with your team',
    icon: <Users className="h-6 w-6" />,
  },
]

const steps = [
  {
    title: 'Create Your Bot',
    description: 'Set up a new bot with a name and description in just seconds',
  },
  {
    title: 'Connect WhatsApp',
    description: 'Scan the QR code to connect your WhatsApp account',
  },
  {
    title: 'Start Automating',
    description: 'Upload your rules and begin automating responses',
  },
]

const stats = [
  { value: '1000+', label: 'Active Bots' },
  { value: '50M+', label: 'Messages Processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]
