import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Приходы и продукты'
}

function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div className="app__body">
            <aside className="app__sidebar" />
            <main className="app__content">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout;