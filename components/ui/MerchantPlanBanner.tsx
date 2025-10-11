'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MerchantPlanBannerProps {
    merchantId: string;
}

export function MerchantPlanBanner({ merchantId }: MerchantPlanBannerProps) {
    const router = useRouter();

    const handleBuyPackage = () => {
        // Navigate to the merchant packages page
        router.push('/merchant-packages');
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-3 mb-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-blue-900">
                            No Active Merchant Plan
                        </h3>
                        <p className="text-xs text-blue-800 mt-0.5">
                            Consider upgrading to a merchant plan to accelerate your growth and unlock the next level of success.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleBuyPackage}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs flex-shrink-0"
                >
                    <ShoppingCart className="h-3 w-3 mr-1.5" />
                    Buy Package
                </Button>
            </div>
        </div>
    );
}