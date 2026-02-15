# WhatsApp Bot Platform - Deployment Guide

## Quick Start (5 minutes)

### Prerequisites
- GitHub account (optional but recommended)
- Supabase account (free tier available)
- Vercel account (free tier available)
- Node.js 18+ (local development only)

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Connect GitHub Repository

1. Push your code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-bot-platform.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Select the project and click "Import"

### Step 2: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.vercel.app/auth/callback
```

**Where to find these:**
- Go to [supabase.com](https://supabase.com)
- Open your project
- Click "Settings" → "API"
- Copy the keys

### Step 3: Deploy

1. Click "Deploy" button in Vercel
2. Wait for build to complete
3. Visit your live URL
4. Test the landing page

---

## Option 2: Deploy to Your Own Server

### Requirements
- Linux server (Ubuntu 20.04+)
- Node.js 18+
- PostgreSQL 13+
- Nginx or Apache

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/whatsapp-bot-platform.git
cd whatsapp-bot-platform

# 2. Install dependencies
npm install

# 3. Build production bundle
npm run build

# 4. Create .env.local file
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 5. Start production server
npm start
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

---

## Option 3: Deploy to Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    depends_on:
      - db

  db:
    image: postgres:13-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=whatsapp_bot
      - POSTGRES_PASSWORD=your_password

volumes:
  postgres_data:
```

### Deploy Docker

```bash
docker-compose up -d
```

---

## Database Setup

### Supabase Setup (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name and password
4. Wait for database initialization
5. Go to "SQL Editor"
6. Run the migration script:

```sql
-- Copy contents of scripts/001_create_tables.sql
-- Paste and run in Supabase SQL Editor
```

### Local PostgreSQL

```bash
# Create database
createdb whatsapp_bot

# Run migrations
psql -U postgres -d whatsapp_bot < scripts/001_create_tables.sql

# Verify tables
psql -U postgres -d whatsapp_bot -c "\dt"
```

---

## Environment Variables Setup

### Create .env.local

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redirect URL (change for production)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Optional: Analytics & Monitoring
# NEXT_PUBLIC_GA_ID=UA-XXXXXXXX-X
# SENTRY_DSN=https://...
```

### Get Supabase Keys

1. Open Supabase project
2. Go to Settings → API
3. Copy from "Project API keys"
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`

---

## Verification Checklist

After deployment, verify:

- [ ] Landing page loads at `/`
- [ ] Sign up page works at `/auth/sign-up`
- [ ] Can create account
- [ ] Email verification link works
- [ ] Can log in at `/auth/login`
- [ ] Dashboard loads at `/dashboard`
- [ ] Can create a bot
- [ ] Can navigate to bot detail page
- [ ] Can see QR code modal
- [ ] Can view all tabs (Overview, Settings, Rules, Messages, Contacts)
- [ ] Can update settings
- [ ] Settings save successfully
- [ ] Can create rules
- [ ] Can delete rules

---

## Monitoring & Logs

### Vercel Logs
```bash
vercel logs --follow
```

### Application Logs

```bash
# Local development
npm run dev

# Production (with PM2)
pm2 logs whatsapp-bot-platform
```

### Database Logs (Supabase)

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Filter by database activity
4. View query execution times

---

## Performance Optimization

### Vercel Analytics

1. Enable in Vercel Dashboard
2. Go to Analytics
3. Monitor:
   - Page load times
   - Core Web Vitals
   - Error rates

### Image Optimization

Already configured with Next.js Image component. Ensure:

```jsx
// Use Next.js Image component
import Image from 'next/image'

<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={100} 
  height={100} 
/>
```

### Database Optimization

Indexes already created:
```sql
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_rules_bot_id ON rules(bot_id);
CREATE INDEX idx_messages_bot_id ON messages(bot_id);
```

---

## Backup & Recovery

### Supabase Automated Backups

1. Go to Supabase Dashboard
2. Settings → Backups
3. Enable automated backups
4. View backup history

### Manual Backup

```bash
# Backup database
pg_dump -h your-host -U postgres whatsapp_bot > backup.sql

# Restore database
psql -h your-host -U postgres whatsapp_bot < backup.sql
```

---

## Security Hardening

### 1. Enable HTTPS

Already automatic on Vercel. For self-hosted:
```bash
# Using Let's Encrypt
sudo certbot certonly --nginx -d your-domain.com
```

### 2. Set Security Headers

In `next.config.mjs`:
```javascript
headers: [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]
```

### 3. Enable RLS on Database

Already configured. Verify:
```sql
SELECT * FROM pg_tables 
WHERE rls_enabled = true;
```

### 4. Rotate Secrets Regularly

Change Supabase API keys periodically:
1. Go to Supabase Settings
2. API → Regenerate keys
3. Update in environment variables

---

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Check Supabase project is running
2. Verify environment variables are correct
3. Check network connectivity

### Page Not Found (404)

**Solution:**
1. Verify you're on correct URL
2. Check that all migrations ran
3. Restart development server: `npm run dev`

### Authentication Issues

**Solution:**
1. Clear browser cookies
2. Check email verification link
3. Verify Supabase Auth settings

### QR Code Not Displaying

**Solution:**
1. Baileys service must be running
2. Check QR endpoint responds: `GET /api/bots/[id]/qr`
3. Check browser console for errors

---

## Scaling Considerations

### For High Traffic

1. **Database Optimization**
   - Add read replicas
   - Enable connection pooling
   - Archive old messages

2. **Caching**
   - Use Redis for session storage
   - Cache frequently accessed data
   - CDN for static assets

3. **Load Balancing**
   - Deploy multiple instances
   - Use load balancer
   - Auto-scaling based on metrics

### Database Limits

- Supabase Free: 500MB storage
- Upgrade to Pro for unlimited
- Optimize queries if needed

---

## Monitoring Checklist

Daily:
- [ ] Check error logs
- [ ] Verify database performance
- [ ] Monitor active users
- [ ] Check API response times

Weekly:
- [ ] Review analytics dashboard
- [ ] Check backup status
- [ ] Verify security logs
- [ ] Update dependencies

Monthly:
- [ ] Performance review
- [ ] Capacity planning
- [ ] Security audit
- [ ] Backup verification

---

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- PostgreSQL Docs: https://www.postgresql.org/docs

---

## Quick Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| Can't connect to DB | Check Supabase URL and keys |
| Auth not working | Verify email in Supabase Auth settings |
| QR code blank | Ensure Baileys service is running |
| Slow page loads | Check database indexes and queries |
| CORS errors | Verify Vercel domain in Supabase settings |
| 500 errors | Check application logs for details |

---

## Post-Deployment

1. **Monitor Performance**
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor error rates

2. **Gather User Feedback**
   - Add feedback form
   - Monitor support tickets
   - Track feature requests

3. **Plan Updates**
   - Schedule improvements
   - Plan new features
   - Security updates

4. **Optimize**
   - Analyze usage patterns
   - Optimize slow queries
   - Improve UX

---

**Deployment Date:** [Your Date]  
**Production URL:** [Your Domain]  
**Status:** ✅ Live

For questions, see documentation folder or contact support.
