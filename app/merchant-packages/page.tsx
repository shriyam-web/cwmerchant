// app/merchant-packages/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import { CheckCircle, XCircle } from "lucide-react";

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
    const plans = [
        {
            name: "Launch Pad",
            badge: "Starter Plan",
            badgeType: "starter", // for custom color
            price: "59,999",
            description: "Perfect for new businesses starting their digital journey",
            features: [
                "4 creative graphics + 1 reel per month (LinkedIn, Facebook, Instagram)",
                "Basic landing page/Website",
                "SEO optimization with AI integration",
                "10 products listing on Citywitty Merchant Store",
                "Digital Business Cards",
                "Brand listing on Citywitty Growth Network",
                "Faster Support",
                "❌ High Priority Support",
                "❌ PR/media features",
                "❌ Dedicated growth manager",
            ],
            popular: false,
        },
        {
            name: "Scale Up",
            badge: "Most Choice",
            badgeType: "choice",
            price: "83,999",
            description: "Grow your presence and engagement on social media",
            features: [
                "12 creatives graphics + 2 reels per month (Social media reach & engagement)",
                "Advanced website",
                "PR blog/article on Citywitty platform",
                "20 products listing on Citywitty Merchant Store",
                "Digital Business Cards",
                "Verified Seller badge",
                "CityWitty Assured badge",
                "Search Engine Optimization with AI tools integration",
                "High Priority Support",
                "PR/media features",
                "❌ Dedicated growth manager",
            ],
            popular: true,
        },
        {
            name: "Market Leader",
            badge: "Premium Plan",
            badgeType: "premium",
            price: "1,19,999",
            description: "Complete digital marketing management for maximum impact",
            features: [
                "Complete digital marketing management (24 creative graphics + 4 reels for FB, Insta, LinkedIn) which gives advanced reach",
                "Website revamp with next-gen SEO (Human + AI friendly)",
                "Monthly professional shoots (team/product)",
                "30 products listings on Citywitty Merchant Store",
                "Digital Business Card",
                "CW Premium Seller badge",
                "CityWitty Assured badge",
                "High Priority Support",
                "PR/influencer/media features",
                "Dedicated growth manager",
            ],
            popular: false,
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
            <section id="pricing" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
                        Our Pricing Plans
                    </h2>

                    <div className="grid gap-10 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative bg-white rounded-3xl border border-gray-200 p-10 flex flex-col shadow-lg 
    hover:shadow-2xl hover:scale-105 hover:border-indigo-400 transition-all duration-300
    text-sm   // <-- smaller font for the whole card (roughly 20% smaller)
    ${plan.popular ? "ring-4 ring-indigo-400" : ""}
  `}
                            >


                                {/* Plan Badge */}
                                {plan.badge && (
                                    <span
                                        className={`absolute top-4 right-4 px-4 py-1 text-sm font-semibold rounded-full shadow
            ${plan.badgeType === "starter" ? "bg-blue-200 text-blue-800" : ""}
            ${plan.badgeType === "choice" ? "bg-purple-200 text-purple-800 animate-pulse" : ""}
            ${plan.badgeType === "premium" ? "bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-800 animate-shine" : ""}
        `}
                                    >
                                        {plan.badge}
                                    </span>

                                )}




                                {/* Plan Name */}
                                <br />
                                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                    {plan.name}
                                </h3>

                                {/* Plan Description */}
                                <p className="text-gray-500 mb-6">{plan.description}</p>



                                {/* Price Section */}
                                <div className="mb-2">
                                    {/* Original Price (doubled, strike-through) */}
                                    <div className="text-2xl text-gray-400 line-through">
                                        ₹{(Number(plan.price.replace(/,/g, '')) * 2).toLocaleString()} /yr
                                    </div>

                                    {/* Discounted Price (final after Festive50) */}
                                    <div className="text-4xl font-extrabold text-indigo-600">
                                        ₹{plan.price}
                                        <span className="text-lg font-medium text-gray-400">/yr</span>
                                    </div>


                                </div>

                                {/* Monthly Cost */}
                                {/* Monthly Cost */}
                                <div className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                                    ₹{Math.round(Number(plan.price.replace(/,/g, '')) / 12).toLocaleString()} /month
                                </div>

                                {/* Offer Applied Badge */}
                                <div className="mt-1 mb-6 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    🎉 Festive50 Applied (50% OFF)
                                </div>

                                {/* Features List */}
                                <ul className="text-gray-700 space-y-4 text-left flex-1 mb-8">
                                    {plan.features.map((feature) => {
                                        const isExcluded = feature.startsWith("❌");
                                        return (
                                            <li key={feature} className="flex items-start gap-3">
                                                {isExcluded ? (
                                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                                ) : (
                                                    <CheckCircle className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                                                )}
                                                <span>{feature.replace("❌ ", "")}</span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* CTA Button */}
                                <button className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
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
