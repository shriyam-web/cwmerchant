import { z } from 'zod';

export const formSchema = z
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
      return !!(data.availableStocks || '').trim();
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
      return !!(data.warrantyDescription || '').trim();
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
      return !!(data.replacementDays || '').trim();
    },
    {
      path: ['replacementDays'],
      message: 'Mention replacement days when replacement is enabled',
    }
  );

export type ProductFormValues = z.infer<typeof formSchema>;

export type VariantRecord = {
  variantId: string;
  name: string;
  price: number;
  stock: number;
};

export type FAQRecord = {
  question: string;
  answer: string;
};

export type ProductRecord = {
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

export const createEmptyFormValues = (): ProductFormValues => ({
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

export const initialProducts: ProductRecord[] = [
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

export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export const parseNumberOrZero = (value: string) => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const parseNumberOrUndefined = (value: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const sanitizeArray = (values: string[]) =>
  values.map((item) => item.trim()).filter((item) => item.length > 0);

export const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

export const productRecordToFormValues = (product: ProductRecord): ProductFormValues => ({
  productId: product.productId,
  productName: product.productName,
  productCategory: product.productCategory,
  productDescription: product.productDescription,
  brand: product.brand || '',
  productImages: product.productImages,
  productHighlights: product.productHighlights,
  originalPrice: product.originalPrice.toString(),
  discountedPrice: product.discountedPrice?.toString() || '',
  offerApplicable: product.offerApplicable || '',
  deliveryFee: product.deliveryFee.toString(),
  orderHandlingFee: product.orderHandlingFee.toString(),
  discountOfferedOnProduct: product.discountOfferedOnProduct.toString(),
  cashbackPoints: product.cashbackPoints.toString(),
  isWalletCompatible: product.isWalletCompatible,
  productVariants: product.productVariants.map((variant) => ({
    variantId: variant.variantId,
    name: variant.name,
    price: variant.price.toString(),
    stock: variant.stock.toString(),
  })),
  instore: product.instore,
  isAvailableStock: product.isAvailableStock,
  availableStocks: product.availableStocks.toString(),
  productHeight: product.productHeight?.toString() || '',
  productWidth: product.productWidth?.toString() || '',
  productWeight: product.productWeight?.toString() || '',
  productPackageWeight: product.productPackageWeight?.toString() || '',
  productPackageHeight: product.productPackageHeight?.toString() || '',
  productPackageWidth: product.productPackageWidth?.toString() || '',
  whatsInsideTheBox: product.whatsInsideTheBox,
  deliverableLocations: product.deliverableLocations,
  eta: product.eta || '',
  isWarranty: product.isWarranty,
  warrantyDescription: product.warrantyDescription || '',
  isReplacement: product.isReplacement,
  replacementDays: product.replacementDays?.toString() || '',
  cityWittyAssured: product.cityWittyAssured,
  isPriority: product.isPriority,
  sponsored: product.sponsored,
  bestsellerBadge: product.bestsellerBadge,
  additionalInfo: product.additionalInfo || '',
  faq: product.faq,
});

export const steps = [
  {
    title: 'Basics',
    description: 'Share the core product information to get started.',
    color: 'from-blue-500 to-blue-400',
    fields: ['productId', 'productName', 'productCategory', 'productDescription', 'brand'] as const,
  },
  {
    title: 'Media & Highlights',
    description: 'Add images and highlight key selling points.',
    color: 'from-blue-400 to-blue-300',
    fields: ['productImages', 'productHighlights'] as const,
  },
  {
    title: 'Pricing & Variants',
    description: 'Configure pricing, offers, variants, and wallet options.',
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
    title: 'Inventory Availablility & Logistics',
    description: 'Update inventory, shipping, and packaging details.',
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
    title: 'Extra Information',
    description: 'Add FAQs or extra info.',
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
] as const;