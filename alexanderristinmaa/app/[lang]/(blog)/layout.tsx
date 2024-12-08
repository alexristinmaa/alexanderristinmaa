export const metadata = {
  title: 'Bloggen',
  description: 'Allt folk vill veta, och allt annat också',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
