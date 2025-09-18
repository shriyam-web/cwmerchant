// app/merchant-packages/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Merchant Packages | CityWitty Privilege Card",
    description:
        "Discover CityWitty Merchant Packages designed for businesses of all sizes. Compare plans, explore benefits, and choose the right package to grow your business online.",
    keywords: [
        "CityWitty Merchant Packages",
        "Business Pricing Plans",
        "Merchant Membership",
        "Privilege Card Benefits",
        "Business Growth Plans",
        "Local Business Promotion",
    ],
    openGraph: {
        title: "Merchant Packages | CityWitty Privilege Card",
        description:
            "Choose from CityWitty’s merchant pricing plans to expand your business visibility and connect with more customers.",
        url: "https://citywitty.com/merchant-packages",
        siteName: "CityWitty",
        images: [
            {
                url: "https://citywitty.com/citywittynew.jpg",
                width: 1200,
                height: 630,
                alt: "CityWitty Merchant Packages",
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Merchant Packages | CityWitty Privilege Card",
        description:
            "Explore flexible merchant packages tailored for business growth and visibility on CityWitty.",
        images: ["https://citywitty.com/citywittynew.jpg"],
    },
    alternates: {
        canonical: "https://citywitty.com/merchant-packages",
    },
};

export default function MerchantPackagesPage() {
    const plans = [
        {
            name: "Starter Plan",
            price: "X",
            description: "For new merchants beginning their digital journey.",
            features: [
                "Business profile listing on CityWitty",
                "Basic analytics and insights",
                "Customer inquiries via platform",
                "Email support",
            ],
        },
        {
            name: "Growth Plan",
            price: "X",
            description: "For growing merchants who want more visibility.",
            features: [
                "Priority placement in listings",
                "Advanced business analytics",
                "Social media promotions",
                "Dedicated support manager",
            ],
            popular: true,
        },
        {
            name: "Premium Plan",
            price: "X",
            description: "For established businesses aiming for maximum reach.",
            features: [
                "Top-tier placement in all listings",
                "Comprehensive analytics dashboard",
                "Exclusive marketing campaigns",
                "24/7 premium support",
            ],
        },
    ];

    const benefits = [
        {
            title: "Increased Visibility",
            desc: "Get featured on CityWitty and reach thousands of potential customers actively searching for services like yours.",
        },
        {
            title: "Customer Trust",
            desc: "A verified merchant profile builds credibility, helping customers choose your business with confidence.",
        },
        {
            title: "Business Growth",
            desc: "Leverage promotional tools, analytics, and campaigns to expand your customer base and revenue.",
        },
        {
            title: "Dedicated Support",
            desc: "Our support team ensures your business queries and concerns are resolved quickly and efficiently.",
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <br />
            {/* Hero Section */}
            <section className="py-10 pt-20 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Choose the Right Merchant Package
                    </h1>
                    <p className="text-lg text-gray-700 mb-8">
                        CityWitty offers flexible merchant packages designed to help your
                        business gain visibility, attract more customers, and grow
                        effectively. Select the plan that aligns with your goals.
                    </p>
                    <a
                        href="#pricing"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition"
                    >
                        View Packages
                    </a>
                </div>
            </section>

            {/* Pricing Plans */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">
                        Our Pricing Plans
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`bg-white rounded-2xl border border-gray-200 p-8 flex flex-col shadow-md hover:shadow-xl hover:scale-105 transition duration-300 ${plan.popular ? "ring-2 ring-indigo-500" : ""
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="inline-block mb-4 px-4 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-600 mb-4">{plan.description}</p>
                                <div className="text-4xl font-bold text-indigo-600 mb-6">
                                    ₹{plan.price}
                                    <span className="text-base font-medium text-gray-500">/yr</span>
                                </div>
                                <ul className="text-gray-700 space-y-3 flex-1 mb-6 text-left">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow hover:scale-105 transition">
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            {/* Benefits Section */}
            <section id="benefits" className="py-20 bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Benefits of Choosing CityWitty Merchant Packages
                    </h2>
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: "Boost Your Visibility",
                                desc: "Get priority placement and premium exposure on CityWitty, ensuring more customers discover your business.",
                            },
                            {
                                title: "Lead Generation",
                                desc: "Receive genuine customer inquiries and build a steady pipeline of leads directly through the platform.",
                            },
                            {
                                title: "Digital Marketing Support",
                                desc: "Leverage social media promotions, exclusive campaigns, and targeted reach to expand your customer base.",
                            },
                            {
                                title: "Stronger Customer Trust",
                                desc: "Showcase a verified merchant profile with CityWitty branding, building instant credibility with new customers.",
                            },
                            {
                                title: "Analytics & Insights",
                                desc: "Track performance with in-depth analytics to understand customer behavior and optimize your business strategy.",
                            },
                            {
                                title: "Dedicated Support",
                                desc: "Enjoy priority customer support to resolve issues quickly and get expert guidance for growing your business.",
                            },
                        ].map((benefit) => (
                            <div
                                key={benefit.title}
                                className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition"
                            >
                                <CheckCircle className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <Footer />
        </main>
    );
}
