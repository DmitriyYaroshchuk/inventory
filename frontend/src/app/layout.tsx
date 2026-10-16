import type { Metadata } from "next";
import Providers from "@/components/Providers/Providers";
import "./globals.scss";
import Navigation from "@/components/NavigationMenu/NavigationMenu";
import UserProfile from "@/components/UserProfile/UserProfile";
import TopMenu from "@/components/TopMenu/TopMenu";

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Приходы и продукты'
}

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <TopMenu />
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