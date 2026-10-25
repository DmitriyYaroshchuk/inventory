import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import Providers from '@/components/Providers/Providers';
import NavigationMenu from '@/components/NavigationMenu/NavigationMenu';
import UserProfile from '@/components/UserProfile/UserProfile';
import TopMenu from '@/components/TopMenu/TopMenu';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Приходы и продукты',
};

const RootLayout = async ({ children }: LayoutProps<'/'>) => {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>
            <TopMenu />
            <div className="app__body">
              <aside className="app__sidebar">
                <UserProfile />
                <NavigationMenu />
              </aside>
              <main className="app__content">{children}</main>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
