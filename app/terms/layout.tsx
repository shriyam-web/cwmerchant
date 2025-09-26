// app/terms/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | CityWitty Privilege Card',
  description:
    'Read the official Terms & Conditions for CityWitty Merchant Registration. Understand eligibility, responsibilities, payments, liabilities, and legal compliance before joining CityWitty Privilege Card.',
  keywords: [
    'CityWitty Terms and Conditions',
    'Merchant Registration Terms',
    'CityWitty Privilege Card',
    'Merchant Responsibilities',
    'Business Agreement',
    'CityWitty Legal',
  ],
  openGraph: {
    title: 'Terms & Conditions | CityWitty Privilege Card',
    description:
      'Official Terms & Conditions for CityWitty merchant partners. Covering eligibility, responsibilities, payments, liabilities, and governing law.',
    url: 'https://citywitty.com/terms',
    siteName: 'CityWitty',
    images: [
      {
        url: 'https://citywitty.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CityWitty Terms & Conditions',
      },
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | CityWitty Privilege Card',
    description:
      'Review CityWitty’s Terms & Conditions for merchant registration and business compliance.',
    images: ['https://citywitty.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://citywitty.com/terms',
  },
};

// ✅ REQUIRED default export
export default function TermsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
