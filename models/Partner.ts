import mongoose, { Schema, Document, model, models } from "mongoose";

// ---------------- Product Nested Schemas ----------------
const VariantSchema = new Schema(
  {
    variantId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { _id: false }
);

const ProductRatingSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    merchantReply: { type: String },
    isLike: { type: Boolean, default: false },
    certifiedBuyer: { type: Boolean, default: true },
  },
  { _id: false, timestamps: true }
);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    certifiedBuyer: { type: Boolean, required: true },
    isLike: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productImages: {
      type: [String],
      validate: [
        {
          validator: (arr: string[]) => arr.length >= 1 && arr.length <= 5,
          message: "Product must have between 1 and 5 images",
        },
      ],
    },
    productDescription: { type: String, required: true },
    productCategory: { type: String, required: true },
    brand: { type: String },

    productHighlights: [{ type: String }],
    productVariants: { type: [VariantSchema], required: true },

    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number },

    offerApplicable: { type: String, required: true },

    deliveryFee: { type: Number, default: 0 },
    orderHandlingFee: { type: Number, default: 0 }, // ⭐ Order Handling Fee per product
    discountOfferedOnProduct: { type: Number, default: 0 },
    productHeight: { type: Number },
    productWidth: { type: Number },
    productWeight: { type: Number },
    productPackageWeight: { type: Number },
    productPackageHeight: { type: Number },
    productPackageWidth: { type: Number },

    whatsInsideTheBox: { type: [String], required: true },
    isWarranty: { type: Boolean, required: true },
    warrantyDescription: { type: String },

    rating: [ProductRatingSchema],

    deliverableLocations: { type: [String], required: true },
    eta: { type: String, required: true },

    faq: [FAQSchema],

    instore: { type: Boolean, default: false },
    cityWittyAssured: { type: Boolean, default: false },
    isWalletCompatible: { type: Boolean, default: false },
    cashbackPoints: { type: Number, default: 0 },
    isPriority: { type: Boolean, default: false },
    sponsored: { type: Boolean, default: false },

    bestsellerBadge: { type: Boolean, default: false },

    additionalInfo: { type: String },

    isReplacement: { type: Boolean, default: false },
    replacementDays: { type: Number, default: 0 },

    // ⭐ NEW FIELDS
    isAvailableStock: { type: Boolean, default: true },
    availableStocks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ---------------- Partner Schema ----------------
export interface IPartner extends Document {
  merchantId: string;
  legalName: string;
  displayName: string;
  email: string;
  emailVerified?: boolean;
  phone: string;
  phoneVerified?: boolean;
  password: string;
  category: string;
  city: string;
  streetAddress: string;
  pincode?: string;
  locality?: string;
  state?: string;
  country?: string;
  whatsapp: string;
  isWhatsappSame: boolean;
  gstNumber: string;
  panNumber: string;
  businessType: string;
  yearsInBusiness: string;
  averageMonthlyRevenue: string;
  discountOffered: string;
  description: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  agreeToTerms: boolean;

  products: (typeof ProductSchema)[];
  logo?: string;
  storeImages?: string[];
  customOffer?: string;
  ribbonTag?: string;
  mapLocation?: string;
  visibility: boolean;
  joinedSince: Date;
  citywittyAssured: boolean;
  ratings: {
    userId: string;
    user: string;
    rating: number;
    review?: string;
    reply?: string;
    createdAt?: Date;
  }[];
  averageRating?: number;
  tags?: string[];
  status: "pending" | "active" | "suspended" | "inactive";

  purchasedPackage?: {
    variantName: string;
    purchaseDate: Date;
    expiryDate: Date;
    transactionId: string;
  };

  renewal?: {
    isRenewed: boolean;
    renewalDate?: Date;
    renewalExpiry?: Date;
  };

  onboardingAgent?: {
    agentId: string;
    agentName: string;
  };

  otpCode?: string;
  otpExpiry?: Date;

  paymentMethodAccepted?: string[];
  qrcodeLink?: string;
  businessHours?: {
    open?: string;
    close?: string;
    days?: string[];
  };

  bankDetails?: {
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branchName?: string;
    upiId?: string;
  };

  // ⭐ NEW FIELDS
  ListingLimit?: number;
  Addedlistings?: number;
  totalGraphics?: number;
  totalReels?: number;
  isWebsite?: boolean;

  // ✅ NEW FIELD (Merchant Total Earnings)
  totalEarnings?: number;

  ds_graphics?: {
    graphicId: string;
    requestDate: Date;
    completionDate?: Date;
    status: string;
    requestCategory: string;
    content: string;
    subject: string;
    isSchedules?: boolean;
  }[];

  ds_reel?: {
    reelId: string;
    requestDate: Date;
    completionDate?: Date;
    status: string;
    content: string;
    subject: string;
  }[];

  ds_weblog?: {
    weblog_id: string;
    status: string;
    completionDate?: Date;
    description: string;
  }[];

  // ⭐ Podcast fields
  totalPodcast?: number;
  completedPodcast?: number;
  podcastLog?: {
    title: string;
    status: string;
    scheduleDate: Date;
    completeDate?: Date;
  }[];
}

const PartnerSchema = new Schema<IPartner>(
  {
    merchantId: { type: String, required: true, unique: true },
    legalName: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    phone: { type: String, required: true },
    phoneVerified: { type: Boolean, default: false },
    password: { type: String, required: true, minlength: 6 },
    category: { type: String, required: true },
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    pincode: { type: String },
    locality: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    whatsapp: { type: String, required: true },
    isWhatsappSame: { type: Boolean, default: false },
    gstNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    businessType: { type: String, required: true },
    yearsInBusiness: { type: String, required: true },
    averageMonthlyRevenue: { type: String, required: true },
    discountOffered: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      youtube: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },
    businessHours: {
      open: { type: String },
      close: { type: String },
      days: { type: [String], default: [] },
    },
    agreeToTerms: { type: Boolean, required: true },

    products: [ProductSchema],
    logo: { type: String },
    storeImages: [{ type: String }],
    customOffer: { type: String },
    ribbonTag: { type: String },
    mapLocation: { type: String },
    visibility: { type: Boolean, default: false },
    joinedSince: { type: Date, default: Date.now },
    citywittyAssured: { type: Boolean, default: false },
    ratings: [
      {
        userId: { type: String },
        user: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        reply: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "inactive"],
      default: "pending",
    },

    purchasedPackage: {
      variantName: { type: String },
      purchaseDate: { type: Date },
      expiryDate: { type: Date },
      transactionId: { type: String },
    },

    renewal: {
      isRenewed: { type: Boolean, default: false },
      renewalDate: { type: Date },
      renewalExpiry: { type: Date },
    },

    onboardingAgent: {
      agentId: { type: String },
      agentName: { type: String },
    },

    otpCode: { type: String },
    otpExpiry: { type: Date },

    paymentMethodAccepted: { type: [String], default: [] },
    qrcodeLink: { type: String },


    bankDetails: {
      bankName: { type: String },
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      branchName: { type: String },
      upiId: { type: String },
    },

    // ⭐ NEW FIELDS
    ListingLimit: { type: Number, default: 0 },
    Addedlistings: { type: Number, default: 0 },
    totalGraphics: { type: Number, default: 0 },
    totalReels: { type: Number, default: 0 },
    isWebsite: { type: Boolean, default: false },

    // ✅ Total earnings of merchant
    totalEarnings: { type: Number, default: 0 },

    ds_graphics: [
      {
        graphicId: { type: String },
        requestDate: { type: Date },
        completionDate: { type: Date },
        status: {
          type: String,
          enum: ["completed", "pending"],
          default: "pending",
        },
        requestCategory: { type: String },
        content: { type: String },
        subject: { type: String },
        isSchedules: { type: Boolean, default: false },
      },
    ],

    ds_reel: [
      {
        reelId: { type: String },
        requestDate: { type: Date },
        completionDate: { type: Date },
        status: {
          type: String,
          enum: ["completed", "pending"],
          default: "pending",
        },
        content: { type: String },
        subject: { type: String },
      },
    ],

    ds_weblog: [
      {
        weblog_id: { type: String },
        status: {
          type: String,
          enum: ["completed", "pending"],
          default: "pending",
        },
        completionDate: { type: Date },
        description: { type: String },
      },
    ],

    // ⭐ Podcast fields
    totalPodcast: { type: Number, default: 0 },
    completedPodcast: { type: Number, default: 0 },
    podcastLog: [
      {
        title: { type: String },
        scheduleDate: { type: Date },
        completeDate: { type: Date },
        status: {
          type: String,
          enum: ["scheduled", "completed", "pending"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

// Auto-calc average rating
PartnerSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

export default models.Partner || model<IPartner>("Partner", PartnerSchema);