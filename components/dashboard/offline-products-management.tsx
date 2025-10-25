import { useEffect } from 'react';
import { Plus, Package, Store, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductsForm } from './products-management/use-products-form';
import { ProductsFormContext } from './products-management/components/StepsContext';
import { StepNavigation, RenderStep, BottomNavigation } from './products-management/components/steps';
import { ProductsList } from './products-management/components/steps';
import { useMerchantAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';

export const OfflineProductsManagement = () => {
    const { merchant } = useMerchantAuth();
    
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

    const handleDeleteProduct = async (productId: string) => {
        if (!merchant?.id) {
            console.error('No merchant ID available for deletion');
            return;
        }

        try {
            const url = `/api/merchant/products?merchantId=${merchant.id}&productId=${productId}`;
            console.log('Deleting product from:', url);
            
            const response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Delete API error:', errorData);
                throw new Error('Failed to delete product');
            }

            const responseData = await response.json();
            console.log('Product deleted successfully:', responseData);

            setProducts((prev) => prev.filter((product) => product.productId !== productId));
            toast({
                title: 'Product deleted',
                description: 'Product has been successfully removed.',
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: 'Failed to delete product',
                description: error instanceof Error ? error.message : 'Please try again later.',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        console.log('OfflineProductsManagement mounted - products:', products);
    }, [products]);

    return (
        <div className="space-y-8">
            {/* Hero Header Section */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <Store className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Store Management</h1>
                            <p className="text-orange-100 text-lg mt-1">Manage your physical store products and inventory</p>
                        </div>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-orange-600 hover:bg-orange-50 gap-2 px-6 py-3 text-lg font-semibold shadow-lg">
                                <Plus className="h-5 w-5" />
                                Add Store Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Add New Store Product
                                </DialogTitle>
                            </DialogHeader>
                            <ProductsFormContext.Provider value={contextValue}>
                                <form onSubmit={form.handleSubmit(handleSubmitProduct)}>
                                    <div className="space-y-6">
                                        <StepNavigation context={contextValue} />
                                        <RenderStep
                                            context={contextValue}
                                            handleImageUpload={contextValue.onUploadImages}
                                        />
                                        <BottomNavigation context={contextValue} form={form} />
                                    </div>
                                </form>
                            </ProductsFormContext.Provider>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-800">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-900">{products.length}</div>
                        <p className="text-xs text-orange-600">In your store catalog</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800">Store Categories</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">
                            {new Set(products.map(p => p.productCategory)).size}
                        </div>
                        <p className="text-xs text-blue-600">Product categories</p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Store Performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">Active</div>
                        <p className="text-xs text-green-600">Store status</p>
                    </CardContent>
                </Card>
            </div>

            {/* Products Section */}
            <Card className="border-2 border-dashed border-orange-200 bg-orange-50/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Store className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-gray-900">Your Store Products</CardTitle>
                                <p className="text-sm text-gray-600">Physical products available in your store</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                            {products.length} products
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProductsList products={products} onDelete={handleDeleteProduct} />
                </CardContent>
            </Card>
        </div>
    );
};
