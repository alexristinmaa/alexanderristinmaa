// style
import styles from './layout.module.css';

export const metadata = {
  title: 'Hemligheter',
  description: 'Ser man detta i källkoden eller?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body id={styles.body}>{children}</body>
    </html>
  )
}
