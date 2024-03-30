export const metadata = {
  title: 'Arvid poopy',
  description: 'bajsmannen',
}

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
