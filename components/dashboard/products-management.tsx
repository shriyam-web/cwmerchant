import { useState } from 'react';
import { Plus, Package, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductsForm } from './products-management/use-products-form';
import { ProductsFormContext } from './products-management/components/StepsContext';
import { StepNavigation, RenderStep, BottomNavigation } from './products-management/components/steps';
import { ProductsList } from './products-management/components/steps';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useMerchantAuth } from '@/lib/auth-context';
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteProduct = (productId: string) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

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
        <div className="space-y-8">
            {/* Hero Header Section */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <ShoppingCart className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Products Management</h1>
                            <p className="text-blue-100 text-lg mt-1">Products you add here will be live on CityWitty Store giving exposure to your products</p>
                        </div>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2 px-6 py-3 text-lg font-semibold shadow-lg">
                                <Plus className="h-5 w-5" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Add New Product
                                </DialogTitle>
                            </DialogHeader>
                            <ProductsFormContext.Provider value={contextValue}>
                                <Form {...form}>
                                    <div className="space-y-6">
                                        <StepNavigation context={contextValue} />
                                        <RenderStep
                                            context={contextValue}
                                            handleImageUpload={contextValue.onUploadImages}
                                        />
                                        <BottomNavigation context={contextValue} form={form} />
                                    </div>
                                </Form>
                            </ProductsFormContext.Provider>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{products.length}</div>
                        <p className="text-xs text-blue-600">In your catalog</p>
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
            </div>

            {/* Products Section */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-gray-900">Your Products</CardTitle>
                                <p className="text-sm text-gray-600">Digital products available online</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                            {products.length} products
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProductsList products={products} onDelete={handleDeleteProduct} />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            and all its images from both the database and Cloudinary.
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
