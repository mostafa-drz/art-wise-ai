import type { Metadata } from 'next';
import './globals.css';
import { GlobalStateProvider } from './context/GlobalState';
import { AuthProvider } from './context/Auth';
import Header from './components/Header';
import Providers from './components/Providers';
import BetaBanner from '@/components/BetaBanner';

export const metadata: Metadata = {
  title: 'Art Wise AI',
  description: 'Your personal AI art companion',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>',
        type: 'image/svg+xml',
      },
    ],
    shortcut: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-purple-50">
        <AuthProvider>
          <GlobalStateProvider>
            <Providers>
              <main className="min-h-screen w-screen">
                <Header />
                <div className="container mx-auto px-4 py-10">
                  <BetaBanner />
                  {children}
                </div>
              </main>
            </Providers>
          </GlobalStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
