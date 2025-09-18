// app/privacy/page.tsx
import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
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

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                        Privacy Policy – Merchant Registration
                    </h1>

                    <p className="text-gray-700 mb-6">
                        CityWitty is committed to protecting the privacy and confidentiality of all merchant partners. This Privacy Policy explains how we collect, use, store, and protect the information provided during merchant registration and participation on our platform. By registering as a merchant, you consent to the practices described below.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                    <p className="text-gray-700 mb-4">
                        We collect personal and business information to ensure proper onboarding, compliance, and service delivery:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                        <li><strong>Business Details:</strong> Business name, type, category, years in operation, and physical address.</li>
                        <li><strong>Legal Information:</strong> GST number, PAN number, and other government-issued registration details.</li>
                        <li><strong>Contact Information:</strong> Owner/manager name, phone number, WhatsApp number, and email address.</li>
                        <li><strong>Online Presence:</strong> Business website, social media handles (Instagram, Facebook, etc.).</li>
                        <li><strong>Transactional Data:</strong> Payment details related to commission, revenue, or fees for platform services.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                    <p className="text-gray-700 mb-6">
                        Merchant information is used to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                        <li>Verify eligibility and authenticity of businesses.</li>
                        <li>Display accurate business details on CityWitty’s platform.</li>
                        <li>Process payments securely and manage merchant accounts.</li>
                        <li>Provide relevant updates, notifications, and promotional content.</li>
                        <li>Comply with legal, tax, and regulatory obligations.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security and Protection</h2>
                    <p className="text-gray-700 mb-6">
                        CityWitty employs strict technical and organizational measures to safeguard merchant information against unauthorized access, alteration, disclosure, or destruction:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                        <li>Encryption of sensitive data.</li>
                        <li>Secure storage and access control policies.</li>
                        <li>Regular security audits and system updates.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sharing of Information</h2>
                    <p className="text-gray-700 mb-6">
                        We do not sell or rent merchant data to third parties. Information may be shared with:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                        <li>Payment service providers for processing transactions.</li>
                        <li>Legal authorities when required by law or regulation.</li>
                        <li>Trusted service partners assisting in business operations.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Merchant Rights</h2>
                    <p className="text-gray-700 mb-6">
                        Merchants have the right to access, correct, or delete their personal information. Requests can be sent to our support team at <a href="mailto:contact@citywitty.com" className="text-blue-600 underline">contact@citywitty.com</a>.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Updates to Privacy Policy</h2>
                    <p className="text-gray-700 mb-6">
                        CityWitty may update this Privacy Policy periodically. Merchants are encouraged to review this page regularly. Significant changes will be communicated via email or platform notifications.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                    <p className="text-gray-700">
                        For questions or concerns about this Privacy Policy or merchant data handling, contact our support team at <a href="mailto:contact@citywitty.com" className="text-blue-600 underline">contact@citywitty.com</a>.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
