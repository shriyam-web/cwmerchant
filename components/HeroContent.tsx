// components/HeroContent.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function HeroContent() {
    return (
        <div className="flex-1 text-center  lg:text-left font-sans">
            {/* Highlight Badge */}
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 font-semibold px-4 py-2 rounded-lg text-sm">
                India’s Fastest-Growing Merchant Hub
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight font-poppins">
                Accelerate Your Store’s Growth
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
                    {/* & Boost Your Brand Visibility. */}
                </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-lg lg:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-roboto">
                Join thousands of successful merchants growing with the customer base of <strong> <a href="https://www.citywitty.com">Citywitty</a></strong>. Showcase your store, attract more customers, and elevate your digital presence to the next level. Unlock opportunities to increase footfall, enhance brand trust, and drive revenue—all in one platform starting for free.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-10 py-5 text-lg group shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        Get Featured
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>

                <Link href="/success-stories">
                    <Button
                        variant="outline"
                        size="lg"
                        className="px-10 py-5 text-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                    >
                        Success Stories
                    </Button>
                </Link>
            </div>
        </div>
    );
}
