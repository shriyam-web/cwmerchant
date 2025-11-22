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
  Pencil,
} from 'lucide-react';
import { useState } from 'react';
import { currencyFormatter, ProductRecord } from '../types';
import { ProductDetailsModal } from './ProductDetailsModal';

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
      <Badge className="bg-gradient-to-r from-gray-600 to-gray-500 text-white border-0 shadow-lg backdrop-blur-sm">
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
  onEdit?: (product: ProductRecord) => void;
};

export const ProductCard = ({ product, onDelete, onEdit }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayBadges = badgeConfigs.filter(({ condition }) => condition(product));

  const originalPrice = product.originalPrice ?? 0;
  const discountedPrice = product.discountedPrice ?? product.originalPrice ?? 0;
  const hasDiscount = product.discountedPrice != null && product.originalPrice != null;
  const discountPercent = hasDiscount && originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
  const availableStockCount = product.availableStocks ?? 0;
  const isAvailable = product.isAvailableStock && availableStockCount > 0;
  const primaryImage = product.productImages?.[0];
  const hasPrimaryImage = Boolean(primaryImage);

  return (
    <Card className="group overflow-hidden border-2 hover:border-gray-400 hover:shadow-2xl transition-all duration-500 rounded-3xl bg-gradient-to-br from-white via-gray-50/30 to-gray-50/30 dark:from-gray-900 dark:via-gray-950/20 dark:to-gray-950/20 hover:scale-[1.02] hover:-trangray-y-1">
      {/* Image Section with Enhanced Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
        {hasPrimaryImage ? (
          <img
            src={primaryImage}
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
        <div id="tour-products-manage" className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </Button>
          {onEdit && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4 text-gray-700" />
            </Button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!isAvailable && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-t-3xl">
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
            <CardTitle className="line-clamp-2 group-hover:text-gray-600 transition-colors text-lg font-semibold leading-tight">
              {product.productName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/30">
                <Box className="h-3.5 w-3.5 text-gray-600" />
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
            isAvailable
              ? 'bg-gradient-to-r from-gray-50 to-cyan-50 dark:from-gray-950/20 dark:to-cyan-950/20 border-gray-200 dark:border-gray-800 hover:shadow-gray-200/50'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700'
          )}
        >
          <div
            className={cn(
              'p-2.5 rounded-lg shadow-md',
              isAvailable
                ? 'bg-gradient-to-br from-gray-500 to-cyan-500'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
            )}
          >
            <Package className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold">
              {availableStockCount > 0 ? `${availableStockCount} units in stock` : 'Currently unavailable'}
            </span>
            {availableStockCount > 0 && (
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
            <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400 shadow-sm px-2 py-0.5 rounded-full hover:bg-gray-50 transition-colors text-xs">
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

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onEdit={onEdit}
      />
    </Card>
  );
};
