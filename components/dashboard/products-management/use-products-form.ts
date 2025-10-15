import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { useMerchantAuth } from '@/lib/auth-context';
import {
    ProductFormValues,
    createEmptyFormValues,
    formSchema,
    ProductRecord,
    parseNumberOrZero,
    parseNumberOrUndefined,
    sanitizeArray,
    generateId,
    initialProducts,
    steps,
} from './types';

export const useProductsForm = () => {
    const { merchant } = useMerchantAuth();
    const [products, setProducts] = useState<ProductRecord[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => createEmptyFormValues(), []),
        mode: 'onChange',
    });

    const imagesFieldArray = useFieldArray({ control: form.control, name: 'productImages' as FieldArrayPath<ProductFormValues> });
    const highlightsFieldArray = useFieldArray({ control: form.control, name: 'productHighlights' as FieldArrayPath<ProductFormValues> });
    const variantsFieldArray = useFieldArray({ control: form.control, name: 'productVariants' });
    const boxItemsFieldArray = useFieldArray({ control: form.control, name: 'whatsInsideTheBox' as FieldArrayPath<ProductFormValues> });
    const locationsFieldArray = useFieldArray({ control: form.control, name: 'deliverableLocations' as FieldArrayPath<ProductFormValues> });
    const faqFieldArray = useFieldArray({ control: form.control, name: 'faq' });

    const watchIsAvailableStock = form.watch('isAvailableStock');
    const watchIsWarranty = form.watch('isWarranty');
    const watchIsReplacement = form.watch('isReplacement');

    useEffect(() => {
        if (!isAddDialogOpen) {
            form.reset(createEmptyFormValues());
            setCurrentStep(0);
        }
    }, [isAddDialogOpen, form]);

    const goToNextStep = async () => {
        const canProceed = await validateStep(currentStep);
        if (!canProceed) {
            return false;
        }

        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        return true;
    };

    const goToPreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
    const goToStep = async (stepIndex: number) => {
        const targetIndex = Math.min(Math.max(stepIndex, 0), steps.length - 1);

        if (targetIndex === currentStep) return true;

        const direction = targetIndex > currentStep ? 1 : -1;
        let index = currentStep;

        while (index !== targetIndex) {
            if (direction > 0) {
                const valid = await validateStep(index);
                if (!valid) {
                    setCurrentStep(index);
                    return false;
                }
            }
            index += direction;
        }

        setCurrentStep(targetIndex);
        return true;
    };

    const validateStep = async (stepIndex: number) => {
        const step = steps[stepIndex];
        if (!step) return false;

        const fields = step.fields;
        const result = await form.trigger(fields as any, { shouldFocus: true });
        return result;
    };

    const fetchProducts = async () => {
        if (!merchant?.id) return;

        try {
            const response = await fetch(`/api/merchant/products?merchantId=${merchant.id}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const onUploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload-product-images', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const currentImages = form.getValues('productImages') || [];

            // Add new URLs to the form
            const updatedImages = [...currentImages, ...data.urls].slice(0, 5); // Max 5 images
            form.setValue('productImages', updatedImages, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

            // Update field array
            imagesFieldArray.replace(updatedImages.map((url) => url));

            form.trigger('productImages');
        } catch (error) {
            console.error('Error uploading images:', error);
            toast({
                title: 'Image upload failed',
                description: error instanceof Error ? error.message : 'Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmitProduct = async (values: ProductFormValues) => {
        if (!merchant?.id) return;

        setLoading(true);
        try {

            const productIdValue = values.productId?.trim() || generateId('CW');
            const productData = {
                productId: productIdValue,
                productName: values.productName.trim(),
                productCategory: values.productCategory.trim(),
                productDescription: values.productDescription.trim(),
                brand: values.brand?.trim() || undefined,
                productImages: sanitizeArray(values.productImages),
                productHighlights: sanitizeArray(values.productHighlights),
                originalPrice: parseNumberOrZero(values.originalPrice),
                discountedPrice: parseNumberOrUndefined(values.discountedPrice),
                offerApplicable: values.offerApplicable?.trim() || undefined,
                deliveryFee: parseNumberOrZero(values.deliveryFee),
                orderHandlingFee: parseNumberOrZero(values.orderHandlingFee),
                discountOfferedOnProduct: parseNumberOrZero(values.discountOfferedOnProduct),
                cashbackPoints: parseNumberOrZero(values.cashbackPoints),
                isWalletCompatible: values.isWalletCompatible,
                productVariants: values.productVariants.map((variant, index) => ({
                    variantId: variant.variantId?.trim() || generateId(`VAR${index + 1}`),
                    name: variant.name.trim(),
                    price: parseNumberOrZero(variant.price),
                    stock: parseNumberOrZero(variant.stock),
                })),
                instore: values.instore,
                isAvailableStock: values.isAvailableStock,
                availableStocks: values.isAvailableStock
                    ? parseNumberOrZero(values.availableStocks)
                    : 0,
                productHeight: parseNumberOrUndefined(values.productHeight),
                productWidth: parseNumberOrUndefined(values.productWidth),
                productWeight: parseNumberOrUndefined(values.productWeight),
                productPackageWeight: parseNumberOrUndefined(values.productPackageWeight),
                productPackageHeight: parseNumberOrUndefined(values.productPackageHeight),
                productPackageWidth: parseNumberOrUndefined(values.productPackageWidth),
                whatsInsideTheBox: sanitizeArray(values.whatsInsideTheBox),
                deliverableLocations: sanitizeArray(values.deliverableLocations),
                eta: values.eta?.trim() || undefined,
                isWarranty: values.isWarranty,
                warrantyDescription: values.isWarranty
                    ? values.warrantyDescription?.trim() || undefined
                    : undefined,
                isReplacement: values.isReplacement,
                replacementDays: values.isReplacement
                    ? parseNumberOrUndefined(values.replacementDays)
                    : undefined,
                cityWittyAssured: values.cityWittyAssured,
                isPriority: values.isPriority,
                sponsored: values.sponsored,
                bestsellerBadge: values.bestsellerBadge,
                additionalInfo: values.additionalInfo?.trim() || undefined,
                faq: values.faq
                    .map((item) => ({
                        question: item.question.trim(),
                        answer: item.answer.trim(),
                    }))
                    .filter((item) => item.question.length > 0 && item.answer.length > 0),
            };

            const response = await fetch('/api/merchant/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    merchantId: merchant.id,
                    productData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save product');
            }

            // Refresh products list
            await fetchProducts();
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
                title: 'Failed to save product',
                description: error instanceof Error ? error.message : 'Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [merchant?.id]);

    return {
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
    };
};