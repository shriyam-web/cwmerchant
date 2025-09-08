import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Citywitty Merchant Hub - Grow Your Business with Premium Customers',
    template: '%s | Citywitty Merchant Hub'
  },
  description: 'Join Citywitty Merchant Hub and connect with premium customers. Boost your sales, manage your business, and grow with India\'s leading discount card platform.',
  keywords: 'citywitty merchant, business growth, loyalty cards, premium customers, merchant dashboard, business partners',
  authors: [{ name: 'Citywitty Team' }],
  creator: 'Citywitty',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://partner.citywitty.com',
    siteName: 'Citywitty Merchant Hub',
    title: 'Citywitty Merchant Hub - Grow Your Business',
    description: 'Join thousands of successful merchants and grow your business with premium Citywitty card users.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Citywitty Merchant Hub',
    description: 'Grow your business with premium customers through Citywitty\'s merchant platform.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}