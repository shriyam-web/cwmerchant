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
    const unavailableProducts = totalProducts - inStockProducts;

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
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-8 py-10 shadow-sm">
                <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
                <div className="relative grid gap-10 lg:grid-cols-[1.1fr,1fr]">
                    <div className="space-y-6">
                        <Badge variant="outline" className="w-fit border-blue-200 bg-blue-100/60 text-blue-700">
                            Store Control Center
                        </Badge>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight text-blue-950">Command your product experience</h1>
                            <p className="text-base text-blue-800/80 md:text-lg">
                                Shape compelling listings, coordinate pricing, and keep availability in check across the CityWitty marketplace.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-xl border border-blue-200/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <div className="rounded-lg bg-blue-600/10 p-2 text-blue-600">
                                    <ShoppingCart className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-blue-900">Unified catalog</p>
                                    <p className="text-sm text-blue-700/80">
                                        Keep SKUs, variants, media, and delivery promises aligned in one streamlined flow.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-purple-200/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <div className="rounded-lg bg-purple-600/10 p-2 text-purple-600">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-purple-900">Launch faster</p>
                                    <p className="text-sm text-purple-700/80">
                                        Reuse highlights, FAQs, and media kits to publish products in minutes.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-700">
                                        <Plus className="h-5 w-5" />
                                        Add Product
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
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
                            <Button
                                variant="outline"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                asChild
                            >
                                <a href="#products-overview">View catalog</a>
                            </Button>
                        </div>
                    </div>
                    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-blue-200/60 bg-white/90 p-6 shadow-lg backdrop-blur">
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-600">Live overview</h3>
                            <p className="mt-2 text-sm text-blue-900/70">
                                Keep a pulse on catalog health before diving into detailed management.
                            </p>
                        </div>
                        <dl className="grid grid-cols-2 gap-4 text-sm text-blue-900">
                            <div className="space-y-1 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                <dt className="text-xs uppercase text-blue-500">Total Products</dt>
                                <dd className="text-2xl font-bold text-blue-900">{totalProducts}</dd>
                                <dd className="text-xs text-blue-700/70">Across your active catalog</dd>
                            </div>
                            <div className="space-y-1 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                                <dt className="text-xs uppercase text-emerald-600">In Stock</dt>
                                <dd className="text-2xl font-bold text-emerald-700">
                                    {inStockProducts}
                                </dd>
                                <dd className="text-xs text-emerald-600/80">Ready for purchase</dd>
                            </div>
                            <div className="space-y-1 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                                <dt className="text-xs uppercase text-indigo-600">Needs Attention</dt>
                                <dd className="text-2xl font-bold text-indigo-700">
                                    {unavailableProducts}
                                </dd>
                                <dd className="text-xs text-indigo-600/80">Review inventory levels</dd>
                            </div>
                            <div className="space-y-1 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                                <dt className="text-xs uppercase text-purple-600">Last Sync</dt>
                                <dd className="text-2xl font-bold text-purple-700">
                                    {loading ? 'Updating…' : 'Moments ago'}
                                </dd>
                                <dd className="text-xs text-purple-600/80">Auto-refresh with form activity</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div> */}

            {/* Products Section */}
            <Card id="products-overview" className="border-2 border-dashed border-blue-200 bg-blue-50/30">
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
                    <ProductsList products={products} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
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
