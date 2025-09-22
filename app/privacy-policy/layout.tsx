import { Metadata } from 'next';
// import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Privacy Policy | CityWitty Privilege Card',
    description:
        'Read CityWitty’s Privacy Policy for merchants and users. Learn how we collect, use, store, and protect your personal and business information in compliance with data protection laws.',
    keywords: [
        'CityWitty Privacy Policy',
        'Merchant Data Protection',
        'CityWitty Privilege Card',
        'Business Privacy Policy',
        'Data Security',
        'Information Collection',
    ],
    openGraph: {
        title: 'Privacy Policy | CityWitty Privilege Card',
        description:
            'Detailed Privacy Policy outlining how CityWitty collects, uses, and safeguards merchant and user data in compliance with legal standards.',
        url: 'https://citywitty.com/privacy',
        siteName: 'CityWitty',
        images: [
            {
                url: 'https://citywitty.com/citywittynew.jpg',
                width: 1200,
                height: 630,
                alt: 'CityWitty Privacy Policy',
            },
        ],
        locale: 'en_IN',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy | CityWitty Privilege Card',
        description:
            'Understand how CityWitty protects merchant and user data. Full details in our Privacy Policy.',
        images: ['https://citywitty.com/citywittynew.jpg'],
    },
    alternates: {
        canonical: 'https://citywitty.com/privacy',
    },
};
export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}