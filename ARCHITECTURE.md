# WhatsApp Bot Platform - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     WHATSAPP BOT PLATFORM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   User Dashboard     │         │  Landing Page        │
│  (Next.js 16 App)    │         │  (Marketing + Auth)  │
│                      │         │                      │
│ • Dashboard          │         │ • Features           │
│ • Bot Management     │         │ • Pricing            │
│ • Settings           │         │ • CTA Buttons        │
│ • Rules Editor       │         │ • Social Proof       │
│ • Messages Log       │         │ • Onboarding Guide   │
│ • Analytics          │         │                      │
└──────────────────────┘         └──────────────────────┘
         │                                   │
         └───────────────┬───────────────────┘
                         │
                    ┌────▼──────┐
                    │ Next.js 16 │
                    │ API Routes │
                    └────┬──────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────┐     ┌────▼────┐     ┌────▼──────┐
    │ Auth   │     │ Bot Mgmt │     │ Webhooks  │
    │ Routes │     │ Routes   │     │ & Msgs    │
    └───┬────┘     └────┬────┘     └────┬──────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                   ┌────▼────────────┐
                   │   Supabase      │
                   │  PostgreSQL     │
                   │   Database      │
                   │                 │
                   │ • Users         │
                   │ • Bots          │
                   │ • Rules         │
                   │ • Messages      │
                   │ • Contacts      │
                   │ • Analytics     │
                   └────┬────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
        ┌───▼─┐    ┌───▼─┐    ┌───▼─┐
        │ Row │    │Auth │    │Edge │
        │Lvl  │    │(JWT)│    │Func │
        │Sec  │    │     │    │     │
        └─────┘    └─────┘    └─────┘
```

---

## Data Flow

### 1. User Registration & Authentication

```
User Input
    ↓
Sign-Up Form
    ↓
Supabase Auth
    ↓
Email Verification
    ↓
JWT Token Created
    ↓
Redirect to Dashboard
```

### 2. Bot Creation

```
Create Bot Form
    ↓
POST /api/bots
    ↓
Validate Input
    ↓
Insert to Database (bots table)
    ↓
Create Associated Rules Table
    ↓
Return Bot ID
    ↓
Redirect to Bot Detail Page
```

### 3. WhatsApp Connection

```
User Clicks "Connect WhatsApp"
    ↓
GET /api/bots/[id]/qr
    ↓
Request QR from Baileys Session
    ↓
Return QR Code (Base64 Image)
    ↓
Display in Modal
    ↓
User Scans with WhatsApp
    ↓
Baileys Receives Auth
    ↓
Update Bot Status → "active"
    ↓
Show Success Notification
```

### 4. Settings Update

```
User Updates Settings
    ↓
PUT /api/bots/[id]
    ↓
Validate New Settings
    ↓
Update Bots Table
    ↓
Return Updated Data
    ↓
Show Success Message
```

### 5. Message Reception

```
User Sends Message on WhatsApp
    ↓
Baileys Receives Message
    ↓
POST /api/webhooks/messages
    ↓
Process Message
    ↓
Check Rules (Trigger Matching)
    ↓
Generate Response
    ↓
Send via Baileys
    ↓
Log to Messages Table
    ↓
Update Analytics
```

---

## Database Schema

```
┌─────────────────────────────────────────┐
│ auth.users (Supabase)                   │
├─────────────────────────────────────────┤
│ id (UUID, Primary Key)                  │
│ email (String, Unique)                  │
│ encrypted_password (String)             │
│ email_confirmed_at (Timestamp)          │
│ raw_user_meta_data (JSONB)              │
│   ├─ full_name                          │
│   └─ profile_pic                        │
│ created_at (Timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ public.bots                             │
├─────────────────────────────────────────┤
│ id (UUID, Primary Key)                  │
│ user_id (UUID, FK → auth.users)         │
│ name (String)                           │
│ description (String)                    │
│ status (Enum)                           │
│   ├─ inactive (not connected)           │
│   ├─ connected (WhatsApp linked)        │
│   └─ active (running)                   │
│ phone_number (String, Optional)         │
│ config (JSONB)                          │
│   ├─ auto_reply (Boolean)               │
│   ├─ greeting_message (String)          │
│   └─ additional_settings                │
│ created_at (Timestamp)                  │
│ updated_at (Timestamp)                  │
│ RLS: Users can see only their bots      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ public.rules                            │
├─────────────────────────────────────────┤
│ id (UUID, Primary Key)                  │
│ bot_id (UUID, FK → bots)                │
│ user_id (UUID, FK → auth.users)         │
│ trigger (String)                        │
│   └─ Keyword to match in messages       │
│ response (String)                       │
│   └─ Auto-reply message                 │
│ enabled (Boolean)                       │
│ created_at (Timestamp)                  │
│ updated_at (Timestamp)                  │
│ RLS: Users can see only their rules     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ public.messages                         │
├─────────────────────────────────────────┤
│ id (UUID, Primary Key)                  │
│ bot_id (UUID, FK → bots)                │
│ contact_number (String)                 │
│ sender_type (Enum)                      │
│   ├─ incoming (from user)               │
│   └─ outgoing (from bot)                │
│ content (String)                        │
│ processed (Boolean)                     │
│ matched_rule (UUID, FK → rules)         │
│ created_at (Timestamp)                  │
│ RLS: Users can see their bot messages   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ public.contacts                         │
├─────────────────────────────────────────┤
│ id (UUID, Primary Key)                  │
│ bot_id (UUID, FK → bots)                │
│ phone_number (String)                   │
│ display_name (String, Optional)         │
│ message_count (Integer)                 │
│ last_message_at (Timestamp)             │
│ created_at (Timestamp)                  │
│ RLS: Users can see their bot contacts   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ public.analytics                        │
├─────────────────────────────────────────┤
│ id (UUID, Primary Key)                  │
│ bot_id (UUID, FK → bots)                │
│ date (Date)                             │
│ incoming_count (Integer)                │
│ outgoing_count (Integer)                │
│ unique_contacts (Integer)               │
│ response_rate (Float)                   │
│ created_at (Timestamp)                  │
│ RLS: Users can see their bot analytics  │
└─────────────────────────────────────────┘
```

---

## API Endpoints

### Authentication
```
POST   /auth/sign-up          Create account
POST   /auth/login            Login user
POST   /auth/logout           Logout user
GET    /auth/callback         Email confirmation
POST   /auth/refresh          Refresh JWT token
```

### Bot Management
```
GET    /api/bots              List user's bots
POST   /api/bots              Create new bot
GET    /api/bots/[id]         Get bot details
PUT    /api/bots/[id]         Update bot settings
DELETE /api/bots/[id]         Delete bot
POST   /api/bots/[id]/upload  Upload config file
```

### WhatsApp Connection
```
GET    /api/bots/[id]/qr      Get QR code for connection
POST   /api/bots/[id]/disconnect  Disconnect WhatsApp
GET    /api/bots/[id]/status  Get connection status
```

### Rules Management
```
GET    /api/rules             List bot's rules
POST   /api/rules             Create new rule
PUT    /api/rules/[id]        Update rule
DELETE /api/rules/[id]        Delete rule
```

### Messages & Webhooks
```
GET    /api/messages          List bot's messages
POST   /api/webhooks/messages Receive messages from Baileys
GET    /api/contacts          List bot's contacts
```

### Analytics
```
GET    /api/analytics         Get bot analytics
GET    /api/analytics/daily   Get daily metrics
GET    /api/analytics/stats   Get bot statistics
```

---

## Component Hierarchy

```
App
├── layout.tsx (Root Layout)
│   ├── Font Configuration
│   ├── Theme Provider
│   └── Auth Context
│
├── page.tsx (Home)
│   └── LandingPage Component
│
├── auth/
│   ├── login/page.tsx
│   ├── sign-up/page.tsx
│   ├── sign-up-success/page.tsx
│   └── error/page.tsx
│
└── dashboard/
    ├── layout.tsx
    │   └── Nav Component (Sidebar)
    │
    ├── page.tsx (Dashboard Home)
    │   ├── WelcomeCard
    │   └── BotsList
    │       └── BotCard (Multiple)
    │
    ├── bots/
    │   └── [id]/
    │       └── page.tsx
    │           └── BotDetailView
    │               ├── Tabs
    │               ├── BotOverview
    │               │   ├── Status Card
    │               │   ├── Stats Card
    │               │   └── QRCodeModal
    │               ├── BotMessages
    │               │   └── MessageList
    │               ├── BotRules
    │               │   ├── RulesList
    │               │   └── CreateRuleDialog
    │               ├── BotContacts
    │               │   └── ContactsList
    │               └── BotSettings
    │                   ├── SettingsForm
    │                   └── DangerZone
    │
    ├── analytics/page.tsx
    │   └── AnalyticsDashboard
    │
    ├── contacts/page.tsx
    │   └── ContactsPage
    │
    └── settings/page.tsx
        └── UserSettings
```

---

## Security Implementation

### Row Level Security (RLS)
- Every table has RLS enabled
- Users can only see their own data
- Policies check `auth.uid()` before returning data

### Example RLS Policy
```sql
CREATE POLICY "Users can see their own bots"
ON bots
FOR SELECT
USING (auth.uid() = user_id);
```

### Authentication Flow
1. Email/password signup/login
2. Supabase Auth generates JWT
3. JWT stored in HTTP-only cookie
4. Middleware validates JWT on each request
5. RLS policies enforce data access control

### API Security
- All routes check authentication
- Bot ID validated against user_id
- Input validation on all endpoints
- SQL injection prevention via Supabase
- CORS configured for frontend only

---

## Deployment Architecture

```
User → Vercel Edge Network
         ↓
    Next.js 16 App
    (Server Components + API Routes)
         ↓
    Supabase PostgreSQL
    (Serverless Database)
         ↓
    Row Level Security
    (Data Access Control)
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
```

---

## Performance Considerations

### Caching
- Static pages cached with revalidation
- API responses cached where appropriate
- Database query optimization with indexes

### Database Indexes
```sql
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_rules_bot_id ON rules(bot_id);
CREATE INDEX idx_messages_bot_id ON messages(bot_id);
CREATE INDEX idx_contacts_bot_id ON contacts(bot_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

### Optimization Strategies
- Server-side pagination for large datasets
- Lazy loading components
- Image optimization
- Code splitting
- Minification and compression

---

## Error Handling

### Frontend
- Try-catch blocks in async operations
- User-friendly error messages
- Loading states during operations
- Retry buttons on failures

### Backend
- Validation at API routes
- Detailed error logging
- Proper HTTP status codes
- Structured error responses

### Database
- Constraint validation
- Transaction rollback on errors
- Audit logging
- Connection pooling

---

## Monitoring & Logging

### What We Log
- User authentication events
- Bot creation/deletion
- Connection status changes
- Message processing
- API errors
- Database queries (in development)

### Monitoring Tools
- Supabase dashboard for database
- Vercel logs for API routes
- Client-side error tracking
- Custom analytics dashboards

---

**Last Updated:** 2025-02-15
**Architecture Version:** 2.0
**Status:** Production Ready ✅
