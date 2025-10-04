import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 – Page Not Found | Cintya Huaire</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{
        fontFamily: 'system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#000',
      }}>
        <div>
          <h1 style={{ display: 'inline-block', margin: '0 20px 0 0', padding: '0 23px 0 0', fontSize: 32, fontWeight: 700, borderRight: '1px solid #ccc', verticalAlign: 'top', lineHeight: '49px' }}>404</h1>
          <div style={{ display: 'inline-block' }}>
            <h2 style={{ fontSize: 18, fontWeight: 400, lineHeight: '49px', margin: 0 }}>Sorry, this page could not be found.</h2>
            <p style={{ marginTop: 24 }}>
              <Link href="/">Return to homepage</Link>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
