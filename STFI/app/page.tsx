import Link from 'next/link'

export default function Home() {
  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Storytelling for Impact</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Interactive Workbook</p>
        </div>

        <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
          Welcome to Storytelling for Impact. This interactive workbook will help you harness the power of storytelling
          to amplify voices and values that strengthen inclusion and drive meaningful change across your campus
          community and beyond.
        </p>

        <p style={{ marginBottom: '2rem', fontSize: '1rem' }}>
          Whether you're sharing your own experiences, advocating for a program, or seeking to influence policy or
          culture, the right story told well can connect, inspire, and move people to act.
        </p>

        <div style={{ backgroundColor: '#f0f0f0', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem', fontWeight: '600' }}>✨ What You'll Do:</p>
          <ul style={{ marginLeft: '1.5rem', color: '#666' }}>
            <li style={{ marginBottom: '0.5rem' }}>Explore why storytelling is such a powerful tool for change</li>
            <li style={{ marginBottom: '0.5rem' }}>Learn the science behind effective stories</li>
            <li style={{ marginBottom: '0.5rem' }}>Develop your own story with hands-on activities</li>
            <li>Perfect your delivery and adapt your message for different audiences</li>
          </ul>
        </div>

        <Link href="/auth/request" className="btn" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>
          Get Started
        </Link>

        <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          🔒 No password needed. We'll send you a secure magic link via email.
        </p>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem' }}>
            Made by <strong>Jackrabbit LX</strong>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
            Course materials developed by Story As and Jackrabbit LX
          </p>
        </div>
      </div>
    </div>
  )
}
