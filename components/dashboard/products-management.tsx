'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

import {
  IndianRupee,
  Edit2,
  Package,
  Plus,
  Trash2,
  Check,
  ChevronsUpDown,
  Upload,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Truck,
  Shield,
  Gift,
  Wallet,
  Star,
  Box,
  MapPin,
  Clock,
  HelpCircle,
  Zap,
  TrendingUp,
  Award,
  Info
} from 'lucide-react';
import allCities from '@/data/allCities.json';

const formSchema = z
  .object({
    productId: z.string().optional().default(''),
    productName: z.string().min(1, 'Product name is required'),
    productCategory: z.string().min(1, 'Category is required'),
    productDescription: z
      .string()
      .min(10, 'Tell customers a bit more about the product')
      .max(2000, 'Description can have up to 2000 characters'),
    brand: z.string().optional().default(''),
    productImages: z
      .array(z.string().min(1, 'Image URL cannot be empty'))
      .min(1, 'Add at least one product image')
      .max(5, 'You can add up to 5 images'),
    productHighlights: z
      .array(z.string().min(1, 'Highlight cannot be empty'))
      .min(1, 'Add at least one highlight')
      .max(10, 'Keep highlights concise (max 10)'),
    originalPrice: z.string().min(1, 'MRP is required'),
    discountedPrice: z.string().optional().default(''),
    offerApplicable: z.string().optional().default(''),
    deliveryFee: z.string().optional().default(''),
    orderHandlingFee: z.string().optional().default(''),
    discountOfferedOnProduct: z.string().optional().default(''),
    cashbackPoints: z.string().optional().default(''),
    isWalletCompatible: z.boolean().default(false),
    productVariants: z
      .array(
        z.object({
          variantId: z.string().optional(),
          name: z.string().min(1, 'Variant name is required'),
          price: z.string().min(1, 'Variant price required'),
          stock: z.string().min(1, 'Variant stock required'),
        })
      )
      .default([]),
    instore: z.boolean().default(false),
    isAvailableStock: z.boolean().default(true),
    availableStocks: z.string().optional().default(''),
    productHeight: z.string().optional().default(''),
    productWidth: z.string().optional().default(''),
    productWeight: z.string().optional().default(''),
    productPackageWeight: z.string().optional().default(''),
    productPackageHeight: z.string().optional().default(''),
    productPackageWidth: z.string().optional().default(''),
    whatsInsideTheBox: z.array(z.string().min(1, 'Item cannot be empty')).default([]),
    deliverableLocations: z.array(z.string().min(1, 'Location cannot be empty')).default([]),
    eta: z.string().optional().default(''),
    isWarranty: z.boolean().default(false),
    warrantyDescription: z.string().optional().default(''),
    isReplacement: z.boolean().default(false),
    replacementDays: z.string().optional().default(''),
    cityWittyAssured: z.boolean().default(false),
    isPriority: z.boolean().default(false),
    sponsored: z.boolean().default(false),
    bestsellerBadge: z.boolean().default(false),
    additionalInfo: z.string().optional().default(''),
    faq: z
      .array(
        z.object({
          question: z.string().min(1, 'Question is required'),
          answer: z.string().min(1, 'Answer is required'),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (!data.isAvailableStock) {
        return true;
      }
      return !!data.availableStocks?.trim();
    },
    {
      path: ['availableStocks'],
      message: 'Available stock is required when the product is in stock',
    }
  )
  .refine(
    (data) => {
      if (!data.isWarranty) {
        return true;
      }
      return !!data.warrantyDescription?.trim();
    },
    {
      path: ['warrantyDescription'],
      message: 'Describe the warranty details',
    }
  )
  .refine(
    (data) => {
      if (!data.isReplacement) {
        return true;
      }
      return !!data.replacementDays?.trim();
    },
    {
      path: ['replacementDays'],
      message: 'Mention replacement days when replacement is enabled',
    }
  );

type ProductFormValues = z.infer<typeof formSchema>;

type VariantRecord = {
  variantId: string;
  name: string;
  price: number;
  stock: number;
};

type FAQRecord = {
  question: string;
  answer: string;
};

type ProductRecord = {
  productId: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  brand?: string;
  productImages: string[];
  productHighlights: string[];
  originalPrice: number;
  discountedPrice?: number;
  offerApplicable?: string;
  deliveryFee: number;
  orderHandlingFee: number;
  discountOfferedOnProduct: number;
  cashbackPoints: number;
  isWalletCompatible: boolean;
  productVariants: VariantRecord[];
  instore: boolean;
  isAvailableStock: boolean;
  availableStocks: number;
  productHeight?: number;
  productWidth?: number;
  productWeight?: number;
  productPackageWeight?: number;
  productPackageHeight?: number;
  productPackageWidth?: number;
  whatsInsideTheBox: string[];
  deliverableLocations: string[];
  eta?: string;
  isWarranty: boolean;
  warrantyDescription?: string;
  isReplacement: boolean;
  replacementDays?: number;
  cityWittyAssured: boolean;
  isPriority: boolean;
  sponsored: boolean;
  bestsellerBadge: boolean;
  additionalInfo?: string;
  faq: FAQRecord[];
};

const createEmptyFormValues = (): ProductFormValues => ({
  productId: '',
  productName: '',
  productCategory: '',
  productDescription: '',
  brand: '',
  productImages: [],
  productHighlights: [],
  originalPrice: '',
  discountedPrice: '',
  offerApplicable: '',
  deliveryFee: '',
  orderHandlingFee: '',
  discountOfferedOnProduct: '',
  cashbackPoints: '',
  isWalletCompatible: false,
  productVariants: [],
  instore: false,
  isAvailableStock: true,
  availableStocks: '',
  productHeight: '',
  productWidth: '',
  productWeight: '',
  productPackageWeight: '',
  productPackageHeight: '',
  productPackageWidth: '',
  whatsInsideTheBox: [],
  deliverableLocations: [],
  eta: '',
  isWarranty: false,
  warrantyDescription: '',
  isReplacement: false,
  replacementDays: '',
  cityWittyAssured: false,
  isPriority: false,
  sponsored: false,
  bestsellerBadge: false,
  additionalInfo: '',
  faq: [],
});

const initialProducts: ProductRecord[] = [
  {
    productId: 'CW-IPH15',
    productName: 'iPhone 15 Pro',
    productCategory: 'Smartphones',
    productDescription:
      'Experience the power of the A17 Pro chip with titanium build, 48 MP camera, and all-day battery life.',
    brand: 'Apple',
    productImages: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    productHighlights: ['A17 Pro chip', '48 MP Pro camera', 'Titanium design'],
    originalPrice: 139900,
    discountedPrice: 134900,
    offerApplicable: 'Festival Offer',
    deliveryFee: 0,
    orderHandlingFee: 0,
    discountOfferedOnProduct: 5000,
    cashbackPoints: 250,
    isWalletCompatible: true,
    productVariants: [
      {
        variantId: 'VAR-IPH15-128',
        name: '128 GB',
        price: 134900,
        stock: 15,
      },
    ],
    instore: true,
    isAvailableStock: true,
    availableStocks: 15,
    productHeight: 146.6,
    productWidth: 70.6,
    productWeight: 187,
    productPackageWeight: 420,
    productPackageHeight: 8,
    productPackageWidth: 18,
    whatsInsideTheBox: ['iPhone 15 Pro', 'USB-C Charge Cable'],
    deliverableLocations: ['Pan India'],
    eta: '2-4 business days',
    isWarranty: true,
    warrantyDescription: '1 year manufacturer warranty',
    isReplacement: true,
    replacementDays: 7,
    cityWittyAssured: true,
    isPriority: true,
    sponsored: false,
    bestsellerBadge: true,
    additionalInfo: 'Eligible for exchange and EMI options.',
    faq: [],
  },
  {
    productId: 'CW-GALW6',
    productName: 'Samsung Galaxy Watch 6',
    productCategory: 'Wearables',
    productDescription:
      'Stay connected and track your health with advanced monitoring features and a sleek circular design.',
    brand: 'Samsung',
    productImages: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    productHighlights: ['Sleep tracking', 'Stainless steel frame', 'Fast wireless charging'],
    originalPrice: 32999,
    discountedPrice: 28999,
    offerApplicable: 'CityWitty Exclusive',
    deliveryFee: 79,
    orderHandlingFee: 0,
    discountOfferedOnProduct: 4000,
    cashbackPoints: 120,
    isWalletCompatible: true,
    productVariants: [
      {
        variantId: 'VAR-GALW6-44',
        name: '44 mm Graphite',
        price: 28999,
        stock: 8,
      },
    ],
    instore: true,
    isAvailableStock: true,
    availableStocks: 8,
    productHeight: 42,
    productWidth: 42,
    productWeight: 59,
    productPackageWeight: 320,
    productPackageHeight: 7,
    productPackageWidth: 14,
    whatsInsideTheBox: ['Galaxy Watch 6', 'Wireless Charger', 'Straps (S & L)'],
    deliverableLocations: ['Mumbai', 'Pune', 'Delhi NCR'],
    eta: '3-5 business days',
    isWarranty: true,
    warrantyDescription: '1 year brand warranty',
    isReplacement: true,
    replacementDays: 7,
    cityWittyAssured: false,
    isPriority: false,
    sponsored: true,
    bestsellerBadge: false,
    additionalInfo: 'Supports Samsung Wallet NFC payments.',
    faq: [],
  },
  {
    productId: 'CW-MBA2',
    productName: 'MacBook Air M2',
    productCategory: 'Laptops',
    productDescription:
      'Ultra-thin notebook powered by Apple M2 with Liquid Retina display and up to 18 hours battery life.',
    brand: 'Apple',
    productImages: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    productHighlights: ['Apple M2 chip', 'MagSafe 3 charging', 'Up to 18-hour battery'],
    originalPrice: 119900,
    discountedPrice: 114900,
    offerApplicable: 'Student Offer',
    deliveryFee: 0,
    orderHandlingFee: 0,
    discountOfferedOnProduct: 5000,
    cashbackPoints: 320,
    isWalletCompatible: true,
    productVariants: [
      {
        variantId: 'VAR-MBA2-8GB',
        name: '8GB RAM | 256GB SSD',
        price: 114900,
        stock: 0,
      },
    ],
    instore: false,
    isAvailableStock: false,
    availableStocks: 0,
    productHeight: 1.13,
    productWidth: 30.41,
    productWeight: 1240,
    productPackageWeight: 1850,
    productPackageHeight: 5,
    productPackageWidth: 35,
    whatsInsideTheBox: ['MacBook Air', 'USB-C to MagSafe 3 Cable', '35W Dual USB-C Adapter'],
    deliverableLocations: ['Pan India'],
    eta: '5-7 business days',
    isWarranty: true,
    warrantyDescription: '1 year limited warranty',
    isReplacement: true,
    replacementDays: 7,
    cityWittyAssured: true,
    isPriority: false,
    sponsored: false,
    bestsellerBadge: false,
    additionalInfo: 'Eligible for AppleCare+ purchase within 30 days.',
    faq: [],
  },
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

const parseNumberOrZero = (value: string) => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseNumberOrUndefined = (value: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const sanitizeArray = (values: string[]) =>
  values.map((item) => item.trim()).filter((item) => item.length > 0);

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

const steps = [
  {
    title: 'Basics',
    description: 'Share the core product information to get started.',
    icon: Package,
    color: 'from-blue-500 to-blue-400',
    fields: ['productId', 'productName', 'productCategory', 'productDescription', 'brand'] as const,
  },
  {
    title: 'Media & Highlights',
    description: 'Add images and highlight key selling points.',
    icon: ImageIcon,
    color: 'from-blue-400 to-blue-300',
    fields: ['productImages', 'productHighlights'] as const,
  },
  {
    title: 'Pricing & Variants',
    description: 'Configure pricing, offers, variants, and wallet options.',
    icon: IndianRupee,
    color: 'from-blue-500 to-blue-400',
    fields: [
      'originalPrice',
      'discountedPrice',
      'discountOfferedOnProduct',
      'deliveryFee',
      'orderHandlingFee',
      'offerApplicable',
      'isWalletCompatible',
      'cashbackPoints',
      'productVariants',
    ] as const,
  },
  {
    title: 'Inventory & Logistics',
    description: 'Update inventory, shipping, and packaging details.',
    icon: Truck,
    color: 'from-blue-400 to-blue-300',
    fields: [
      'instore',
      'isAvailableStock',
      'availableStocks',
      'productHeight',
      'productWidth',
      'productWeight',
      'productPackageWeight',
      'productPackageHeight',
      'productPackageWidth',
      'whatsInsideTheBox',
      'deliverableLocations',
      'eta',
      'isWarranty',
      'warrantyDescription',
      'isReplacement',
      'replacementDays',
    ] as const,
  },
  {
    title: 'Badges & Extras',
    description: 'Select special badges and add FAQs or extra info.',
    icon: Award,
    color: 'from-blue-500 to-blue-400',
    fields: [
      'cityWittyAssured',
      'isPriority',
      'sponsored',
      'bestsellerBadge',
      'additionalInfo',
      'faq',
    ] as const,
  },
];

export function ProductsManagement() {
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => createEmptyFormValues(), []),
    mode: 'onChange',
  });

  const imagesFieldArray = useFieldArray({ control: form.control, name: 'productImages' as any });
  const highlightsFieldArray = useFieldArray({ control: form.control, name: 'productHighlights' as any });
  const variantsFieldArray = useFieldArray({ control: form.control, name: 'productVariants' });
  const boxItemsFieldArray = useFieldArray({ control: form.control, name: 'whatsInsideTheBox' as any });
  const locationsFieldArray = useFieldArray({ control: form.control, name: 'deliverableLocations' as any });
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

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.productId !== productId));
  };

  const handleSubmitProduct = (values: ProductFormValues) => {
    const productIdValue = values.productId?.trim() || generateId('CW');
    const formattedProduct: ProductRecord = {
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

    setProducts((prev) => [...prev, formattedProduct]);
    setIsAddDialogOpen(false);
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentImages = form.getValues('productImages') || [];
    if (currentImages.length + files.length > 5) {
      alert('You can only upload up to 5 images in total');
      return;
    }

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
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      const newImages = [...currentImages, ...data.urls];
      form.setValue('productImages', newImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploadingImages(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Product ID Card */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 p-5">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <div className="p-1.5 rounded-md bg-blue-500">
                        <Tag className="h-3.5 w-3.5 text-white" />
                      </div>
                      Product ID
                      <Badge variant="secondary" className="ml-auto text-xs">Auto-generated</Badge>
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Input
                          {...field}
                          placeholder="Will be assigned automatically"
                          disabled
                          className="bg-white/50 dark:bg-gray-900/50 border-blue-200 dark:border-blue-800 h-11 pl-4 pr-10"
                        />
                        <Info className="absolute right-3 top-3.5 h-4 w-4 text-blue-400" />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Unique identifier assigned upon product creation
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Name Card */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 p-5">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <div className="p-1.5 rounded-md bg-blue-500">
                        <Package className="h-3.5 w-3.5 text-white" />
                      </div>
                      Product Name
                      <Badge variant="destructive" className="ml-auto text-xs">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., iPhone 15 Pro Max, Samsung Galaxy Watch"
                        className="mt-2 border-l-4 border-l-blue-500 focus:border-l-blue-600 h-11 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Enter a clear, descriptive name that customers will see
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category & Brand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Card */}
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 p-5">
                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                        <div className="p-1.5 rounded-md bg-blue-500">
                          <Box className="h-3.5 w-3.5 text-white" />
                        </div>
                        Category
                        <Badge variant="destructive" className="ml-auto text-xs">Required</Badge>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Smartphones, Laptops"
                          className="mt-2 border-l-4 border-l-blue-500 focus:border-l-blue-600 h-11 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Product classification
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Brand Card */}
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 p-5">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                        <div className="p-1.5 rounded-md bg-blue-500">
                          <Award className="h-3.5 w-3.5 text-white" />
                        </div>
                        Brand
                        <Badge variant="outline" className="ml-auto text-xs">Optional</Badge>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Apple, Samsung, Sony"
                          className="mt-2 border-l-4 border-l-blue-500 focus:border-l-blue-600 h-11 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Manufacturer or brand name
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 p-5">
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <div className="p-1.5 rounded-md bg-blue-500">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      Product Description
                      <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                      <span className="ml-auto text-xs font-normal text-muted-foreground bg-white dark:bg-gray-900 px-2 py-0.5 rounded-full border">
                        {field.value?.length || 0}/2000
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        {...field}
                        placeholder="Describe your product in detail. Include key features, specifications, benefits, and what makes it special. Help customers understand why they should choose this product."
                        className="mt-2 border-l-4 border-l-blue-500 focus:border-l-blue-600 resize-none bg-white dark:bg-gray-950 leading-relaxed"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Write a compelling description (10-2000 characters) that highlights key features and benefits
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            {/* Product Images Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold text-blue-900 dark:text-blue-100">
                      Product Images *
                    </FormLabel>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {imagesFieldArray.fields.length} of 5 images
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                    disabled={uploadingImages || imagesFieldArray.fields.length >= 5}
                    className="bg-white dark:bg-gray-950 border-blue-300 hover:bg-blue-50 hover:border-blue-400 group"
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4 text-blue-600" /> Upload Images
                      </>
                    )}
                  </Button>
                  <input
                    id="image-upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImages || imagesFieldArray.fields.length >= 5}
                  />
                </div>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Upload between 1 to 5 images (max 5MB each). The first image becomes the cover photo.
              </p>
              <div className="space-y-3">
                {imagesFieldArray.fields.map((fieldItem, index) => (
                  <div key={fieldItem.id} className="flex gap-2 items-start group">
                    <FormField
                      control={form.control}
                      name={`productImages.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex gap-3 items-center bg-white dark:bg-gray-950 rounded-lg p-2 border-2 border-blue-200 dark:border-blue-800 group-hover:border-blue-400">
                              {field.value && (
                                <div className="relative">
                                  <img
                                    src={field.value}
                                    alt={`Product ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-blue-300 shadow-md"
                                  />
                                  {index === 0 && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-lg">
                                      Cover
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex-1">
                                <Input
                                  {...field}
                                  placeholder="Image URL"
                                  disabled
                                  className="border-l-4 border-l-purple-500 bg-gray-50 dark:bg-gray-900"
                                />
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 ml-1">
                                  Image {index + 1} {index === 0 && '(Cover Photo)'}
                                </p>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => imagesFieldArray.remove(index)}
                      disabled={imagesFieldArray.fields.length === 1}
                      className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950 mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

            {/* Product Highlights Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold text-blue-900 dark:text-blue-100">
                      Product Highlights *
                    </FormLabel>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {highlightsFieldArray.fields.length} of 10 highlights
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => highlightsFieldArray.append('' as any)}
                  disabled={highlightsFieldArray.fields.length >= 10}
                  className="bg-white dark:bg-gray-950 border-blue-300 hover:bg-blue-50 hover:border-blue-400 group"
                >
                  <Plus className="mr-2 h-4 w-4 text-blue-600" /> Add Highlight
                </Button>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Mention the standout features or benefits customers should know.
              </p>
              <div className="space-y-3">
                {highlightsFieldArray.fields.map((fieldItem, index) => (
                  <div key={fieldItem.id} className="flex gap-2 group">
                    <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-blue-400 text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <FormField
                      control={form.control}
                      name={`productHighlights.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="E.g. 120Hz AMOLED display"
                              className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950 focus:border-l-blue-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => highlightsFieldArray.remove(index)}
                      disabled={highlightsFieldArray.fields.length === 1}
                      className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            {/* Pricing Section */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Pricing Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-600" />
                        MRP *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="₹"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        Discounted Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="₹"
                          className="border-l-4 border-l-purple-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountOfferedOnProduct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-blue-600" />
                        Discount (₹)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="₹"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Fees Section */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Delivery & Fees</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        Delivery Fee (₹)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderHandlingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-blue-600" />
                        Handling Fee (₹)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Offer Section */}
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 border-2 border-amber-200 dark:border-amber-800">
              <FormField
                control={form.control}
                name="offerApplicable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-amber-600" />
                      Offer Details
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E.g. New Year Mega Sale"
                        className="border-l-4 border-l-amber-500 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Wallet & Cashback Section */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-6 border-2 border-blue-200 dark:border-blue-800 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Wallet & Rewards</h4>
                <Sparkles className="h-4 w-4 text-blue-500 ml-auto" />
              </div>

              <FormField
                control={form.control}
                name="isWalletCompatible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-300 dark:border-blue-700 p-4 bg-white dark:bg-gray-950 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-600" />
                        Wallet Compatible
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable cashback and wallet payments for this product.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cashbackPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      Cashback Points
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          inputMode="numeric"
                          placeholder="0"
                          className="border-l-4 border-l-pink-500 bg-white dark:bg-gray-950 pl-10"
                        />
                        <Zap className="absolute left-3 top-3 h-4 w-4 text-pink-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold">Product Variants</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    variantsFieldArray.append({
                      variantId: '',
                      name: '',
                      price: '',
                      stock: '',
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </div>
              {variantsFieldArray.fields.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No variants added yet. Add one if you sell multiple configurations.
                </p>
              )}
              <div className="space-y-4">
                {variantsFieldArray.fields.map((variantField, index) => (
                  <div key={variantField.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium">Variant {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => variantsFieldArray.remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`productVariants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="E.g. 128 GB | Blue" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`productVariants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price *</FormLabel>
                            <FormControl>
                              <Input {...field} inputMode="decimal" placeholder="₹" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`productVariants.${index}.stock`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock *</FormLabel>
                            <FormControl>
                              <Input {...field} inputMode="numeric" placeholder="0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            {/* Stock & Availability Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Box className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Stock & Availability</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Manage inventory and store presence</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="instore"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-300 dark:border-blue-700 p-4 bg-white dark:bg-gray-950 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Available In-Store
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Indicate if customers can purchase directly at your outlet.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailableStock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-400 dark:border-blue-600 p-4 bg-white dark:bg-gray-950 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        Product In Stock
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Disable this when the product is temporarily unavailable.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableStocks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-blue-600" />
                      Available Units {watchIsAvailableStock ? '*' : ''}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!watchIsAvailableStock}
                        inputMode="numeric"
                        placeholder="0"
                        className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Dimensions Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Product Dimensions</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Physical measurements of the product</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="productHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 rotate-90" />
                        Height (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Width (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-blue-600" />
                        Weight (g)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Package Dimensions Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Box className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Package Dimensions</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Shipping box measurements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="productPackageHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 rotate-90" />
                        Height (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productPackageWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Width (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productPackageWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-blue-600" />
                        Weight (g)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="decimal"
                          placeholder="0"
                          className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* What's Inside the Box Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold text-blue-900 dark:text-blue-100">
                      What's Inside the Box
                    </FormLabel>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {boxItemsFieldArray.fields.length} items listed
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => boxItemsFieldArray.append('')}
                  className="bg-white dark:bg-gray-950 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4 text-blue-600" /> Add Item
                </Button>
              </div>
              {boxItemsFieldArray.fields.length === 0 && (
                <p className="text-sm text-blue-700 dark:text-blue-300 italic flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  No items listed yet. Add what customers receive upon purchase.
                </p>
              )}
              <div className="space-y-3">
                {boxItemsFieldArray.fields.map((fieldItem, index) => (
                  <div key={fieldItem.id} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-blue-400 text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <FormField
                      control={form.control}
                      name={`whatsInsideTheBox.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="E.g. USB-C Cable"
                              className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-950"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => boxItemsFieldArray.remove(index)}
                      className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverable Locations Section */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold text-blue-900 dark:text-blue-100">
                      Deliverable Locations
                    </FormLabel>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {locationsFieldArray.fields.length} locations added
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => locationsFieldArray.append('' as any)}
                  className="bg-white dark:bg-gray-950 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4 text-blue-600" /> Add Location
                </Button>
              </div>
              {locationsFieldArray.fields.length === 0 && (
                <p className="text-sm text-blue-700 dark:text-blue-300 italic flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Mention cities or regions where delivery is available.
                </p>
              )}
              <div className="space-y-3">
                {locationsFieldArray.fields.map((fieldItem, index) => (
                  <div key={fieldItem.id} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-blue-400 text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <FormField
                      control={form.control}
                      name={`deliverableLocations.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'w-full justify-between border-l-4 border-l-blue-500 bg-white dark:bg-gray-950',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    {field.value || 'Select city...'}
                                  </div>
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search city..." />
                                  <CommandList>
                                    <CommandEmpty>No city found.</CommandEmpty>
                                    <CommandGroup>
                                      {allCities.map((city) => (
                                        <CommandItem
                                          key={city}
                                          value={city}
                                          onSelect={() => {
                                            form.setValue(`deliverableLocations.${index}`, city);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              field.value === city ? 'opacity-100' : 'opacity-0'
                                            )}
                                          />
                                          {city}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950"
                      onClick={() => locationsFieldArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormField
                control={form.control}
                name="eta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-600" />
                      Estimated Delivery Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E.g. 3-5 business days"
                        className="border-l-4 border-l-cyan-500 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Warranty & Replacement Section */}
            <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500 shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Warranty & Replacement
                  </h3>
                  <p className="text-sm text-muted-foreground">Protect your customers with guarantees</p>
                </div>
                <Shield className="h-5 w-5 text-blue-500" />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isWarranty"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-400">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <FormLabel className="text-base font-semibold">Warranty Available</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Provide warranty protection
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warrantyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Warranty Details {watchIsWarranty ? '*' : ''}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          disabled={!watchIsWarranty}
                          placeholder="E.g. 1 year on manufacturing defects"
                          className="border-l-4 border-l-blue-500 focus:border-l-blue-600 disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="h-px bg-blue-300 my-4" />

                <FormField
                  control={form.control}
                  name="isReplacement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-400">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <FormLabel className="text-base font-semibold">Replacement Available</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Offer product replacement
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="replacementDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Replacement Days {watchIsReplacement ? '*' : ''}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!watchIsReplacement}
                          inputMode="numeric"
                          placeholder="E.g. 7"
                          className="border-l-4 border-l-blue-500 focus:border-l-blue-600 disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            {/* Badges & Features Section */}
            <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500 shadow-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Badges & Features
                  </h3>
                  <p className="text-sm text-muted-foreground">Highlight your product with special badges</p>
                </div>
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cityWittyAssured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-400">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <FormLabel className="text-base font-semibold">CityWitty Assured</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Verified by CityWitty
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPriority"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-400">
                          <Star className="h-4 w-4 text-white fill-white" />
                        </div>
                        <div>
                          <FormLabel className="text-base font-semibold">Priority Product</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Show first in listings
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sponsored"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-400">
                          <Zap className="h-4 w-4 text-white fill-white" />
                        </div>
                        <div>
                          <FormLabel className="text-base font-semibold">Sponsored</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Promoted listing
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bestsellerBadge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                      <div className="space-y-0.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-400">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <FormLabel className="text-base font-semibold">Bestseller Badge</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Top selling product
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500 shadow-lg">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Additional Information
                  </h3>
                  <p className="text-sm text-muted-foreground">Extra details for customers</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Any extra details customers should know..."
                        className="border-l-4 border-l-blue-500 focus:border-l-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FAQs Section */}
            <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 shadow-lg">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      Frequently Asked Questions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {faqFieldArray.fields.length} FAQ{faqFieldArray.fields.length !== 1 ? 's' : ''} added
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    faqFieldArray.append({
                      question: '',
                      answer: '',
                    })
                  }
                  className="border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              {faqFieldArray.fields.length === 0 && (
                <div className="text-center py-8 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-900/50">
                  <HelpCircle className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No FAQs added yet. Add common questions and answers.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {faqFieldArray.fields.map((faqField, index) => (
                  <div key={faqField.id} className="space-y-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-5 bg-white/50 dark:bg-gray-900/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white shadow-md">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">FAQ {index + 1}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => faqFieldArray.remove(index)}
                        className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`faq.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-blue-500" />
                            Question *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="E.g. What is the return policy?"
                              className="border-l-4 border-l-blue-500 focus:border-l-blue-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faq.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            Answer *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Provide a clear answer..."
                              className="border-l-4 border-l-blue-500 focus:border-l-blue-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-8 shadow-2xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-700" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border border-white/30">
              <Package className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Products Management
                </h1>
                <Sparkles className="h-8 w-8 drop-shadow-lg animate-pulse" />
              </div>
              <p className="text-blue-100 text-lg flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold border border-white/30">
                  <Box className="h-4 w-4" />
                  {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Manage your product catalog, pricing, and inventory</span>
              </p>
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="relative bg-white hover:bg-blue-50 text-blue-600 shadow-2xl border-0 px-8 py-7 text-base font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus className="mr-2 h-6 w-6 relative z-10" />
                <span className="relative z-10">Add New Product</span>
                <Sparkles className="ml-2 h-5 w-5 relative z-10" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="border-b pb-4 mb-2">
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500 shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-blue-600">
                      Add New Product
                    </h2>
                    <p className="text-sm text-muted-foreground font-normal mt-0.5">
                      Fill in the details to add a product to your catalog
                    </p>
                  </div>
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitProduct)} className="space-y-6">
                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-200 dark:from-gray-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        "h-full bg-gradient-to-r relative",
                        steps[currentStep]?.color
                      )}
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    >
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 dark:text-gray-400">
                      {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    </div>
                  </div>

                  {/* Step Indicators */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-1">
                      {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                          <div key={index} className="flex items-center flex-1">
                            <button
                              type="button"
                              onClick={() => goToStep(index)}
                              title={step.title}
                              className={cn(
                                'relative flex h-14 w-14 items-center justify-center rounded-xl text-sm font-medium border-2',
                                index === currentStep
                                  ? `bg-gradient-to-br ${step.color} text-white shadow-xl border-transparent`
                                  : index < currentStep
                                    ? 'bg-blue-100 text-blue-600 dark:from-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700 shadow-md'
                                    : 'bg-muted text-muted-foreground border-gray-200 dark:border-gray-700'
                              )}
                            >
                              {index < currentStep ? (
                                <Check className="h-6 w-6 drop-shadow-sm" />
                              ) : (
                                <StepIcon className="h-6 w-6" />
                              )}
                              {/* Step number badge */}
                              <span className={cn(
                                "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm",
                                index === currentStep
                                  ? "bg-white text-primary"
                                  : index < currentStep
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                              )}>
                                {index + 1}
                              </span>
                            </button>
                            {index < steps.length - 1 && (
                              <div
                                className={cn(
                                  'mx-2 h-1.5 flex-1 rounded-full relative overflow-hidden',
                                  index < currentStep
                                    ? 'bg-blue-400 shadow-sm'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                )}
                              >
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step Title with Icon */}
                    <div className={cn(
                      "rounded-2xl p-6 bg-gradient-to-br relative overflow-hidden border-2 border-white/20",
                      steps[currentStep]?.color,
                      "text-white shadow-2xl"
                    )}>
                      {/* Decorative background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                      </div>

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                            {(() => {
                              const CurrentIcon = steps[currentStep]?.icon;
                              return <CurrentIcon className="h-6 w-6" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-bold tracking-tight">{steps[currentStep]?.title}</h3>
                              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                Step {currentStep + 1}/{steps.length}
                              </Badge>
                            </div>
                          </div>
                          <Sparkles className="h-6 w-6 drop-shadow-lg" />
                        </div>
                        <p className="text-white/95 text-sm leading-relaxed pl-14">
                          {steps[currentStep]?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="min-h-[400px]">{renderStep()}</div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0}
                      className="border-2 hover:border-primary/50 hover:bg-primary/5 px-6 h-11"
                    >
                      <ChevronsUpDown className="mr-2 h-4 w-4 rotate-90" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-1">
                        {steps.map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "h-1.5 rounded-full",
                              idx === currentStep ? "w-8 bg-blue-500" :
                                idx < currentStep ? "w-1.5 bg-blue-400" : "w-1.5 bg-gray-300 dark:bg-gray-600"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground ml-1">
                        {currentStep + 1}/{steps.length}
                      </span>
                    </div>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        className={cn(
                          "bg-gradient-to-r shadow-lg px-6 h-11",
                          steps[currentStep]?.color
                        )}
                      >
                        Next Step
                        <ChevronsUpDown className="ml-2 h-4 w-4 -rotate-90" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 shadow-lg px-8 h-11"
                      >
                        <Check className="mr-2 h-5 w-5" />
                        Add Product
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid Section */}
        {products.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center py-24 px-6 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900/50 dark:via-blue-900/10 dark:to-purple-900/10 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-8 shadow-xl">
                <Package className="h-20 w-20 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Products Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
                Start building your product catalog by adding your first product. Click the button above to get started!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Add products to showcase your inventory</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span>Manage pricing & stock</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                    <Box className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Products</p>
                    <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">In Stock</p>
                    <p className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.isAvailableStock).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500 shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Featured</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {products.filter(p => p.bestsellerBadge || p.cityWittyAssured).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Catalog Header */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Box className="h-5 w-5 text-white" />
                </div>
                Product Catalog
              </h3>
              <Badge variant="outline" className="text-base px-4 py-2 font-semibold">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.productId} className="group overflow-hidden border-2 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 rounded-2xl">
                  <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {product.productImages[0] && (
                      <img
                        src={product.productImages[0]}
                        alt={product.productName}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}

                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                      {product.bestsellerBadge && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm">
                          <Award className="h-3 w-3 mr-1" />
                          Bestseller
                        </Badge>
                      )}
                      {product.cityWittyAssured && (
                        <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg backdrop-blur-sm">
                          <Shield className="h-3 w-3 mr-1" />
                          Assured
                        </Badge>
                      )}
                      {product.isPriority && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg backdrop-blur-sm">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Priority
                        </Badge>
                      )}
                      {product.sponsored && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg backdrop-blur-sm">
                          <Zap className="h-3 w-3 mr-1 fill-white" />
                          Sponsored
                        </Badge>
                      )}
                    </div>

                    {!product.isAvailableStock && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <Badge className="bg-red-500 text-white text-lg px-6 py-3 shadow-2xl">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors text-lg">
                          {product.productName}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                            <Box className="h-3 w-3 text-blue-600" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">{product.productCategory}</p>
                        </div>
                        {product.brand && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 w-fit">
                            <Tag className="h-3 w-3" />
                            {product.brand}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.productId)}
                        className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 transition-all shrink-0 rounded-xl hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Price Section */}
                    <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-900/30 border-2 border-green-200 dark:border-green-800 shadow-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/20 rounded-full blur-2xl" />
                      <div className="relative flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                          <IndianRupee className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {currencyFormatter.format(product.discountedPrice || product.originalPrice)}
                            </span>
                            {product.discountedPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {currencyFormatter.format(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.discountedPrice && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md mt-1">
                              {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Section */}
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 shadow-sm",
                      product.isAvailableStock
                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700"
                    )}>
                      <div className={cn(
                        "p-2 rounded-lg shadow-md",
                        product.isAvailableStock
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      )}>
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold">
                        {product.isAvailableStock
                          ? `${product.availableStocks} units in stock`
                          : 'Currently unavailable'}
                      </span>
                    </div>

                    {/* Features Section */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {product.instore && (
                        <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400 shadow-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          In-Store
                        </Badge>
                      )}
                      {product.isWalletCompatible && (
                        <Badge variant="outline" className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400 shadow-sm">
                          <Wallet className="h-3 w-3 mr-1" />
                          Wallet
                        </Badge>
                      )}
                      {product.isWarranty && (
                        <Badge variant="outline" className="border-green-300 text-green-600 dark:border-green-700 dark:text-green-400 shadow-sm">
                          <Shield className="h-3 w-3 mr-1" />
                          Warranty
                        </Badge>
                      )}
                      {product.deliveryFee === 0 && (
                        <Badge variant="outline" className="border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400 shadow-sm">
                          <Truck className="h-3 w-3 mr-1" />
                          Free Delivery
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}