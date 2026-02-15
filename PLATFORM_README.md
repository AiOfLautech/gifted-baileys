# WhatsApp Bot Platform

A comprehensive web platform for creating, managing, and deploying WhatsApp bots powered by Baileys. Build automated WhatsApp bots without coding through our intuitive dashboard.

## Features

✨ **Easy Bot Creation** - Create bots in seconds with our simple interface
🔗 **WhatsApp Integration** - Connect directly to WhatsApp Web via QR code
⚙️ **Automation Rules** - Define triggers and responses without coding
📊 **Analytics & Logs** - Track bot performance and message history
👥 **Multi-Bot Support** - Manage multiple bots from one dashboard
📁 **Configuration Management** - Upload and manage bot configs via JSON
🔒 **Secure** - Built on Supabase with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (create at https://supabase.com)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd whatsapp-bot-platform
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:3000 to see the platform.

## Project Structure

```
├── app/
│   ├── api/                    # API routes for bot operations
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # Main dashboard pages
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Root layout
├── components/
│   ├── dashboard/              # Dashboard components
│   ├── landing-page.tsx        # Landing page component
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase/              # Supabase client setup
│   └── auth.ts                # Authentication helpers
├── scripts/                    # Database migration scripts
└── public/                     # Static files
```

## Database Schema

### Tables

- **bots** - Bot configurations and metadata
- **rules** - Automation rules (trigger/response pairs)
- **messages** - Message history and logs
- **contacts** - Contact information and interactions
- **analytics** - Performance metrics and statistics
- **file_uploads** - Configuration file storage

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Configuration File Format

Upload a JSON configuration file to define your bot's behavior:

```json
{
  "name": "Customer Support Bot",
  "description": "Automated support chatbot",
  "rules": [
    {
      "trigger": "hello",
      "response": "Hello! How can I help?",
      "enabled": true
    }
  ],
  "settings": {
    "auto_reply": true,
    "case_sensitive": false
  }
}
```

See `/public/bot-config-example.json` for a complete example.

## API Endpoints

### Bots
- `POST /api/bots` - Create a new bot
- `PUT /api/bots/[id]` - Update bot configuration
- `DELETE /api/bots/[id]` - Delete a bot
- `POST /api/bots/[id]/upload` - Upload bot configuration
- `GET /api/bots/[id]/qr` - Get QR code for WhatsApp connection

### Rules
- `POST /api/rules` - Create automation rule
- `PUT /api/rules/[id]` - Update rule
- `DELETE /api/rules/[id]` - Delete rule

### Webhooks
- `POST /api/webhooks/messages` - Receive incoming messages from bot

## Authentication

The platform uses Supabase Authentication with:
- Email/password sign up and login
- Email confirmation for security
- Row Level Security (RLS) for data protection
- Secure session management with HTTP-only cookies

## Baileys Integration

To connect the platform with actual WhatsApp bots:

1. Install and configure Baileys in your bot server:
```bash
npm install @whiskeysockets/baileys
```

2. Initialize Baileys with bot credentials
3. Configure webhook URL to point to `/api/webhooks/messages`
4. Bot will automatically process messages and send responses

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

```bash
vercel deploy
```

## Security Considerations

⚠️ **Important Security Notes:**
- Never expose your Supabase private key in client-side code
- Use Row Level Security (RLS) policies for data protection
- Validate all user inputs on the server side
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Store WhatsApp session data securely

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Contact support team

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Roadmap

- [ ] Real-time message streaming with WebSockets
- [ ] Advanced analytics dashboard with charts
- [ ] Team collaboration and permissions
- [ ] Message templates and quick replies
- [ ] AI-powered response suggestions
- [ ] API for third-party integrations
- [ ] Mobile app for iOS/Android
- [ ] Scheduled messages
- [ ] Group chat support
- [ ] Media file handling (images, documents)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Bot Framework**: Baileys (WhatsApp Web API)

## Acknowledgments

- Baileys library for WhatsApp Web integration
- Supabase for backend infrastructure
- shadcn/ui for beautiful components
- Next.js for the amazing framework
