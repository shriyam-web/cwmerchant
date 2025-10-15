import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Award,
  Box,
  IndianRupee,
  MapPin,
  Package,
  Shield,
  Star,
  Tag,
  TrendingUp,
  Truck,
  Wallet,
  Zap,
  Trash2,
  Check,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { currencyFormatter, ProductRecord } from '../types';

const badgeConfigs = [
  {
    condition: (product: ProductRecord) => product.bestsellerBadge,
    content: (
      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm animate-pulse">
        <Award className="h-3 w-3 mr-1" />
        Bestseller
      </Badge>
    ),
  },
  {
    condition: (product: ProductRecord) => product.cityWittyAssured,
    content: (
      <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg backdrop-blur-sm">
        <Shield className="h-3 w-3 mr-1" />
        Assured
      </Badge>
    ),
  },
  {
    condition: (product: ProductRecord) => product.isPriority,
    content: (
      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg backdrop-blur-sm">
        <Star className="h-3 w-3 mr-1 fill-white" />
        Priority
      </Badge>
    ),
  },
  {
    condition: (product: ProductRecord) => product.sponsored,
    content: (
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg backdrop-blur-sm">
        <Zap className="h-3 w-3 mr-1 fill-white" />
        Sponsored
      </Badge>
    ),
  },
];

type ProductCardProps = {
  product: ProductRecord;
  onDelete: (productId: string) => void;
};

export const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const displayBadges = badgeConfigs.filter(({ condition }) => condition(product));

  const originalPrice = product.originalPrice;
  const discountedPrice = product.discountedPrice ?? product.originalPrice;
  const hasDiscount = product.discountedPrice != null;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

  return (
    <Card className="group overflow-hidden border-2 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 hover:scale-[1.02] hover:-translate-y-1">
      {/* Image Section with Enhanced Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
        {product.productImages[0] ? (
          <img
            src={product.productImages[0]}
            alt={product.productName}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground/70">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}

        {/* Enhanced Badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {displayBadges.map((badge, index) => (
            <div key={index} className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {badge.content}
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
            onClick={() => onDelete(product.productId)}
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </Button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.isAvailableStock && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center rounded-t-3xl">
            <Badge className="bg-red-500 text-white text-lg px-6 py-3 shadow-2xl animate-pulse">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-3 bottom-3">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg text-sm px-3 py-1 rounded-full">
              {discountPercent}% OFF
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors text-lg font-semibold leading-tight">
              {product.productName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <Box className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">{product.productCategory}</p>
            </div>
            {product.brand && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.brand}
                </Badge>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product.productId)}
            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 transition-all shrink-0 rounded-lg hover:scale-110 hover:rotate-12"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0 px-4 pb-4">
        {/* Enhanced Pricing Section */}
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-900/30 border-2 border-green-200 dark:border-green-800 shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl" />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <IndianRupee className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {currencyFormatter.format(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {currencyFormatter.format(originalPrice)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="mt-1">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm px-2 py-0.5 text-xs">
                    Save {currencyFormatter.format(originalPrice - discountedPrice)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Stock Status */}
        <div
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl border-2 shadow-md transition-all duration-300',
            product.isAvailableStock
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 hover:shadow-blue-200/50'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700'
          )}
        >
          <div
            className={cn(
              'p-2.5 rounded-lg shadow-md',
              product.isAvailableStock
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
            )}
          >
            <Package className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold">
              {product.isAvailableStock ? `${product.availableStocks} units in stock` : 'Currently unavailable'}
            </span>
            {product.isAvailableStock && (
              <div className="flex items-center gap-1 mt-0.5">
                <Check className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Ready to ship</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Feature Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {product.instore && (
            <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400 shadow-sm px-2 py-0.5 rounded-full hover:bg-blue-50 transition-colors text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              In-Store
            </Badge>
          )}
          {product.isWalletCompatible && (
            <Badge variant="outline" className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400 shadow-sm px-2 py-0.5 rounded-full hover:bg-purple-50 transition-colors text-xs">
              <Wallet className="h-3 w-3 mr-1" />
              Wallet
            </Badge>
          )}
          {product.isWarranty && (
            <Badge variant="outline" className="border-green-300 text-green-600 dark:border-green-700 dark:text-green-400 shadow-sm px-2 py-0.5 rounded-full hover:bg-green-50 transition-colors text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Warranty
            </Badge>
          )}
          {product.deliveryFee === 0 && (
            <Badge variant="outline" className="border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400 shadow-sm px-2 py-0.5 rounded-full hover:bg-orange-50 transition-colors text-xs">
              <Truck className="h-3 w-3 mr-1" />
              Free Delivery
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
