// Email sending utility - supports Resend
// For local development, logs emails to console

export async function sendMagicLinkEmail(
  email: string,
  magicLink: string
): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || 'resend'

  if (provider === 'resend') {
    await sendWithResend(email, magicLink)
  } else {
    // For development, just log it
    console.log(`\n📧 Magic Link Email (DEV MODE)`)
    console.log(`To: ${email}`)
    console.log(`Link: ${magicLink}\n`)
  }
}

async function sendWithResend(email: string, magicLink: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(`\n📧 Magic Link Email (DEV MODE - Resend not configured)`)
    console.log(`To: ${email}`)
    console.log(`Link: ${magicLink}\n`)
    return
  }

  const appName = 'Storytelling for Impact'
  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #1f2a44;
        color: #ffffff;
        padding: 30px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background-color: #f9f9f9;
        padding: 30px 20px;
        border-radius: 0 0 8px 8px;
      }
      .magic-link-btn {
        display: inline-block;
        background-color: #e66c5c;
        color: #ffffff;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        margin: 20px 0;
      }
      .expiry-note {
        font-size: 12px;
        color: #666666;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Storytelling for Impact</h1>
        <p>Interactive Workbook</p>
      </div>
      <div class="content">
        <h2>Welcome!</h2>
        <p>Click the button below to access your interactive workbook and save your progress:</p>
        <a href="${magicLink}" class="magic-link-btn">Access Your Workbook</a>
        <p style="margin-top: 20px;">Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; background: #ffffff; padding: 10px; border-left: 3px solid #e66c5c; font-size: 12px;">
          ${magicLink}
        </p>
        <div class="expiry-note">
          <p>⏱️ This link expires in 15 minutes for security purposes.</p>
          <p>If you didn't request this link, you can safely ignore this email.</p>
        </div>
      </div>
    </div>
  </body>
</html>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Storytelling for Impact <onboarding@resend.dev>',
        to: email,
        subject: 'Your Storytelling for Impact Access Link',
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend API error:', error)
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send magic link email')
  }
}

// ---------------------------------------------------------------------------
// Demo signup notification
//
// Fires whenever someone completes the /demo landing-page form so that the
// STFI team receives a lightweight lead notification in their inbox.
// Recipients: james@story.as, simon@story.as
// ---------------------------------------------------------------------------

export interface DemoLead {
  name: string
  organization: string
  email: string
  submittedAt: string // ISO timestamp
}

const DEMO_NOTIFICATION_RECIPIENTS = ['james@story.as', 'simon@story.as']

export async function sendDemoSignupNotification(lead: DemoLead): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || 'resend'
  const apiKey = process.env.RESEND_API_KEY

  // Dev fallback — just log if Resend isn't configured
  if (provider !== 'resend' || !apiKey) {
    console.log(`\n📧 Demo Signup (DEV MODE)`)
    console.log(`To: ${DEMO_NOTIFICATION_RECIPIENTS.join(', ')}`)
    console.log(`Lead: ${JSON.stringify(lead, null, 2)}\n`)
    return
  }

  const subject = `New STFI demo signup: ${lead.name} (${lead.organization})`

  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333333;
      }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header {
        background-color: #1f2a44;
        color: #ffffff;
        padding: 24px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background-color: #f9f9f9;
        padding: 24px 20px;
        border-radius: 0 0 8px 8px;
      }
      table.lead { width: 100%; border-collapse: collapse; margin-top: 12px; }
      table.lead td {
        padding: 10px 12px;
        border-bottom: 1px solid #e0e0e0;
        vertical-align: top;
      }
      table.lead td.label {
        font-weight: 600;
        color: #666666;
        width: 35%;
      }
      .footnote {
        font-size: 12px;
        color: #999999;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin:0;">New STFI Demo Signup</h2>
      </div>
      <div class="content">
        <p>Someone just opened the Storytelling for Impact demo workbook:</p>
        <table class="lead">
          <tr><td class="label">Name</td><td>${escapeHtml(lead.name)}</td></tr>
          <tr><td class="label">Organization</td><td>${escapeHtml(lead.organization)}</td></tr>
          <tr><td class="label">Email</td><td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td></tr>
          <tr><td class="label">Submitted</td><td>${escapeHtml(lead.submittedAt)}</td></tr>
        </table>
        <div class="footnote">
          Demo course — progress is not saved server-side. This notification is
          sent automatically from the STFI demo landing page.
        </div>
      </div>
    </div>
  </body>
</html>
`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'STFI Demo <onboarding@resend.dev>',
        to: DEMO_NOTIFICATION_RECIPIENTS,
        subject,
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend API error (demo signup):', error)
      // Non-fatal — we don't want to block the user from entering the demo
      // just because our internal notification failed.
    }
  } catch (error) {
    console.error('Error sending demo signup notification:', error)
    // Non-fatal for the same reason as above.
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
