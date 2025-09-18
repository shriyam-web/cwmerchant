// app/cookies/page.tsx

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function CookiesPolicyPage() {
    return (
        <>
            <Header /> <br /> <br />
            <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
                <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>

                <p className="mb-4">
                    This Cookies Policy explains how <strong>CityWitty</strong> uses cookies
                    and similar technologies to recognize you when you visit our website. It
                    explains what these technologies are, why we use them, and your rights
                    to control our use of them.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">What are Cookies?</h2>
                <p className="mb-4">
                    Cookies are small text files placed on your device when you visit a
                    website. They are widely used to make websites work more efficiently, as
                    well as to provide information to the website owners.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    How We Use Cookies
                </h2>
                <p className="mb-4">
                    CityWitty uses cookies to improve your browsing experience, understand
                    how you interact with our platform, and personalize the content you see.
                    We may also use cookies to analyze traffic and for advertising purposes.
                </p>

                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>Essential Cookies:</strong> Required for the website to
                        function properly.
                    </li>
                    <li>
                        <strong>Performance Cookies:</strong> Help us understand how visitors
                        use our website.
                    </li>
                    <li>
                        <strong>Functional Cookies:</strong> Remember your preferences and
                        settings.
                    </li>
                    <li>
                        <strong>Advertising Cookies:</strong> Deliver relevant ads based on
                        your interests.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    Managing Your Cookie Preferences
                </h2>
                <p className="mb-4">
                    You can control and manage cookies in various ways. Please note that
                    removing or blocking cookies may impact your experience and parts of our
                    website may no longer be fully functional.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    Changes to This Policy
                </h2>
                <p className="mb-4">
                    We may update this Cookies Policy from time to time to reflect changes
                    to the cookies we use or for other operational, legal, or regulatory
                    reasons. Please revisit this page regularly to stay informed.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
                <p>
                    If you have any questions about our use of cookies or this Cookies
                    Policy, please contact us at{" "}
                    <a
                        href="mailto:support@citywitty.com"
                        className="text-blue-600 hover:underline"
                    >
                        support@citywitty.com
                    </a>
                    .
                </p>
            </main>
            <Footer />
        </>
    );
}
