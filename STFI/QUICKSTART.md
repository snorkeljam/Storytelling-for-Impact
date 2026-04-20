# Quick Start Guide

Get the Storytelling for Impact workbook running locally in 5 minutes.

## 1. Install

```bash
npm install
```

## 2. Configure (Dev Mode)

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and set:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

That's it! In dev mode, magic links are printed to the terminal console.

## 3. Run

```bash
npm run dev
```

Open **http://localhost:3000** in your browser

## 4. Test the Flow

1. Click **"Get Started"**
2. Enter any email (e.g., `test@example.com`)
3. Check your **terminal console** - you'll see the magic link
4. Copy the link from console and paste in browser (or use developer tools to click it)
5. You'll be logged in and can access the workbook
6. Type in the workbook to see auto-saving to localStorage work

## 5. Local Development Tips

### View Magic Link in Console
```
📧 Magic Link Email (DEV MODE)
To: test@example.com
Link: http://localhost:3000/auth/verify?token=xxx...
```

### Clear Local Data
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

### Test Persistence
1. Enter some text in a workbook activity
2. Refresh the page (Cmd/Ctrl + R)
3. Your text should still be there!

### Logout Locally
1. Click the "Logout" button at the bottom of the workbook
2. You'll be redirected to `/auth/request`

## 6. Next: Deploy to Vercel

When ready for production:

1. Push to GitHub
2. Connect Vercel (see [DEPLOYMENT.md](./DEPLOYMENT.md))
3. Set up Vercel KV and Resend
4. Deploy!

## 7. Customize

### Change Branding
Edit `app/globals.css` to change colors, fonts, spacing

### Update Course Content
Edit `components/Workbook.tsx` to update lessons, links, activities

### Change Email Sender
Edit `lib/email.ts` to customize the email template

## Common Issues

**Q: Magic link not appearing?**
A: Check your browser's developer console (F12 → Console tab)

**Q: localStorage not persisting?**
A: Make sure JavaScript is enabled and you're in the same browser

**Q: Need to test email sending?**
A: Sign up for free Resend account and add `RESEND_API_KEY` to `.env.local`

**Q: Can't logout?**
A: Scroll to the bottom of the workbook page

---

**Ready to build?** Start customizing and then deploy to Vercel!

```bash
# When ready:
npm run build    # Check for errors
npm run dev      # Test locally
git push         # Deploy to Vercel
```
