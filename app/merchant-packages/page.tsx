
// app/merchant-packages/page.tsx
// "use client";

// import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
// import { useState } from "react";
import { Loader2 } from "lucide-react"; // spinner icon
import { CheckCircle, XCircle } from "lucide-react";
import PricingCard from "@/components/ui/pricing-card";

import { Eye, Users, Megaphone, ShieldCheck, BarChart3, Headset } from "lucide-react";

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
        url: "https://partner.citywitty.com/merchant-packages",
        siteName: "CityWitty",
        images: [
            {
                url: "https://partner.citywitty.com/logo.png",
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
        images: ["https://partner.citywitty.com/logo.png"],
    },
    alternates: {
        canonical: "https://partner.citywitty.com/merchant-packages",
    },
};

export default function MerchantPackagesPage() {

    const benefits = [
        {
            title: "Boost Your Visibility",
            desc: "Get priority placement and premium exposure on CityWitty, ensuring more customers discover your business.",
            icon: Eye,
        },
        {
            title: "Lead Generation",
            desc: "Receive genuine customer inquiries and build a steady pipeline of leads directly through the platform.",
            icon: Users,
        },
        {
            title: "Digital Marketing Support",
            desc: "Leverage social media promotions, exclusive campaigns, and targeted reach to expand your customer base.",
            icon: Megaphone,
        },
        {
            title: "Stronger Customer Trust",
            desc: "Showcase a verified merchant profile with CityWitty branding, building instant credibility with new customers.",
            icon: ShieldCheck,
        },
        {
            title: "Analytics & Insights",
            desc: "Track performance with in-depth analytics to understand customer behavior and optimize your business strategy.",
            icon: BarChart3,
        },
        {
            title: "Dedicated Support",
            desc: "Enjoy priority customer support to resolve issues quickly and get expert guidance for growing your business.",
            icon: Headset,
        },
    ];
    const plans = [
        {
            name: "Launch Pad",
            badge: "Starter Plan",
            badgeType: "starter", // for custom color
            price: "60,000",
            description: "Perfect for new businesses starting their digital journey",
            features: [
                "4 creative graphics + 1 reel per month (LinkedIn, Facebook, Instagram and Youtube)",
                "Basic landing page/Website",
                "SEO optimization with AI integration", 
                "Upto 2x Sales Growth Expected",                 
                "10 products listing on Citywitty Merchant Store",
                "Digital Business Cards",
                "Brand listing on Citywitty Growth Network",
                "Faster Support",
                "❌ High Priority Support",
                "❌ PR/media features",
                "❌ Dedicated growth manager",
                "❌ Podcast",
            ],
            popular: false,
        },
        {
            name: "Scale Up",
            badge: "Most Popular",
            badgeType: "choice",
            price: "84,000",
            description: "Grow your presence and engagement on social media",
            features: [
                "8 creatives graphics + 2 reels per month (Social media reach on LinkedIn, Facebook, Instagram and Youtube & engagement tracking)",
                "Advanced website",
                "PR blog/article on Citywitty platform",
                "20 products listing on Citywitty Merchant Store",
                "Upto 4x Sales Growth Expected",
                "Digital Business Cards",
                "Verified Seller badge",
                "CityWitty Assured badge",
                "Search Engine Optimization with AI tools integration",
                "High Priority Support",
                "High Visibility on the CityWitty E-commerce platform for high sales",
                "PR/media features",
                "❌ Dedicated growth manager",
                "❌ Podcast",
            ],
            popular: true,
        },
        {
            name: "Market Leader",
            badge: "Premium Plan",
            badgeType: "premium",
            price: "1,20,000",
            description: "Complete digital marketing management for maximum impact",
            features: [
                "Complete digital marketing management (16 creative graphics + 4 reels per month for Facebook, Instagram, LinkedIn and Youtube) which gives advanced reach",
                "Website revamp with next-gen SEO (Human + AI friendly)",
                "Enhance product images with professional tools to improve visual appeal and boost their sales on our E-commerce store.",
                "30 products listings on Citywitty Merchant Store",
                "Upto 8x Sales Growth Expected",
                "Digital Business Card",
                "CW Premium Seller badge",
                "CityWitty Assured badge",
                "High Priority Support",
                "High Visibility on the CityWitty E-commerce platform for high sales",
                "PR/influencer/media features",
                "Dedicated growth manager",
                "Podcast",
            ],
            popular: false,
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
            <section id="pricing" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
                        Our Pricing Plans
                    </h2>

                    <div className="grid gap-10 md:grid-cols-3">
                        {plans.map((plan) => (
                            <PricingCard key={plan.name} plan={plan} />
                        ))}
                    </div>
                </div>
            </section>



            {/* Benefits Section */}
            <section
                id="benefits"
                className="relative py-28 bg-gradient-to-b from-white via-indigo-50/50 to-purple-50 overflow-hidden"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
                    {/* Intro */}
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2
                            style={{ lineHeight: "1.25" }}
                            className="text-4xl md:text-5xl text-gray-900 mb-6 leading-tight"
                        >
                            Unlock the <span style={{ color: "#4F46E5" }}>Power & Benefits</span> of <br />
                            <span style={{
                                background: "linear-gradient(to right, #6366F1, #e22d2dff)",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                fontWeight: 600
                            }}>
                                CityWitty Merchant Packages
                            </span>
                        </h2>




                        <p className="text-lg text-gray-600">
                            Empower your business with premium visibility, trust, and growth tools — all bundled into one powerful package.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="relative bg-white rounded-3xl p-8 text-center border border-gray-100
            shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 group"
                            >
                                {/* Icon wrapper */}
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
            flex items-center justify-center shadow-xl ring-1 ring-indigo-200 group-hover:scale-110 transition-transform duration-300">
                                    <benefit.icon className="w-10 h-10 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{benefit.desc}</p>

                                {/* Accent border bottom */}
                                <div className="mt-6 h-1 w-16 bg-indigo-500 mx-auto rounded-full opacity-70"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200 rounded-full opacity-10"></div>
                    <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-indigo-200 rounded-full opacity-10"></div>
                </div>
            </section>



            <Footer />
        </main>
    );
}
