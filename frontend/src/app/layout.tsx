import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ApolloClientProvider } from '@/lib/apollo-provider';
import './globals.css';

// Editorial serif for display/titles, clean sans for body text.
const serif = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Job Application Tracker',
  description:
    'Track, search, and manage your job applications in table and kanban views.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <ApolloClientProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: { fontSize: '14px' },
              success: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
            }}
          />
        </ApolloClientProvider>
      </body>
    </html>
  );
}
