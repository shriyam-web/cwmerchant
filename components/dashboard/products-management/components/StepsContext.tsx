import { createContext, useContext } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../types';

type FieldArrayName =
    | 'productImages'
    | 'productHighlights'
    | 'productVariants'
    | 'whatsInsideTheBox'
    | 'deliverableLocations'
    | 'faq';

type FieldArrayMap = Record<FieldArrayName, UseFieldArrayReturn<ProductFormValues, any, 'id'>>;

export type ProductsFormContextType = {
    form: UseFormReturn<ProductFormValues>;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    goToNextStep: () => Promise<boolean>;
    goToPreviousStep: () => void;
    goToStep: (index: number) => Promise<boolean>;
    validateStep: (stepIndex: number) => Promise<boolean>;
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
    uploadingImages: boolean;
    setUploadingImages: (uploading: boolean) => void;
    fieldArrays: FieldArrayMap;
    watchIsAvailableStock: boolean;
    watchIsWarranty: boolean;
    watchIsReplacement: boolean;
    onSubmit: (values: ProductFormValues) => Promise<void>;
    onUploadImages: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    loading: boolean;
};

export const ProductsFormContext = createContext<ProductsFormContextType | null>(null);

export const useProductsFormContext = () => {
    const context = useContext(ProductsFormContext);
    if (!context) {
        throw new Error('useProductsFormContext must be used within a ProductsFormContext provider');
    }
    return context;
};