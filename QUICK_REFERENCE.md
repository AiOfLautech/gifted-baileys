# WhatsApp Bot Platform - Quick Reference

## 🚀 Quick Start

```bash
# Install
npm install

# Configure
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run
npm run dev
```

Visit http://localhost:3000

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page |
| `app/auth/` | Authentication pages |
| `app/dashboard/` | Main dashboard |
| `components/dashboard/` | Dashboard components |
| `lib/supabase/` | Database clients |
| `scripts/001_create_tables.sql` | Database schema |
| `middleware.ts` | Route protection |

---

## 🔌 API Endpoints Quick Reference

### Bot CRUD
```javascript
// Create
POST /api/bots
{ name, description }

// Read
GET /api/bots
GET /api/bots/[id]

// Update
PUT /api/bots/[id]
{ name, description, status }

// Delete
DELETE /api/bots/[id]
```

### Rules CRUD
```javascript
// Create
POST /api/rules
{ bot_id, trigger, response, enabled }

// Update
PUT /api/rules/[id]
{ trigger, response, enabled }

// Delete
DELETE /api/rules/[id]
```

### Bot File Upload
```javascript
POST /api/bots/[id]/upload
FormData: { file: File }
```

### WhatsApp Connection
```javascript
GET /api/bots/[id]/qr
// Returns: { qr_code, session_id }
```

### Message Webhook
```javascript
POST /api/webhooks/messages
{
  bot_id,
  from_number,
  message_content,
  message_type: 'incoming' | 'outgoing'
}
```

---

## 🗄️ Database Tables

### bots
- id, user_id, name, description, status, config, phone_number, created_at, updated_at

### rules
- id, bot_id, trigger, response, enabled, created_at

### messages
- id, bot_id, contact_number, sender_type, content, created_at

### contacts
- id, bot_id, contact_number, name, last_message_at, created_at

### analytics
- id, bot_id, metric_type, metric_value, timestamp

### file_uploads
- id, bot_id, file_name, file_path, config_data, created_at

---

## 🔐 Authentication

```typescript
// Sign up
import { signUp } from '@/lib/auth'
const { data, error } = await signUp(email, password, fullName)

// Sign in
import { signIn } from '@/lib/auth'
const { data, error } = await signIn(email, password)

// Get current user
import { getCurrentUser } from '@/lib/auth'
const { user, error } = await getCurrentUser()

// Sign out
import { signOut } from '@/lib/auth'
const { error } = await signOut()
```

---

## 📊 Supabase Client Usage

### Server-side
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
const { data, error } = await supabase.from('bots').select('*')
```

### Client-side
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.from('rules').select('*')
```

---

## 🧩 Component Usage

### Create Bot Dialog
```typescript
import CreateBotDialog from '@/components/dashboard/create-bot-dialog'

<CreateBotDialog userId={user.id} />
```

### Bots List
```typescript
import BotsList from '@/components/dashboard/bots-list'

<BotsList bots={bots} />
```

### File Upload
```typescript
import { FileUpload } from '@/components/dashboard/file-upload'

<FileUpload 
  botId={botId}
  autoUpload={true}
  onUploadSuccess={() => router.refresh()}
/>
```

### QR Code Modal
```typescript
import QRCodeModal from '@/components/dashboard/qr-code-modal'

<QRCodeModal 
  open={open}
  onOpenChange={setOpen}
  botId={botId}
/>
```

---

## 📝 Form Validation

```typescript
// Validate bot config
function validateBotConfig(config: any): boolean {
  return (
    config.name &&
    config.rules &&
    Array.isArray(config.rules) &&
    config.rules.every(r => r.trigger && r.response)
  )
}

// Validate email
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

---

## 🔍 Common Patterns

### Protected Route
```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')
  
  return <div>Protected content</div>
}
```

### API Route with Auth
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Process request
}
```

### Data Fetching in Server Component
```typescript
export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', user.id)
  
  if (error) return <div>Error loading data</div>
  return <BotsList bots={data} />
}
```

### Client-side Mutation
```typescript
'use client'

const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const handleCreate = async (formData: any) => {
  setLoading(true)
  setError(null)
  
  try {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) throw new Error('Failed')
    
    const data = await response.json()
    // Handle success
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

---

## 🛠️ Debugging Tips

### Check User Auth
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('[v0] Current user:', user?.id)
```

### Log API Requests
```typescript
console.log('[v0] API call:', { method, url, body })
const response = await fetch(url, options)
console.log('[v0] API response:', { status, body: await response.json() })
```

### Verify RLS
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- Check user has access
SELECT * FROM bots WHERE user_id = auth.uid();
```

---

## 📦 Dependencies

### Core
- next: ^16.0.0
- react: ^19.0.0
- typescript: ^5.0.0

### UI
- @radix-ui/[*]: UI primitives
- lucide-react: Icons
- tailwindcss: Styling
- class-variance-authority: Class management

### Backend
- @supabase/ssr: Auth & session
- @supabase/supabase-js: Database client

---

## 🚢 Deployment

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://your-domain.com/auth/callback
```

### Vercel Deploy
```bash
vercel deploy --prod
```

### Docker Build
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing Commands

```bash
# Run type check
npm run type-check

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Run dev with debug
DEBUG=* npm run dev
```

---

## 📚 File Configuration Example

```json
{
  "name": "Sales Bot",
  "description": "Automated sales inquiry handler",
  "rules": [
    {
      "trigger": "price",
      "response": "Our plans start at $9/month",
      "enabled": true
    },
    {
      "trigger": "demo",
      "response": "Schedule a demo: https://calendly.com/...",
      "enabled": true
    }
  ],
  "settings": {
    "auto_reply": true,
    "case_sensitive": false,
    "max_message_length": 1024,
    "response_delay_ms": 1000
  }
}
```

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Landing | / |
| Sign Up | /auth/sign-up |
| Login | /auth/login |
| Dashboard | /dashboard |
| Bot Detail | /dashboard/bots/[id] |
| Analytics | /dashboard/analytics |
| Contacts | /dashboard/contacts |
| Settings | /dashboard/settings |

---

## 💡 Tips & Tricks

1. **Use Server Components by Default** - Fetch data server-side
2. **Keep Components Small** - Easier to test and reuse
3. **Validate on Client AND Server** - Security + UX
4. **Use TypeScript** - Catch errors early
5. **Test API Endpoints** - Use curl or Postman
6. **Monitor Logs** - Check browser console and server logs
7. **Cache When Possible** - Reduce database queries
8. **Use Middleware** - Centralize auth logic

---

## ⚠️ Common Mistakes

❌ Don't:
- Expose private keys in client code
- Skip input validation
- Forget about RLS
- Use client components for data fetching
- Mix async/await with promises
- Forget to handle errors
- Hardcode environment variables

✅ Do:
- Use server components for data
- Validate everything
- Enable RLS on tables
- Use TypeScript
- Handle all error cases
- Use environment variables
- Follow Next.js best practices

---

## 📞 Quick Support Checklist

- [ ] Check environment variables are set
- [ ] Verify Supabase connection
- [ ] Check auth status in browser dev tools
- [ ] Review server logs for errors
- [ ] Verify RLS policies are correct
- [ ] Check API response status codes
- [ ] Validate input data
- [ ] Clear browser cache

---

**Last Updated**: February 2026
**Quick Reference Version**: 1.0
