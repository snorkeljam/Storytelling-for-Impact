# Deployment Guide - Storytelling for Impact Workbook

Step-by-step instructions for deploying your Next.js magic link app to Vercel.

## Prerequisites

- GitHub account (with this project in a repo)
- Vercel account (free at [vercel.com](https://vercel.com))
- Resend account (free tier, or use SMTP instead)

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial Next.js app with magic link auth"
git push origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repo
4. Framework: **Next.js** (auto-selected)
5. Click "Deploy"

Vercel will build and deploy your app automatically.

## Step 3: Set Up Vercel KV

1. In your Vercel dashboard, go to **Storage** tab
2. Click **Create Database** → **KV**
3. Choose a region closest to your users
4. Name it (e.g., `stfi-kv`)
5. Click **Create**
6. Copy the environment variables shown:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

## Step 4: Configure Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add the KV variables from Step 3:

   | Key | Value |
   |-----|-------|
   | `KV_URL` | _(from Vercel KV)_ |
   | `KV_REST_API_URL` | _(from Vercel KV)_ |
   | `KV_REST_API_TOKEN` | _(from Vercel KV)_ |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
   | `EMAIL_PROVIDER` | `resend` |
   | `RESEND_API_KEY` | _(from Resend)_ |

3. Click **Save**
4. Redeploy the project (Settings → Deployments → Redeploy)

## Step 5: Set Up Email (Resend)

1. Create a free account at [resend.com](https://resend.com)
2. Create an API key:
   - Go to **API Keys** → **Create API Key**
   - Copy the key
3. Add `RESEND_API_KEY` to Vercel environment variables (Step 4)
4. Update the email in `lib/email.ts` if needed

### Alternative: Use SMTP Instead

If you prefer SMTP (Gmail, SendGrid, etc.):

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@example.com
```

Then update `lib/email.ts` to implement SMTP sending.

## Step 6: Custom Domain (Optional)

1. Go to Vercel **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as shown
4. Update `NEXT_PUBLIC_APP_URL` in environment variables

## Testing Your Deployment

1. Visit your Vercel app URL
2. Click "Get Started"
3. Enter a test email
4. Check your email for the magic link
5. Click the link and verify you can access the workbook
6. Enter test data and refresh to verify localStorage persistence

## Troubleshooting

### "Magic link not working"
- ✅ Check email spam folder
- ✅ Verify `NEXT_PUBLIC_APP_URL` matches your domain
- ✅ Check that KV environment variables are set
- ✅ Review logs in Vercel dashboard

### "Email not being sent"
- ✅ For Resend: verify `RESEND_API_KEY` is correct
- ✅ For SMTP: test credentials with `telnet`
- ✅ Check Resend dashboard for failed sends
- ✅ Verify `EMAIL_PROVIDER` matches your setup

### "KV database not found"
- ✅ Ensure KV database is created in Vercel Storage
- ✅ Check environment variables are in correct order
- ✅ Try redeploying after adding variables

## Monitoring

- **Vercel Dashboard**: View deployments, logs, analytics
- **Resend Dashboard**: Monitor email delivery and bounces
- **Browser Console**: Check for client-side errors

## Scaling

When your workbook becomes popular:

1. **Increase KV Capacity**: Upgrade in Vercel Storage settings
2. **Monitor Usage**: Check Vercel Analytics for traffic patterns
3. **Email Rate Limits**: Resend free tier has generous limits; upgrade if needed
4. **Database Backup**: Consider backing up user data periodically

## Security Best Practices

- ✅ Keep API keys secret (never commit `.env.local`)
- ✅ Use HTTPS only (Vercel provides automatic SSL)
- ✅ Rotate KV token periodically
- ✅ Monitor for unauthorized access in logs
- ✅ Keep dependencies updated

## Next Steps

1. **Customize branding**: Update colors in `app/globals.css`
2. **Add your logo**: Place in `public/` and reference in components
3. **Update content**: Modify Lesson text and links in `components/Workbook.tsx`
4. **Set up analytics**: Connect Google Analytics or Vercel Analytics
5. **Create support documentation**: Write help docs for your users

---

**Questions?** Check the [Vercel Docs](https://vercel.com/docs) or [Resend Docs](https://resend.com/docs)

**Ready to deploy?** Run: `git push origin main`
