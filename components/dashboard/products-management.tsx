import { useState, useEffect } from 'react';
import { Plus, Package, ShoppingCart, CheckCircle, XCircle, AlertTriangle, Flame, TrendingUp, Globe, Zap, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProductsForm } from './products-management/use-products-form';
import { ProductsFormContext } from './products-management/components/StepsContext';
import { StepNavigation, RenderStep, BottomNavigation } from './products-management/components/steps';
import { ProductsList } from './products-management/components/steps';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useMerchantAuth } from '@/lib/auth-context';
import { productRecordToFormValues, ProductRecord } from './products-management/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const ProductsManagement = () => {
    const { merchant } = useMerchantAuth();
    const merchantData = merchant as any;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

    const {
        form,
        products,
        setProducts,
        isAddDialogOpen,
        setIsAddDialogOpen,
        currentStep,
        setCurrentStep,
        uploadingImages,
        setUploadingImages,
        loading,
        imagesFieldArray,
        highlightsFieldArray,
        variantsFieldArray,
        boxItemsFieldArray,
        locationsFieldArray,
        faqFieldArray,
        watchIsAvailableStock,
        watchIsWarranty,
        watchIsReplacement,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        validateStep,
        onUploadImages,
        handleSubmitProduct,
        fetchProducts,
    } = useProductsForm();

    const fieldArrays = {
        productImages: imagesFieldArray,
        productHighlights: highlightsFieldArray,
        productVariants: variantsFieldArray,
        whatsInsideTheBox: boxItemsFieldArray,
        deliverableLocations: locationsFieldArray,
        faq: faqFieldArray,
    };

    const contextValue = {
        form,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        validateStep,
        isAddDialogOpen,
        setIsAddDialogOpen,
        uploadingImages,
        setUploadingImages,
        fieldArrays,
        watchIsAvailableStock,
        watchIsWarranty,
        watchIsReplacement,
        onSubmit: handleSubmitProduct,
        onUploadImages,
        loading,
    };

    const handleEditProduct = (product: ProductRecord) => {
        // Convert product record to form values
        const formValues = productRecordToFormValues(product);

        // Reset form with product data
        form.reset(formValues);

        // Open the dialog
        setIsAddDialogOpen(true);

        // Reset to first step
        setCurrentStep(0);
    };

    const handleDeleteProduct = (productId: string) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const totalProducts = products.length;
    const inStockProducts = products.filter((product: ProductRecord) => product.isAvailableStock && Number((product as ProductRecord).availableStocks ?? 0) > 0).length;
    const outOfStockProducts = totalProducts - inStockProducts;

    const getLastSyncDisplay = () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000);
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLastSyncTime(prev => new Date(prev));
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const confirmDeleteProduct = async () => {
        if (!productToDelete || !merchant?.id) return;

        setIsDeleting(true);
        try {
            const response = await fetch(
                `/api/merchant/products?merchantId=${merchant.id}&productId=${productToDelete}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete product');
            }

            toast({
                title: 'Product deleted',
                description: 'Product and its images have been successfully deleted.',
            });

            // Refresh products list
            await fetchProducts();
            setLastSyncTime(new Date());
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                title: 'Failed to delete product',
                description: error instanceof Error ? error.message : 'Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    return (
        <div id="tour-products" className="space-y-8 overflow-x-hidden">
            {/* CityWitty Store Section */}
            <Card className="border-0 bg-gradient-to-br from-gray-50 dark:from-gray-950/30 via-white dark:via-gray-950 to-purple-50 dark:to-purple-950/30 shadow-lg dark:shadow-gray-900/50 overflow-hidden w-full relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-gray-300/20 dark:bg-gray-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-300/20 dark:bg-purple-400/10 rounded-full blur-3xl" />
                </div>
                <CardHeader className="relative pb-6 overflow-hidden">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500 to-purple-600 shadow-lg flex-shrink-0">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">CityWitty E-Commerce Store</h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
                                    All products you add here are automatically synchronized and displayed on the CityWitty E-commerce platform, reaching thousands of potential customers.
                                </p>
                            </div>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button id="tour-products-actions" className="gap-2 rounded-full bg-gradient-to-r from-gray-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex-shrink-0 whitespace-nowrap">
                                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="hidden sm:inline">Add Product</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-950 border dark:border-gray-800"
                                onInteractOutside={(event) => event.preventDefault()}
                                onEscapeKeyDown={(event) => event.preventDefault()}
                            >
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                        <Package className="h-5 w-5" />
                                        {form.getValues('productId') ? 'Edit Product' : 'Add New Product'}
                                    </DialogTitle>
                                </DialogHeader>
                                <ProductsFormContext.Provider value={contextValue}>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleSubmitProduct)} className="space-y-6">
                                            <StepNavigation context={contextValue} />
                                            <RenderStep
                                                context={contextValue}
                                                handleImageUpload={contextValue.onUploadImages}
                                            />
                                            <BottomNavigation context={contextValue} form={form} />
                                        </form>
                                    </Form>
                                </ProductsFormContext.Provider>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="relative space-y-6 overflow-x-hidden">
                    {/* How It Works - Process Flow */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            How Your Products Go Live
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { step: "1", title: "Add Product", desc: "Create detailed product listing with images, prices & details" },
                                { step: "2", title: "Auto-Sync", desc: "Product automatically syncs to CityWitty E-commerce catalog" },
                                { step: "3", title: "Go Live", desc: "Product becomes visible to all CityWitty customers instantly" },
                                { step: "4", title: "Start Selling", desc: "Receive customer orders and manage sales from dashboard" }
                            ].map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/50 backdrop-blur">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                {item.step}
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                    {idx < 3 && (
                                        <div className="hidden lg:flex absolute -right-1.5 top-6 translate-x-full items-center">
                                            <div className="w-3 h-0.5 bg-gradient-to-r from-gray-400 to-purple-400" />
                                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Listing Limit Info */}
                    <div className="space-y-3 p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 dark:from-purple-900/20 to-gray-50/50 dark:to-gray-900/20">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                                    <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Product Listing Capacity</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Your current package allocation</p>
                                </div>
                            </div>
                        </div>
                        
                        {merchantData?.ListingLimit ? (
                            <div className="space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalProducts || 0} / {merchantData.ListingLimit}</span>
                                    <Badge className={`${
                                        totalProducts >= merchantData.ListingLimit
                                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700'
                                            : totalProducts >= (merchantData.ListingLimit * 0.8)
                                                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700'
                                                : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
                                    }`}>
                                        {totalProducts >= merchantData.ListingLimit
                                            ? 'Limit Reached'
                                            : totalProducts >= (merchantData.ListingLimit * 0.8)
                                                ? 'Nearly Full'
                                                : 'Available'}
                                    </Badge>
                                </div>
                                <div className="space-y-1.5">
                                    <Progress 
                                        value={(totalProducts / merchantData.ListingLimit) * 100} 
                                        className="h-2 bg-purple-100 dark:bg-purple-900/30"
                                    />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {merchantData.ListingLimit - (totalProducts || 0)} listing{merchantData.ListingLimit - (totalProducts || 0) === 1 ? '' : 's'} remaining
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800">
                                <p className="text-sm text-gray-900 dark:text-gray-300">
                                    ℹ️ No active package found. Upgrade your plan to add products to the CityWitty Store.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Key Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">⚡ Real-Time Sync</p>
                            <p className="text-xs text-green-600 dark:text-green-300">Instant updates across all platforms</p>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">🌍 Global Reach</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Visible to all CityWitty customers</p>
                        </div>
                        <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20">
                            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1">📊 Analytics</p>
                            <p className="text-xs text-purple-600 dark:text-purple-300">Track views, sales & performance</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-800">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                        <p className="text-xs text-gray-600">In your catalog</p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Active Products</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">
                            {products.filter((p: any) => p.isAvailableStock).length}
                        </div>
                        <p className="text-xs text-green-600">Currently in stock</p>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-800">Out of Stock Products</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-900">
                            {products.filter((p: any) => !p.isAvailableStock).length}
                        </div>
                        <p className="text-xs text-red-600">Need restocking</p>
                    </CardContent>
                </Card>
            </div> */}

            {/* Products Section - Enhanced Redesign */}
            <Card id="products-overview" className="border-0 bg-white dark:bg-gray-950 shadow-xl dark:shadow-gray-900/50 overflow-hidden">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 dark:from-gray-950/30 via-gray-50 dark:via-gray-950/30 to-purple-50 dark:to-purple-950/30">
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-400/20 dark:bg-gray-600/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-gray-400/15 dark:bg-gray-500/5 rounded-full blur-3xl" />
                    </div>
                    <CardHeader className="relative pb-8 px-6 sm:px-8 pt-8">
                        <div className="space-y-6">
                            {/* Title Section */}
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 rounded-xl bg-gradient-to-br from-gray-500 via-gray-600 to-gray-600 shadow-lg flex-shrink-0">
                                    <ShoppingCart className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-900 to-purple-900 dark:from-gray-200 dark:via-gray-200 dark:to-purple-200 bg-clip-text text-transparent">Your Products</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Real-time catalog management and performance tracking</p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {/* Total Products */}
                                <div className="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-gray-100/50 dark:from-gray-900/20 to-transparent rounded-xl transition-opacity" />
                                    <div className="relative space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-400">Total Products</p>
                                            <Package className="h-4 w-4 text-gray-500 opacity-60" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-300">{totalProducts}</p>
                                            <p className="text-xs text-gray-600/70 dark:text-gray-400/70">In your catalog</p>
                                        </div>
                                    </div>
                                </div>

                                {/* In Stock */}
                                <div className="group relative p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-100/50 dark:from-green-900/20 to-transparent rounded-xl transition-opacity" />
                                    <div className="relative space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs uppercase tracking-wide font-semibold text-green-600 dark:text-green-400">In Stock</p>
                                            <CheckCircle className="h-4 w-4 text-green-500 opacity-60" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-300">{inStockProducts}</p>
                                            <p className="text-xs text-green-600/70 dark:text-green-400/70">Ready to sell</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Out of Stock */}
                                <div className="group relative p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-red-100/50 dark:from-red-900/20 to-transparent rounded-xl transition-opacity" />
                                    <div className="relative space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs uppercase tracking-wide font-semibold text-red-600 dark:text-red-400">Out of Stock</p>
                                            <XCircle className="h-4 w-4 text-red-500 opacity-60" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl sm:text-3xl font-bold text-red-900 dark:text-red-300">{outOfStockProducts}</p>
                                            <p className="text-xs text-red-600/70 dark:text-red-400/70">Need restocking</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Sync */}
                                <div className="group relative p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-100/50 dark:from-purple-900/20 to-transparent rounded-xl transition-opacity" />
                                    <div className="relative space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs uppercase tracking-wide font-semibold text-purple-600 dark:text-purple-400">Last Sync</p>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-30 animate-pulse" />
                                                <div className="relative w-2 h-2 bg-purple-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm sm:text-base font-bold text-purple-900 dark:text-purple-300">{getLastSyncDisplay()}</p>
                                            <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Auto-synced</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </div>

                {/* Bestsellers & Top Performers Section */}
                <div className="px-6 sm:px-8 py-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 dark:from-gray-900/30 to-gray-100/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-orange-100 dark:from-orange-900/40 to-red-100 dark:to-red-900/40">
                            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your bestselling & featured products</p>
                        </div>
                    </div>
                    
                    {products.filter(p => p.bestsellerBadge || p.isPriority || (p.availableStocks ?? 0) > 0).slice(0, 3).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {products.filter(p => p.bestsellerBadge || p.isPriority || (p.availableStocks ?? 0) > 0).slice(0, 3).map((product) => (
                                <div key={product.productId} className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200">
                                    <div className="relative mb-4 aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        {product.productImages?.[0] ? (
                                            <img src={product.productImages[0]} alt={product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                        {product.bestsellerBadge && (
                                            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                                <Flame className="h-3 w-3 mr-1" />
                                                Bestseller
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{product.productName}</h4>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-green-600 dark:text-green-400">₹{product.discountedPrice || product.originalPrice}</span>
                                            {product.discountedPrice && product.originalPrice && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{product.availableStocks ?? 0} in stock</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">No bestsellers yet. Add products to get started!</p>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <CardContent className="p-6 sm:p-8 bg-white dark:bg-gray-950">
                    <ProductsList products={products} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-gray-950 border dark:border-gray-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            This action cannot be undone. This will permanently delete the product
                            and all its images.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteProduct}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
