import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.scss";
import Navigation from "@/components/NavigationMenu";
import UserProfile from "@/components/UserProfile";

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Приходы и продукты'
}

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div className="app__body">
            <aside className="app__sidebar">
              <UserProfile />
              <Navigation />
            </aside>
            <main className="app__content">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout;