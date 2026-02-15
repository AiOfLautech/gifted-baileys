# WhatsApp Bot Platform - Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 2: Configure Supabase

1. Create a free account at https://supabase.com
2. Create a new project
3. Copy your project URL and anon key
4. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Step 3: Initialize Database

The database schema is automatically created when you run migrations. The SQL script (`scripts/001_create_tables.sql`) includes:

- Users and authentication tables
- Bots configuration table
- Rules and message logging
- Contacts and analytics tables
- Row Level Security (RLS) policies

### Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Step 5: Create Account

1. Go to http://localhost:3000/auth/sign-up
2. Create an account with email and password
3. Confirm email (check your email inbox)
4. Login to dashboard

## Features Overview

### Dashboard
- **My Bots**: View and manage all your WhatsApp bots
- **Create Bot**: Create new bots with custom names and descriptions
- **Bot Details**: Full control panel for each bot including:
  - Overview with connection status
  - Message history and logs
  - Automation rules management
  - Contact tracking
  - Settings and configuration

### Bot Management
- **Connect WhatsApp**: Scan QR code to connect bot to WhatsApp Web
- **Upload Config**: Upload JSON configuration files with rules
- **Automation Rules**: Define trigger-response pairs for auto-reply
- **Message Tracking**: View all incoming and outgoing messages
- **Analytics**: Track bot performance and statistics

### Configuration

Create a `config.json` file for your bot:

```json
{
  "name": "My Bot",
  "description": "Bot description",
  "rules": [
    {
      "trigger": "hello",
      "response": "Hi there! How can I help?",
      "enabled": true
    },
    {
      "trigger": "help",
      "response": "Available commands:\n1. hello\n2. help",
      "enabled": true
    }
  ],
  "settings": {
    "auto_reply": true,
    "case_sensitive": false,
    "max_message_length": 1024
  }
}
```

Upload this file in the bot's Settings tab.

## API Endpoints

All endpoints require authentication (Bearer token from Supabase).

### Bot Operations
```
POST   /api/bots                  - Create bot
GET    /api/bots                  - List user's bots
PUT    /api/bots/[id]             - Update bot
DELETE /api/bots/[id]             - Delete bot
POST   /api/bots/[id]/upload      - Upload config
GET    /api/bots/[id]/qr          - Get QR code
```

### Rule Management
```
POST   /api/rules                 - Create rule
PUT    /api/rules/[id]            - Update rule
DELETE /api/rules/[id]            - Delete rule
```

### Webhooks
```
POST   /api/webhooks/messages     - Receive messages from bot
```

## Integration with Baileys

To connect this platform with actual WhatsApp bots:

### 1. Bot Server Setup

Create a separate Node.js service for running Baileys:

```javascript
import makeWASocket from '@whiskeysockets/baileys'

const sock = makeWASocket({ auth: state })

sock.ev.on('messages.upsert', async (m) => {
  for (const msg of m.messages) {
    // Send to platform webhook
    await fetch('https://your-platform/api/webhooks/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bot_id: 'bot-id',
        from_number: msg.key.remoteJid,
        message_content: msg.message.conversation,
        message_type: 'incoming'
      })
    })
  }
})
```

### 2. Session Management

Store Baileys session in Supabase:

```javascript
import { useMultiFileAuthState } from '@whiskeysockets/baileys'
import fs from 'fs'

const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

// Save to Supabase when credentials update
sock.ev.on('creds.update', saveCreds)
```

### 3. Generate QR Code

When connecting a bot, generate the QR code from Baileys:

```javascript
sock.ev.on('connection.update', (update) => {
  const { qr } = update
  if (qr) {
    // Generate data URI and send to frontend
    const qrDataUrl = await QRCode.toDataURL(qr)
    // Send to platform API
  }
})
```

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` - Email confirmation redirect (default: http://localhost:3000/auth/callback)

## Database Schema Reference

### Bots Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- name: TEXT
- description: TEXT
- status: TEXT ('active', 'inactive', 'connected')
- config: JSONB (Bot configuration)
- phone_number: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Rules Table
```sql
- id: UUID (Primary Key)
- bot_id: UUID (Foreign Key to bots)
- trigger: TEXT
- response: TEXT
- enabled: BOOLEAN
- created_at: TIMESTAMP
```

### Messages Table
```sql
- id: UUID (Primary Key)
- bot_id: UUID (Foreign Key to bots)
- contact_number: TEXT
- sender_type: TEXT ('incoming', 'outgoing')
- content: TEXT
- created_at: TIMESTAMP
```

## Troubleshooting

### "Unauthorized" Error
- Check if you're logged in
- Verify Supabase credentials in `.env.local`
- Clear browser cookies and try again

### "Bot Not Found"
- Make sure you're accessing your own bot (RLS prevents access to others' bots)
- Check bot ID is correct

### Email Not Confirming
- Check email spam/junk folder
- Verify email in Supabase Auth > Users
- Resend confirmation email

### QR Code Not Loading
- Baileys integration not configured
- Check server logs for errors
- Ensure bot server is running

## Deployment Checklist

Before deploying to production:

- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Enable Row Level Security on all tables
- [ ] Set up email verification
- [ ] Configure webhooks for bot server
- [ ] Set up rate limiting
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Test all authentication flows

## Next Steps

1. Familiarize yourself with the dashboard
2. Create your first bot
3. Set up a Baileys bot server
4. Configure automation rules
5. Test the complete workflow
6. Deploy to production

## Support & Resources

- GitHub Issues: Report bugs and request features
- Documentation: Check PLATFORM_README.md
- Examples: See /public/bot-config-example.json

## License

MIT License - See LICENSE file
