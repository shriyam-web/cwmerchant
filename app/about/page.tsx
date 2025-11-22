import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import React from "react";

export const metadata = {
    title: "About Us — CityWitty Merchant Hub | Grow Your Store in India",
    description:
        "CityWitty Merchant Hub empowers merchants with free and premium plans — from digital presence management, websites, social media, and graphical banners to local e-commerce visibility. Grow revenue and footfall with CityWitty.",
    keywords: [
        "CityWitty Merchant Hub",
        "merchant onboarding",
        "local business growth",
        "merchant partners",
        "digital presence management",
        "social media marketing",
        "e-commerce store India",
        "increase footfall",
        "merchant registration India",
    ].join(", "),
};

export default function Page() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CityWitty Merchant Hub",
        url: "https://www.partner.citywitty.com/",
        logo: "https://www.partner.citywitty.com/logo.png",
        // sameAs: [
        //     "https://www.facebook.com/CityWitty",
        //     "https://www.instagram.com/CityWitty",
        //     "https://www.linkedin.com/company/CityWitty",
        // ],
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+91-6389202030",
                contactType: "customer support",
                areaServed: "IN",
                email: "contact@citywitty.com",
            },
        ],
    };

    return (
        <>
            <Navbar />
            <br /><br />
            <main className="min-h-screen bg-gray-50 text-gray-900">
                {/* JSON-LD for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Hero */}
                <section className="bg-gradient-to-r from-white via-gray-50 to-white pt-12 pb-8">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                                    CityWitty Merchant Hub
                                    <span className="block text-gray-600 mt-2 text-lg font-medium">
                                        Empowering merchants across India with visibility, growth, and digital solutions.
                                    </span>
                                </h1>

                                <p className="mt-6 text-lg text-gray-700 max-w-xl">
                                    CityWitty Merchant Hub is designed to help merchants accelerate
                                    their business growth. From free store listings to premium
                                    digital solutions, we ensure your brand stands out, attracts more
                                    customers, and drives higher revenue.
                                </p>

                                <div className="mt-8 flex gap-4">
                                    <a
                                        href="/register"
                                        className="inline-flex items-center rounded-full px-6 py-3 bg-gray-600 text-white font-semibold shadow hover:shadow-lg transition"
                                    >
                                        Register Your Store — It's Free
                                    </a>
                                    <a
                                        href="/merchant-packages"
                                        className="inline-flex items-center rounded-full px-6 py-3 border border-gray-600 text-gray-600 font-semibold hover:bg-gray-50 transition"
                                    >
                                        Explore Premium Plans
                                    </a>
                                </div>
                            </div>

                            <div className="relative">
                                <img
                                    src="/merchant-growth.png"
                                    alt="Grow your business with CityWitty"
                                    className="w-full max-w-md mx-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Why Choose CityWitty Merchant Hub?
                            </h2>
                            <p className="mt-4 text-lg text-gray-700">
                                We go beyond just listings. With <span className="font-semibold">free
                                    onboarding</span> and <span className="font-semibold">premium plans</span>, CityWitty
                                Merchant Hub provides everything your business needs:
                            </p>
                            <ul className="mt-6 space-y-3 text-gray-700">
                                <li>✔ Free store registration with exposure to premium customers.</li>
                                <li>✔ End-to-end digital presence management — websites, banners, social media.</li>
                                <li>✔ Boosted visibility on <strong>CityWitty.com</strong> with an upcoming e-commerce store.</li>
                                <li>✔ Localized exposure — customers in your area see your business first.</li>
                                <li>✔ Secure payments, loyalty solutions, and marketing tools.</li>
                            </ul>
                        </div>

                        <div>
                            <img
                                src="digital-presence.jpg"
                                alt="Digital presence solutions"
                                className="w-full max-w-lg mx-auto"
                            />
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gray-600 text-white text-center">
                    <h2 className="text-3xl font-extrabold">
                        Start Free — Upgrade Anytime
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg">
                        Begin with a free store listing and unlock advanced digital services
                        with our premium plans. Let CityWitty manage your online presence,
                        while you focus on delivering great products and services.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <a
                            href="/register"
                            className="px-8 py-3 rounded-full bg-white text-gray-600 font-semibold shadow hover:shadow-lg transition"
                        >
                            Register Free
                        </a>
                        <a
                            href="/merchant-packages"
                            className="px-8 py-3 rounded-full border border-white font-semibold hover:bg-gray-500 transition"
                        >
                            View Premium Plans
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
