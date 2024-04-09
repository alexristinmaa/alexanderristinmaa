export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

// styles
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
