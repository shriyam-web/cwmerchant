"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface PricingCardProps {
    plan: {
        name: string;
        badge?: string;
        badgeType?: string;
        price: string; // 👈 array se string hi aayega
        description: string;
        features: string[];
        popular?: boolean;
    };
}

export default function PricingCard({ plan }: PricingCardProps) {
    const [loading, setLoading] = useState(false);

    // Number form for calculations
    const numericPrice = Number(plan.price.replace(/,/g, ""));

    return (
        <div
            className={`relative bg-white rounded-3xl border border-gray-200 p-10 flex flex-col shadow-lg 
      hover:shadow-2xl hover:scale-105 hover:border-gray-400 transition-all duration-300
      text-sm ${plan.popular ? "ring-4 ring-gray-400" : ""}`}
        >
            {/* Badge */}
            {plan.badge && (
                <span
                    className={`absolute top-4 right-4 px-4 py-1 text-sm font-semibold rounded-full shadow
            ${plan.badgeType === "starter" ? "bg-gray-200 text-gray-800" : ""}
            ${plan.badgeType === "choice" ? "bg-purple-200 text-purple-800 animate-pulse" : ""}
            ${plan.badgeType === "premium" ? "bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-800 animate-shine" : ""}`}
                >
                    {plan.badge}
                </span>
            )}

            {/* Plan Name */}
            <br />
            <h3 className="text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>

            {/* Description */}
            <p className="text-gray-500 mb-6">{plan.description}</p>

            {/* Price Section */}
            <div className="mb-2">
                <div className="text-4xl font-extrabold text-gray-600">
                    ₹{plan.price}
                    <span className="text-lg font-medium text-gray-400">/yr</span>
                </div>
            </div>

            {/* Monthly */}
            <div className="bg-gray-50 text-gray-700 px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                ₹{Math.round(numericPrice / 12).toLocaleString("en-IN")} /month
            </div>



            {/* Features */}
            <ul className="text-gray-700 space-y-4 text-left flex-1 mb-8">
                {plan.features.map((feature) => {
                    let icon;
                    let textClass = "text-gray-800";
                    let label = feature;

                    if (feature.startsWith("❌")) {
                        icon = <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />;
                        label = feature.replace("❌ ", "");
                        textClass = "text-gray-500 ";
                    } else if (feature.startsWith("✅green")) {
                        icon = <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />;
                        label = feature.replace("✅green ", "");
                        textClass = "text-gray-800 ";
                    } else {
                        icon = <CheckCircle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />;
                    }

                    return (
                        <li key={feature} className={`flex items-start gap-3 ${textClass}`}>
                            {icon}
                            <span>{label}</span>
                        </li>
                    );
                })}

            </ul>

            {/* CTA */}
            <button
                onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 3000);
                }}
                className="relative w-full py-4 px-6 bg-gradient-to-r from-gray-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex justify-center items-center"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Processing...
                    </>
                ) : (
                    "Get Started"
                )}
            </button>

            {loading && (
                <p className="mt-2 text-sm text-gray-600">
                    You'll be forwarded to Payment Gateway to complete the purchase
                </p>
            )}
        </div>
    );
}
