export const metadata = {
  title: 'Experiments',
  description: 'All mysterious builds',
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
