import { Building2, Send } from 'lucide-react';

export default function HeroSection() {
    return (
        <div className="bg-gray-50 py-16 px-4 mt-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <Building2 className="w-16 h-16 text-blue-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Join CityWitty Merchant Hub
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Expand your business reach and connect with thousands of CityWitty cardholders.
                    Get started with our simple registration process.
                </p>
                <div className="flex justify-center">
                    <Send className="w-8 h-8 text-blue-600 animate-bounce" />
                </div>
            </div>
        </div>
    );
}
