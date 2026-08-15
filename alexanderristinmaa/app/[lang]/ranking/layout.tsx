import { Inter } from "next/font/google";

import '/app/globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Ranking',
  description: 'SKK ranking',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <body className={inter.className}>{children}</body>
  )
}
