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
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-lg p-3 mb-4 shadow-sm dark:shadow-amber-900/20">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                            No Active Merchant Plan
                        </h3>
                        <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                            Consider upgrading to a merchant plan to accelerate your growth and unlock the next level of success.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleBuyPackage}
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-amber-600 dark:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 text-white h-8 text-xs flex-shrink-0"
                >
                    <ShoppingCart className="h-3 w-3 mr-1.5" />
                    Buy Package
                </Button>
            </div>
        </div>
    );
}