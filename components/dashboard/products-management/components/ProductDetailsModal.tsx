'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Award,
    Box,
    Check,
    IndianRupee,
    MapPin,
    Package,
    Shield,
    Star,
    Tag,
    Truck,
    Wallet,
    Zap,
    Info,
    Ruler,
    Weight,
    Clock,
    RefreshCw,
    HelpCircle,
    Edit,
} from 'lucide-react';
import { currencyFormatter, ProductRecord } from '../types';

type ProductDetailsModalProps = {
    product: ProductRecord | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (product: ProductRecord) => void;
};

export const ProductDetailsModal = ({ product, open, onOpenChange, onEdit }: ProductDetailsModalProps) => {
    if (!product) return null;

    const originalPrice = product.originalPrice ?? 0;
    const discountedPrice = product.discountedPrice ?? originalPrice;
    const hasDiscount = product.discountedPrice != null && product.originalPrice != null;
    const discountPercent = hasDiscount && originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
    const productImages = product.productImages ?? [];
    const hasProductImages = productImages.length > 0;
    const productHighlights = product.productHighlights ?? [];
    const hasProductHighlights = productHighlights.length > 0;
    const productVariants = product.productVariants ?? [];
    const hasProductVariants = productVariants.length > 0;
    const faq = product.faq ?? [];
    const hasFaq = faq.length > 0;
    const whatsInsideTheBox = product.whatsInsideTheBox ?? [];
    const hasWhatsInsideTheBox = whatsInsideTheBox.length > 0;
    const deliverableLocations = product.deliverableLocations ?? [];
    const hasDeliverableLocations = deliverableLocations.length > 0;

    const handleEdit = () => {
        if (onEdit) {
            onEdit(product);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold">{product.productName}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2 mt-2">
                                <Box className="h-4 w-4" />
                                {product.productCategory}
                                {product.brand && (
                                    <>
                                        <span className="text-muted-foreground">•</span>
                                        <Tag className="h-4 w-4" />
                                        {product.brand}
                                    </>
                                )}
                            </DialogDescription>
                        </div>
                        {onEdit && (
                            <Button
                                onClick={handleEdit}
                                className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
                    <div className="space-y-6">
                        {/* Badges Section */}
                        <div className="flex flex-wrap gap-2">
                            {product.bestsellerBadge && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                                    <Award className="h-3 w-3 mr-1" />
                                    Bestseller
                                </Badge>
                            )}
                            {product.cityWittyAssured && (
                                <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
                                    <Shield className="h-3 w-3 mr-1" />
                                    CityWitty Assured
                                </Badge>
                            )}
                            {product.isPriority && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                    <Star className="h-3 w-3 mr-1 fill-white" />
                                    Priority
                                </Badge>
                            )}
                            {product.sponsored && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                    <Zap className="h-3 w-3 mr-1 fill-white" />
                                    Sponsored
                                </Badge>
                            )}
                        </div>

                        {/* Product Images */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Product Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {hasProductImages ? (
                                    productImages.map((image, index) => (
                                        <div key={index} className="aspect-video rounded-lg overflow-hidden border-2">
                                            <img src={image} alt={`${product.productName} ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex items-center justify-center rounded-lg border-2 border-dashed py-6 text-muted-foreground">
                                        No product images available
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Pricing Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-xl border-2 border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                                        <IndianRupee className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-green-600">
                                                {currencyFormatter.format(discountedPrice)}
                                            </span>
                                            {hasDiscount && (
                                                <>
                                                    <span className="text-lg text-muted-foreground line-through">
                                                        {currencyFormatter.format(originalPrice)}
                                                    </span>
                                                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                                                        {discountPercent}% OFF
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                        {hasDiscount && (
                                            <p className="text-sm text-green-600 mt-1">
                                                You save {currencyFormatter.format(originalPrice - discountedPrice)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Delivery Fee</p>
                                        <p className="font-semibold">
                                            {(product.deliveryFee ?? 0) === 0 ? 'FREE' : currencyFormatter.format(product.deliveryFee ?? 0)}
                                        </p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Handling Fee</p>
                                        <p className="font-semibold">{currencyFormatter.format(product.orderHandlingFee ?? 0)}</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Cashback Points</p>
                                        <p className="font-semibold">{product.cashbackPoints ?? 0} points</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Discount Offered</p>
                                        <p className="font-semibold">{currencyFormatter.format(product.discountOfferedOnProduct ?? 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">{product.productDescription}</p>
                        </div>

                        {/* Product Highlights */}
                        {hasProductHighlights && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
                                    <ul className="space-y-2">
                                        {productHighlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        <Separator />

                        {/* Stock & Availability */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Stock & Availability</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className={`p-4 rounded-xl border-2 ${product.isAvailableStock ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <Package className={`h-5 w-5 ${product.isAvailableStock ? 'text-blue-600' : 'text-gray-500'}`} />
                                        <div>
                                            <p className="font-semibold">
                                                {product.isAvailableStock ? `${product.availableStocks ?? 0} units` : 'Out of Stock'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Available Stock</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border-2 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="font-semibold">{product.instore ? 'Available' : 'Online Only'}</p>
                                            <p className="text-xs text-muted-foreground">In-Store</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {product.eta && (
                                <div className="mt-3 flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Estimated Delivery:</span>
                                    <span className="font-semibold">{product.eta}</span>
                                </div>
                            )}
                        </div>

                        {/* Product Variants */}
                        {hasProductVariants && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Product Variants</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {productVariants.map((variant) => (
                                            <div key={variant.variantId} className="p-4 rounded-xl border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <p className="font-semibold">{variant.name}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-green-600 font-bold">{currencyFormatter.format(variant.price ?? 0)}</span>
                                                    <span className="text-sm text-muted-foreground">{variant.stock ?? 0} in stock</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Features */}
                        <Separator />
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.instore && (
                                    <Badge variant="outline" className="border-blue-300 text-blue-600">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        In-Store Available
                                    </Badge>
                                )}
                                {product.isWalletCompatible && (
                                    <Badge variant="outline" className="border-purple-300 text-purple-600">
                                        <Wallet className="h-3 w-3 mr-1" />
                                        Wallet Compatible
                                    </Badge>
                                )}
                                {product.isWarranty && (
                                    <Badge variant="outline" className="border-green-300 text-green-600">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Warranty Available
                                    </Badge>
                                )}
                                {(product.deliveryFee ?? 0) === 0 && (
                                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                                        <Truck className="h-3 w-3 mr-1" />
                                        Free Delivery
                                    </Badge>
                                )}
                                {product.isReplacement && (
                                    <Badge variant="outline" className="border-red-300 text-red-600">
                                        <RefreshCw className="h-3 w-3 mr-1" />
                                        Replacement Available
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Warranty & Replacement */}
                        {(product.isWarranty || product.isReplacement) && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Warranty & Replacement</h3>
                                    <div className="space-y-3">
                                        {product.isWarranty && product.warrantyDescription && (
                                            <div className="p-4 rounded-xl border-2 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                                                <div className="flex items-start gap-3">
                                                    <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold">Warranty</p>
                                                        <p className="text-sm text-muted-foreground mt-1">{product.warrantyDescription}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {product.isReplacement && product.replacementDays && (
                                            <div className="p-4 rounded-xl border-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                                                <div className="flex items-start gap-3">
                                                    <RefreshCw className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold">Replacement Policy</p>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {product.replacementDays} days replacement available
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Dimensions & Weight */}
                        {(product.productHeight || product.productWidth || product.productWeight) && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Dimensions & Weight</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {product.productHeight && (
                                            <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <div className="flex items-center gap-2">
                                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Height</p>
                                                        <p className="font-semibold">{product.productHeight} mm</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {product.productWidth && (
                                            <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <div className="flex items-center gap-2">
                                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Width</p>
                                                        <p className="font-semibold">{product.productWidth} mm</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {product.productWeight && (
                                            <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <div className="flex items-center gap-2">
                                                    <Weight className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Weight</p>
                                                        <p className="font-semibold">{product.productWeight} g</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Package Details */}
                        {(product.productPackageHeight || product.productPackageWidth || product.productPackageWeight) && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Package Details</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {product.productPackageHeight && (
                                            <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <p className="text-xs text-muted-foreground">Package Height</p>
                                                <p className="font-semibold">{product.productPackageHeight} cm</p>
                                            </div>
                                        )}
                                        {product.productPackageWidth && (
                                            <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <p className="text-xs text-muted-foreground">Package Width</p>
                                                <p className="font-semibold">{product.productPackageWidth} cm</p>
                                            </div>
                                        )}
                                        {product.productPackageWeight && (
                                            <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <p className="text-xs text-muted-foreground">Package Weight</p>
                                                <p className="font-semibold">{product.productPackageWeight} g</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* What's Inside the Box */}
                        {hasWhatsInsideTheBox && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">What's Inside the Box</h3>
                                    <ul className="space-y-2">
                                        {whatsInsideTheBox.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Box className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        {/* Deliverable Locations */}
                        {hasDeliverableLocations && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Deliverable Locations</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {deliverableLocations.map((location, index) => (
                                            <Badge key={index} variant="secondary">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {location}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Additional Info */}
                        {product.additionalInfo && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Info className="h-5 w-5" />
                                        Additional Information
                                    </h3>
                                    <p className="text-muted-foreground">{product.additionalInfo}</p>
                                </div>
                            </>
                        )}

                        {/* FAQ */}
                        {hasFaq && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <HelpCircle className="h-5 w-5" />
                                        Frequently Asked Questions
                                    </h3>
                                    <div className="space-y-4">
                                        {faq.map((item, index) => (
                                            <div key={index} className="p-4 rounded-xl border-2 bg-gray-50 dark:bg-gray-900/20">
                                                <p className="font-semibold mb-2">{item.question}</p>
                                                <p className="text-sm text-muted-foreground">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Offer Details */}
                        {product.offerApplicable && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Offer Details</h3>
                                    <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
                                        <div className="flex items-center gap-3">
                                            <Zap className="h-5 w-5 text-orange-600" />
                                            <p className="font-semibold">{product.offerApplicable}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Product ID */}
                        <Separator />
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold">Product ID:</span> {product.productId}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};