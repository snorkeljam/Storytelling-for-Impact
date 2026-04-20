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
