import { getLanguages } from "./dictionaries"

export async function generateStaticParams() {
    return getLanguages()
}

export default async function Root({ children, params } : { children: React.ReactNode, params: { lang: string } }) {
    const lang = (await params).lang;
    
    return (
      <html lang={lang}>
        {children}
      </html>
    )
  }