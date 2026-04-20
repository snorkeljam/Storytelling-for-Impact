# Storytelling for Impact - Interactive Workbook

A Next.js application with passwordless magic link authentication, built for Jackrabbit LX.

## Features

- 🔐 **Magic Link Authentication** - No passwords, just secure email links
- 💾 **Auto-saving Workbook** - Progress saved to browser localStorage
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Vercel-native** - Uses Vercel KV for token storage
- 🎨 **JLX Branded** - Follows Jackrabbit LX design standards

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Auth**: Magic links with Vercel KV
- **Email**: Resend (configurable)
- **Styling**: CSS (no build tools needed)
- **Deployment**: Vercel (optimized)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

**For local development** (no email service needed):
- Just set `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Magic links will be logged to the console

**For production** (on Vercel):

1. **Connect Vercel KV**:
   - Create a Vercel KV database in your Vercel dashboard
   - Copy the `KV_*` environment variables to `.env.local`

2. **Set up email** (choose one):

   **Option A: Resend** (recommended, free tier available)
   ```
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
   Sign up at [resend.com](https://resend.com)

   **Option B: Custom SMTP**
   ```
   EMAIL_PROVIDER=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@yourcompany.com
   ```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── auth/
│   ├── request/page.tsx       # Email request form
│   └── verify/page.tsx        # Magic link verification
├── workbook/page.tsx          # Protected workbook
└── api/auth/
    ├── request-link/route.ts  # Generate & send magic link
    ├── verify-link/route.ts   # Verify token & create session
    └── verify-session/route.ts # Check if session is valid

lib/
├── auth.ts                     # Auth utilities
├── kv.ts                       # Vercel KV operations
└── email.ts                    # Email sending

components/
└── Workbook.tsx               # Interactive workbook component
```

## How It Works

1. **User Requests Link**: Enters email on `/auth/request`
2. **Link Generated**: Token stored in Vercel KV (15 min expiry)
3. **Email Sent**: Magic link sent via Resend or SMTP
4. **User Clicks Link**: Redirected to `/auth/verify?token=xxx`
5. **Token Verified**: Session created, token stored in Vercel KV (30 day expiry)
6. **Access Granted**: Redirected to `/workbook` with localStorage persistence

## Data Persistence

- **User Progress**: Stored in browser localStorage (survives page refresh)
- **Authentication**: Sessions stored in Vercel KV (server-side)
- **Magic Links**: One-time use, 15 minute expiry
- **Sessions**: 30 day expiry

## Deployment to Vercel

```bash
# Push to GitHub, then:
git push origin main
```

Vercel will auto-detect the Next.js project and deploy.

**Required steps**:
1. Create Vercel KV database
2. Add environment variables to Vercel project settings
3. Configure email provider (Resend or SMTP)

## Email Customization

Edit the email template in `lib/email.ts` to match your branding.

Current template includes:
- Course name and title
- Magic link button (Resend styled)
- Link expiry warning
- Security note

## Troubleshooting

### Magic links not working?
- Check that `NEXT_PUBLIC_APP_URL` matches your domain
- Verify Vercel KV credentials in `.env.local`
- Check browser console for errors

### Email not being sent?
- **Local dev**: Check terminal console for logged link
- **Production**: Verify `RESEND_API_KEY` or SMTP credentials
- Check spam folder

### Session keeps expiring?
- Sessions are valid for 30 days
- Clearing browser localStorage will require re-login
- Magic links expire after 15 minutes

## Security Notes

- Tokens are 64-character hexadecimal strings
- Magic links are single-use (deleted after verification)
- Sessions are server-side (Vercel KV)
- No passwords stored
- HTTPS required in production

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- localStorage API needed for progress saving

## License

Made by Jackrabbit LX

---

**Need help?** Check the [Vercel docs](https://vercel.com/docs) or open an issue in your repo.
