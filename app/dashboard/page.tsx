"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMerchantAuth } from "@/lib/auth-context";
import ProfileRemovedNotice from "@/components/ui/ProfileRemovedNotice";
import WelcomePendingModal from "@/components/ui/WelcomePendingModal";
import { NotificationReminderModal } from "@/components/ui/NotificationReminderModal";
import { EmailVerificationBanner } from "@/components/ui/EmailVerificationBanner";
import { MerchantPlanBanner } from "@/components/ui/MerchantPlanBanner";
import { AdminAccessBanner } from "@/components/ui/AdminAccessBanner";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { OffersManagement } from "@/components/dashboard/offers-management";
import { ProductsManagement } from "@/components/dashboard/products-management";
import { OfflineProductsManagement } from "@/components/dashboard/offline-products-management";
import { PurchaseRequests } from "@/components/dashboard/purchase-requests";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import DigitalSupport from "@/components/dashboard/digital-support";
import { SupportWidget } from "@/components/dashboard/support-widget";
import { Notifications } from "@/components/dashboard/notifications";
import { CouponsManagement } from "@/components/dashboard/coupons-management";
import { Toaster } from "@/components/ui/sonner";
import Joyride, { Step } from "react-joyride";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Eye,
  CheckCircle,
  Gift,
  Star,
  AlertTriangle,
  Menu,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";

interface Stat {
  icon: string;
  value: number | string;
  title: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface Request {
  id: string;
  customerName: string;
  submittedAt: string;
  amount: string | number;
  status: "approved" | "pending" | "rejected";
  product?: string;
  customerPhone?: string;
}

// Extended Merchant interface for dashboard with all profile fields
interface ExtendedMerchant {
  id: string;
  email: string;
  businessName: string;
  role: "merchant";
  status?: string;
  merchantId?: string;
  legalName?: string;
  displayName?: string;
  emailVerified?: boolean;
  phone?: string;
  category?: string;
  city?: string;
  streetAddress?: string;
  pincode?: string;
  locality?: string;
  state?: string;
  country?: string;
  whatsapp?: string;
  gstNumber?: string;
  panNumber?: string;
  businessType?: string;
  yearsInBusiness?: number;
  averageMonthlyRevenue?: number;
  description?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    x?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  businessHours?: {
    open?: string;
    close?: string;
    days?: string[];
  };
  agreeToTerms?: boolean;
  tags?: string[];
  purchasedPackage?: {
    variantName?: string;
    purchaseDate?: string;
    expiryDate?: string;
    transactionId?: string;
  };
  paymentMethodAccepted?: string[];
  minimumOrderValue?: number;
  bankDetails?: {
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branchName?: string;
    upiId?: string;
  };
  logo?: string;
  storeImages?: string[];
  mapLocation?: string;
  isAdmin?: boolean;
}

// Helper function to ensure isAdmin is always properly set
const ensureAdminFlag = (merchant: any): any => {
  if (!merchant) return merchant;
  const adminEmail = (
    process.env.NEXT_PUBLIC_REMOTE_ACCESS_ADMIN_EMAIL ||
    process.env.REMOTE_ACCESS_ADMIN_EMAIL ||
    ""
  ).toLowerCase();
  const merchantEmail = String(merchant.email || "").toLowerCase();
  const isAdmin = adminEmail
    ? merchantEmail === adminEmail || Boolean(merchant.isAdmin)
    : Boolean(merchant.isAdmin);
  return {
    ...merchant,
    isAdmin,
  };
};

export default function Dashboard() {
  const { merchant, setMerchant, loadingProfile, profileRemovedNotice, clearProfileRemovedNotice } = useMerchantAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState<Stat[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showAllMissingFields, setShowAllMissingFields] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const [tourSteps, setTourSteps] = useState<Step[]>([]);
  const [currentTourIndex, setCurrentTourIndex] = useState<number>(0);
  const [activeOffersCount, setActiveOffersCount] = useState<number>(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [notificationCountLoading, setNotificationCountLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Calculate pending requests count
  const pendingRequestsCount = useMemo(() => {
    return requests.filter(req => req.status === 'pending').length;
  }, [requests]);

  useEffect(() => {
    const checkMobileAndSidebar = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(window.innerWidth >= 1024 && !runTour);
    };

    checkMobileAndSidebar();
    window.addEventListener('resize', checkMobileAndSidebar);
    return () => window.removeEventListener('resize', checkMobileAndSidebar);
  }, [runTour]);

  useEffect(() => {
    if (runTour && isMobile) {
      setSidebarOpen(false);
    }
  }, [runTour, isMobile]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const currentTabParam = searchParams.get("tab");
    if (currentTabParam !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", activeTab);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [activeTab, isInitialized, router]);

  useEffect(() => {
    if (activeTab !== 'notifications' && merchant?.id) {
      fetchUnreadNotificationsCount();
    }
  }, [activeTab]);

  const profileFields: string[] = [
    "merchantId",
    "legalName",
    "displayName",
    "email",
    "emailVerified",
    "phone",
    "category",
    "city",
    "streetAddress",
    "pincode",
    "locality",
    "state",
    "country",
    "whatsapp",
    "gstNumber",
    "panNumber",
    "businessType",
    "yearsInBusiness",
    "averageMonthlyRevenue",
    "description",
    "website",
    "socialLinks.linkedin",
    "socialLinks.x",
    "socialLinks.youtube",
    "socialLinks.instagram",
    "socialLinks.facebook",
    "businessHours.open",
    "businessHours.close",
    "businessHours.days",
    "agreeToTerms",
    "tags",
    "paymentMethodAccepted",
    "minimumOrderValue",
    "bankDetails.bankName",
    "bankDetails.accountHolderName",
    "bankDetails.accountNumber",
    "bankDetails.ifscCode",
    "bankDetails.branchName",
    "bankDetails.upiId",
    "logo",
    "storeImages",
    "mapLocation",
  ];
  const humanReadableFields: Record<string, string> = {
    merchantId: "Merchant Id",
    legalName: "Legal Name",
    displayName: "Display Name",
    email: "Email Address",
    emailVerified: "Email Verified",
    phone: "Phone Number",
    category: "Category",
    city: "City",
    streetAddress: "Street Address",
    pincode: "Pincode",
    locality: "Locality",
    state: "State",
    country: "Country",
    whatsapp: "WhatsApp Number",
    gstNumber: "GST Number",
    panNumber: "PAN Number",
    businessType: "Business Type",
    yearsInBusiness: "Years in Business",
    averageMonthlyRevenue: "Average Monthly Revenue",
    description: "Business Description",
    website: "Website",
    "socialLinks.linkedin": "LinkedIn Profile",
    "socialLinks.x": "X Profile",
    "socialLinks.youtube": "YouTube Channel",
    "socialLinks.instagram": "Instagram Profile",
    "socialLinks.facebook": "Facebook Profile",
    "businessHours.open": "Business Hours Open",
    "businessHours.close": "Business Hours Close",
    "businessHours.days": "Business Days",
    agreeToTerms: "Agree to Terms",
    tags: "Tags",
    "purchasedPackage.variantName": "Purchased Package",
    paymentMethodAccepted: "Payment Methods Accepted",
    minimumOrderValue: "Minimum Order Value",
    "bankDetails.bankName": "Bank Name",
    "bankDetails.accountHolderName": "Account Holder Name",
    "bankDetails.accountNumber": "Account Number",
    "bankDetails.ifscCode": "IFSC Code",
    "bankDetails.branchName": "Branch Name",
    "bankDetails.upiId": "UPI ID",
    logo: "Logo",
    storeImages: "Store Images",
    mapLocation: "Map Location",
  };

  // Only booleans that are required
  const requiredBooleans = ["agreeToTerms", "emailVerified"];

  // Helper to get nested values safely
  const getNestedValue = (obj: any, path: string) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

  const missingFields: string[] = useMemo(() => {
    if (!merchant) return [];

    const extendedMerchant = merchant as ExtendedMerchant;

    // Custom check for storeImages count and logo presence
    const missing: string[] = [];

    for (const field of profileFields) {
      const value = getNestedValue(extendedMerchant, field);

      if (value === undefined || value === null) {
        missing.push(field);
        continue;
      }
      if (Array.isArray(value) && value.length === 0) {
        missing.push(field);
        continue;
      }
      if (typeof value === "string" && value.trim() === "") {
        missing.push(field);
        continue;
      }
      if (typeof value === "boolean" && requiredBooleans.includes(field) && value === false) {
        missing.push(field);
        continue;
      }
      if (typeof value === "number" && (isNaN(value) || (field === "minimumOrderValue" && value === 0))) {
        missing.push(field);
        continue;
      }
    }

    // Additional check for storeImages count (if storeImages is array and length is 0, already counted)
    // Check logo presence
    if (!extendedMerchant.logo || extendedMerchant.logo.trim() === "") {
      if (!missing.includes("logo")) missing.push("logo");
    }

    // Check mapLocation presence
    if (!extendedMerchant.mapLocation || extendedMerchant.mapLocation.trim() === "") {
      if (!missing.includes("mapLocation")) missing.push("mapLocation");
    }

    // Check bankDetails fields presence
    const bankFields = [
      "bankDetails.bankName",
      "bankDetails.accountHolderName",
      "bankDetails.accountNumber",
      "bankDetails.ifscCode",
      "bankDetails.branchName",
      "bankDetails.upiId",
    ];
    for (const bf of bankFields) {
      const val = getNestedValue(extendedMerchant, bf);
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
        if (!missing.includes(bf)) missing.push(bf);
      }
    }

    return missing;
  }, [merchant]);

  const profileCompletion = useMemo(() => {
    const total = profileFields.length;
    const missing = missingFields.length;
    return Math.round(((total - missing) / total) * 100);
  }, [missingFields]);

  // Icon mapping
  const iconMap: Record<string, JSX.Element> = {
    Gift: <Gift className="h-6 w-6 text-gray-500" />,
    Star: <Star className="h-6 w-6 text-yellow-500" />,
    Eye: <Eye className="h-6 w-6 text-green-500" />,
    DollarSign: <IndianRupee className="h-6 w-6 text-green-500" />,
    TrendingUp: <TrendingUp className="h-6 w-6 text-purple-500" />,
    AlertTriangle: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    Users: <Users className="h-6 w-6 text-gray-500" />,
    CheckCircle: <CheckCircle className="h-6 w-6 text-blue-500" />,
  };

  // Fetch active offers count
  const fetchActiveOffersCount = async () => {
    if (!merchant?.id) return;

    try {
      const response = await fetch(`/api/merchant/offers?merchantId=${merchant.id}`);
      const data = await response.json();

      if (data.success && data.offers) {
        // Count only active offers
        const activeCount = data.offers.filter((offer: any) => offer.status === 'Active').length;
        setActiveOffersCount(activeCount);
      }
    } catch (error) {
      console.error('Error fetching offers count:', error);
    }
  };

  // Fetch unread notifications count
  const fetchUnreadNotificationsCount = useCallback(async () => {
    if (!merchant?.id) return;

    try {
      setNotificationCountLoading(true);
      const response = await fetch(`/api/merchant/notifications?merchantId=${merchant.id}`);
      const data = await response.json();

      if (data.success) {
        console.log('[Dashboard] Notification count fetched:', data.unreadCount);
        setUnreadNotificationsCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications count:', error);
    } finally {
      setNotificationCountLoading(false);
    }
  }, [merchant?.id]);

  // Fetch notification count on mount and merchant change
  useEffect(() => {
    if (!merchant?.id) return;
    fetchUnreadNotificationsCount();
  }, [merchant?.id]);

  const handleUnreadCountChange = useCallback((count: number) => {
    setUnreadNotificationsCount(count);
  }, []);

  // Debug: Log merchant isAdmin flag
  useEffect(() => {
    console.log('🔍 MERCHANT STATE CHANGED:', {
      email: merchant?.email,
      isAdmin: merchant?.isAdmin,
      id: merchant?.id,
      status: merchant?.status,
      fullMerchant: merchant,
    });
  }, [merchant]);

  useEffect(() => {
    if (!merchant?.id) {
      setLoading(false); // set loading to false if no id
      return; // login ke baad hi aur id hai toh
    }

    // Show welcome modal on every login if status is pending
    if (merchant.status === "pending") {
      setShowWelcomeModal(true);
    }

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/merchant/dashboard?merchantId=${merchant.id}`);
        const data = await res.json();

        if (res.ok) {
          console.log('📊 Dashboard API response:', {
            merchantIsAdmin: data.merchant?.isAdmin,
            merchantEmail: data.merchant?.email,
          });

          // ✅ set stats & requests from API
          setStats(data.stats || []);
          setRequests(data.requests || []);

          // ✅ update merchant state with fresh data for calculation
          // Merge merchant data and ensure isAdmin is properly set
          const mergedMerchant = {
            ...merchant,
            ...data.merchant,
          };
          const updatedMerchant = ensureAdminFlag(mergedMerchant);
          console.log('✅ Updated merchant with isAdmin:', updatedMerchant.isAdmin);
          setMerchant?.(updatedMerchant);

        } else {
          console.error("Dashboard fetch failed:", data);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    fetchActiveOffersCount();
  }, [merchant?.id]);

  // Tour functions
  const startTour = () => {
    setActiveTab("overview");
    setCurrentTourIndex(0);
    setTourSteps(getFullTourSteps());
    setRunTour(true);
  };

  const getFullTourSteps = (): Step[] => {
    const steps: Step[] = [
      { target: "#tour-merchant-id", content: "🔐 Merchant ID - Your unique merchant ID is displayed here. Copy this ID for reference or when communicating with CityWitty support about your account.", placement: "auto" },

      { target: "#tour-welcome", content: "🎉 Welcome to your CityWitty Merchant Dashboard! This is your command center for managing your entire business online. Here you can see important stats, quick actions, and get a complete overview of your business performance at a glance.", placement: "auto" },
      { target: "#tour-performance", content: "📊 Store Performance Card - Track key metrics like total orders, views, pending requests, and your active plan status. These numbers update in real-time as you receive customer interactions and orders.", placement: "auto" },
      { target: "#tour-profile-completion", content: "⚡ Profile Completion Status - Complete your profile to unlock all features and increase your visibility. Each missing field reduces your shop's discoverability. The progress circle shows exactly how close you are to 100% completion.", placement: "auto" },
    ];

    if (merchant?.status === "active") {
      steps.push(
        { target: "#tour-preview-store", content: "👁️ Preview Your Store - Click the 'Preview' button to see how your store looks to customers on the CityWitty platform. This gives you insight into your storefront appearance and how customers interact with your listings.", placement: "auto" },
        { target: "#tour-purchase-requests", content: "📋 Recent Purchase Requests - View the latest customer purchase requests directly on your dashboard. You can quickly approve or decline requests, and track the status of all pending approvals to manage your sales pipeline efficiently.", placement: "auto" },
        { target: "#tour-performance-chart", content: "📈 Revenue Analytics - View detailed performance charts showing your monthly and daily revenue trends. This helps you identify seasonal patterns, peak sales periods, and plan your inventory and marketing strategies accordingly.", placement: "auto" }
      );
    }

    steps.push(
      { target: "#tour-profile-basic", content: "👤 Basic Information Tab - Start here! Add your business name, owner details, email, phone, WhatsApp number, and business description. This information appears on your store listing and helps customers identify your business.", placement: "auto" },
      { target: "#tour-profile-business", content: "🏢 Business Details Tab - Add legal documents (GST & PAN numbers), complete address including street, city, state, and pincode, plus your business map location. You can also link your website and social media profiles to build credibility.", placement: "auto" },
      { target: "#tour-profile-banking", content: "🏦 Banking Information Tab - Set up secure payment methods including bank account details (account number, IFSC, branch), account holder name, and UPI ID. This is how you'll receive payments from customers.", placement: "auto" },
      { target: "#tour-profile-hours", content: "🕐 Business Hours Tab - Set your opening and closing times. Let customers know which days you're open for business. This helps set expectations for order fulfillment and customer support availability.", placement: "auto" },
      { target: "#tour-profile-images", content: "📸 Store Images Tab - Upload up to 3 professional photos of your storefront or team. High-quality images help customers trust your business and increase purchase likelihood. Use clear, well-lit photos.", placement: "auto" },
      { target: "#tour-profile-additional", content: "🎯 Additional Information Tab - Complete your setup with tags (e.g., 'fast delivery', 'organic'), accepted payment methods, minimum order value, and agent information if applicable. This helps customers find you by preferences.", placement: "auto" },

      { target: "#tour-offers", content: "🎁 Offers Management - Create time-limited promotions and special deals to boost sales. You can set discount percentages, apply offers to specific products, and track offer performance. Special offers appear prominently in customer search results.", placement: "auto" },
      { target: "#tour-offers-manage", content: "✏️ Manage Offers - Edit active offers to adjust discounts, extend validity dates, or update descriptions. You can also archive completed offers and view performance metrics to understand which promotions drive the most sales.", placement: "auto" },

      { target: "#tour-products", content: "📦 Products Management - This is your product catalog. Add detailed product listings with images, descriptions, prices, and stock quantities. Well-optimized products get better visibility in customer searches.", placement: "auto" },
      { target: "#tour-products-manage", content: "✏️ Edit & Delete - Manage your product inventory by editing product details, updating prices and stock levels, or removing products that are no longer available. Keep your catalog fresh and accurate.", placement: "auto" },

      { target: "#tour-offline-products", content: "🏪 Offline Products - Manage physical products available only in your store location. Use this section to list in-store only items and let customers know what's available when they visit your physical location.", placement: "auto" },

      { target: "#tour-requests", content: "💬 Purchase Requests - Customers submit purchase requests for custom orders or product inquiries. Review each request carefully, check product availability, and approve or reject based on your inventory and terms.", placement: "auto" },

      { target: "#tour-coupons", content: "🎟️ Coupons Management - Create discount codes and vouchers to incentivize purchases. Coupons can be shared via social media, email, or direct links. Track usage and redemption rates to measure effectiveness and plan future promotions.", placement: "auto" },

      { target: "#tour-support", content: "💼 Digital Support Services - Access professional support services including graphic design, video creation, website development, social media management, and digital marketing to enhance your business.", placement: "auto" },

      { target: "#tour-notifications", content: "🔔 Notifications Center - Stay informed about everything happening in your business. Get real-time alerts for new orders, customer requests, payment updates, and important announcements from CityWitty.", placement: "auto" }
    );

    return steps;
  };

  const getTourSteps = (tab: string): Step[] => {
    switch (tab) {
      case "overview":
        return [
          {
            target: "#tour-welcome",
            content: "Welcome to your dashboard! This is the overview where you'll see your business performance and quick actions once approved.",
          },
          {
            target: "#tour-performance",
            content: "Here you'll track your store's performance with key metrics and analytics after approval.",
          },
          {
            target: "#tour-profile-completion",
            content: "Complete your profile to unlock all dashboard features and get approved.",
          },
        ];
      case "profile":
        return [
          {
            target: "#tour-profile-settings",
            content: "Fill in all your business details here. Complete information helps you get approved faster.",
          },
        ];
      case "offers":
        return [
          {
            target: "#tour-offers-main",
            content: "Once approved, you'll be able to create and manage special offers and promotions for your customers.",
          },
        ];
      case "products":
        return [
          {
            target: "#tour-products-main",
            content: "Once approved, you'll be able to add and manage your products and services here.",
          },
        ];
      case "offline-shopping":
        return [
          {
            target: "#tour-products-main",
            content: "Once approved, you'll be able to add and manage your in-store products here.",
          },
        ];
      case "requests":
        return [
          {
            target: "#tour-requests-main",
            content: "Once approved, you'll be able to review and approve customer purchase requests here.",
          },
        ];
      case "support":
        return [
          {
            target: "#tour-support-main",
            content: "Once approved, you'll be able to request digital marketing materials and support here.",
          },
        ];
      default:
        return [];
    }
  };


  if (loadingProfile || loading) return <div className="p-8">Loading...</div>;
  if (!merchant) return <div className="p-8">No merchant found.</div>;

  const renderMainContent = () => {
    const status = merchant?.status;

    const renderProfileCompletionCard = () => (
      <Card id="tour-profile-completion" className={`${missingFields.length > 0 ? "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 dark:from-orange-950/30 to-orange-100 dark:to-orange-900/30" : "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 dark:from-green-950/30 to-green-100 dark:to-green-900/30"} shadow-lg dark:shadow-gray-900/50`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              {missingFields.length > 0 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                  Complete Your Profile
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Profile Complete
                </>
              )}
            </CardTitle>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${profileCompletion}, 100`}
                  className={missingFields.length > 0 ? "text-orange-200 dark:text-orange-800" : "text-green-200 dark:text-green-800"}
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                  className={missingFields.length > 0 ? "text-orange-600 dark:text-orange-500" : "text-green-600 dark:text-green-400"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${missingFields.length > 0 ? "text-orange-700 dark:text-orange-400" : "text-green-700 dark:text-green-400"}`}>
                  {profileCompletion}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {missingFields.length > 0 ? (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Complete your profile to unlock full features and increase visibility.
                </p>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700 shadow-sm dark:shadow-gray-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Missing Information</span>
                      </div>
                      <Badge className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700">
                        {missingFields.length} fields
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(showAllMissingFields ? missingFields : missingFields.slice(0, 4)).map((field) => (
                        <Badge
                          key={field}
                          variant="outline"
                          className="text-xs border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                        >
                          {humanReadableFields[field] || field}
                        </Badge>
                      ))}
                      {missingFields.length > 4 && !showAllMissingFields && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setShowAllMissingFields(true)}
                        >
                          +{missingFields.length - 4} more
                        </Badge>
                      )}
                      {showAllMissingFields && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setShowAllMissingFields(false)}
                        >
                          Show less
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:border-orange-400 dark:hover:border-orange-600 font-semibold transition-all duration-200 allow-during-tour"
                  onClick={() => setActiveTab("profile")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </>
            ) : (
              <>
                <div className="text-center py-3">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">🎉 Profile Complete!</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your profile is fully complete! All features are unlocked and your visibility is maximized.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600 font-semibold transition-all duration-200 allow-during-tour"
                  onClick={() => setActiveTab("profile")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );

    if (status === "pending") {
      if (activeTab === "overview") {
        return (
          <div className="space-y-6">
            {/* Hero Welcome Section */}
            <Card id="tour-welcome" className="mb-8 bg-white dark:bg-gray-950 border-0 dark:border dark:border-gray-800 shadow-lg dark:shadow-gray-900/50 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Welcome back, {(merchant as ExtendedMerchant).displayName || merchant.businessName}!
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      <span>Your store is currently</span>
                      <Badge className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        pending
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      Complete your profile to unlock full features.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 w-full lg:w-auto lg:ml-auto">
                    <Button disabled className="bg-gray-400 dark:bg-gray-700 text-sm sm:text-base w-full sm:w-auto">
                      Add Product
                    </Button>
                    <Button disabled variant="outline" className="dark:border-gray-600 dark:text-gray-400 text-sm sm:text-base w-full sm:w-auto">
                      Create Offer
                    </Button>
                    <Button disabled variant="outline" className="dark:border-gray-600 dark:text-gray-400 text-sm sm:text-base w-full sm:w-auto">
                      View Requests
                    </Button>
                    <Button variant="outline" onClick={startTour} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 text-sm sm:text-base w-full sm:w-auto">
                      Start Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Status + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card id="tour-performance" className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 dark:border dark:border-gray-700 shadow-lg dark:shadow-gray-900/50">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-gray-100 dark:from-gray-900/40 to-gray-200 dark:to-gray-800/40 rounded-lg shadow-sm">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Store Performance</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Key metrics and insights</p>
                      </div>
                    </div>
                    <Badge
                      className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${String(status) === "active"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                        : String(status) === "suspended"
                          ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                          : String(status) === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        }`}
                    >
                      {status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  {loading ? (
                    <div className="text-center py-6">
                      <Activity className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loading performance data...</p>
                    </div>
                  ) : status === "pending" ? (
                    <div className="text-center py-6 sm:py-8 px-4">
                      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 dark:from-yellow-900/40 to-orange-100 dark:to-orange-900/40 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600 dark:text-yellow-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Awaiting Activation</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Your Store Performance will be live once your account is activated.
                      </p>
                    </div>
                  ) : stats.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-br from-gray-50 dark:from-gray-900/40 to-gray-100 dark:to-gray-800/40 rounded-lg">
                              {iconMap[stat.icon] || <Gift className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.changeType === "positive"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                              : stat.changeType === "negative"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                              }`}>
                              {stat.change}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.title}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Performance Data</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 max-w-md mx-auto px-4">
                        Performance metrics will appear here once you start receiving orders and interactions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Completion Card */}
              {renderProfileCompletionCard()}
            </div>
          </div>
        );



      } else if (activeTab === "profile") {
        const target = tourSteps[currentTourIndex]?.target;
        const tourTarget = typeof target === 'string' ? target : undefined;
        return <div id="tour-profile-settings"><ProfileSettings tourIndex={currentTourIndex} tourTarget={tourTarget} /></div>;
      } else {
        // Show actual features for educational purposes when status is pending
        switch (activeTab) {
          case "notifications":
            return <div id="tour-notifications"><Notifications onUnreadCountChange={handleUnreadCountChange} /></div>;
          case "offers":
            return <div id="tour-offers"><OffersManagement onOffersChange={fetchActiveOffersCount} /></div>;
          case "coupons":
            return <div id="tour-coupons"><CouponsManagement /></div>;
          case "products":
            return <div id="tour-products"><ProductsManagement /></div>;
          case "offline-shopping":
            return <div id="tour-offline-products"><OfflineProductsManagement /></div>;
          case "requests":
            return <div id="tour-requests"><PurchaseRequests /></div>;
          case "profile":
            {
              const target = tourSteps[currentTourIndex]?.target;
              return <div id="tour-profile-settings"><ProfileSettings tourIndex={currentTourIndex} tourTarget={typeof target === 'string' ? target : undefined} /></div>;
            }
          case "support":
            return <div id="tour-support"><DigitalSupport merchant={merchant} /></div>;
          default:
            return (
              <div id="tour-unavailable" className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-100 dark:from-yellow-900/40 to-orange-100 dark:to-orange-900/40 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Feature Unavailable</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  This feature will be available once your profile is approved. Please complete your profile and wait for administrator approval.
                </p>
              </div>
            );
        }
      }
    }

    switch (activeTab) {
      case "notifications":
        return <div id="tour-notifications"><Notifications onUnreadCountChange={handleUnreadCountChange} /></div>;
      case "offers":
        return <div id="tour-offers"><OffersManagement onOffersChange={fetchActiveOffersCount} /></div>;
      case "coupons":
        return <div id="tour-coupons"><CouponsManagement /></div>;
      case "products":
        return <div id="tour-products"><ProductsManagement /></div>;
      case "offline-shopping":
        return <div id="tour-offline-products"><OfflineProductsManagement /></div>;
      case "requests":
        return <div id="tour-requests"><PurchaseRequests /></div>;
      case "profile":
        return <div id="tour-profile-settings"><ProfileSettings tourIndex={currentTourIndex} /></div>;
      case "support":
        return <div id="tour-support"><DigitalSupport merchant={merchant} /></div>;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Welcome Section */}
            <Card id="tour-welcome" className="-mt-4 mb-8 bg-gradient-to-r from-gray-600 dark:from-gray-900 via-purple-600 dark:via-purple-900 to-gray-800 dark:to-gray-950 border-0 shadow-xl dark:shadow-gray-900/50 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {((merchant as ExtendedMerchant).displayName || merchant.businessName || "").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                          Welcome back, {(merchant as ExtendedMerchant).displayName || merchant.businessName}!
                        </h3>
                        <Badge
                          className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${status === "active"
                            ? "bg-green-500 dark:bg-green-600 text-white"
                            : status === "suspended"
                              ? "bg-red-500 dark:bg-red-600 text-white"
                              : "bg-yellow-500 dark:bg-yellow-600 text-white"
                            }`}
                        >
                          {status === "active" ? "Active" : status === "suspended" ? "Suspended" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-100 dark:text-gray-200 text-lg mb-4">Manage your business efficiently with quick actions below.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{requests.filter(r => r.status === "pending").length}</div>
                        <div className="text-xs text-gray-100 dark:text-gray-200">Pending Requests</div>
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{stats.length > 0 ? stats[0]?.value || 0 : 0}</div>
                        <div className="text-xs text-gray-100 dark:text-gray-200">Total Orders</div>
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{profileCompletion}%</div>
                        <div className="text-xs text-gray-100 dark:text-gray-200">Profile Complete</div>
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{((merchant as ExtendedMerchant).purchasedPackage?.variantName) ? "Yes" : "No"}</div>
                        <div className="text-xs text-gray-100 dark:text-gray-200">Plan Active</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full lg:w-auto">
                    <Button
                      onClick={() => setActiveTab("products")}
                      className="bg-white dark:bg-gray-100 text-gray-600 dark:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                      disabled={status !== "active"}
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      Add Product
                    </Button>
                    <Button
                      onClick={() => setActiveTab("offers")}
                      className="bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                      disabled={status !== "active"}
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Create Offer
                    </Button>
                    <Button
                      onClick={() => setActiveTab("requests")}
                      className="bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hidden sm:flex"
                      disabled={status !== "active"}
                    >
                      <Activity className="h-5 w-5 mr-2" />
                      View Requests
                    </Button>
                    <Button
                      onClick={startTour}
                      className="bg-white/90 dark:bg-gray-100 text-gray-700 dark:text-gray-900 hover:bg-white dark:hover:bg-gray-200 border-2 border-white dark:border-gray-100 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Take Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Status + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card id="tour-performance" className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 dark:border dark:border-gray-700 shadow-lg dark:shadow-gray-900/50">
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-900/40 rounded-lg">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Store Performance</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Track your business growth and key metrics</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <Badge
                        className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${status === "active"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                          : status === "suspended"
                            ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          }`}
                      >
                        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
                      </Badge>
                      <Button
                        id="tour-preview-store"
                        variant="outline"
                        size="sm"
                        className="border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/30 text-xs sm:text-sm w-full sm:w-auto"
                        onClick={() => merchant.merchantSlug && window.open(`https://www.citywitty.com/merchants/${merchant.merchantSlug}`, '_blank')}
                      // disabled={status === "pending"}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {stats.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      {stats.slice(0, 4).map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105 text-left"
                        >
                          <div className="flex flex-col justify-center mb-2 sm:mb-3 gap-1">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-gray-50 dark:from-gray-900/40 to-gray-100 dark:to-gray-800/40 rounded-lg flex-shrink-0 w-fit">
                              {iconMap[stat.icon] || <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium line-clamp-2 overflow-hidden break-words">{stat.title}</div>
                          </div>
                          {stat.change && (
                            <div className="mt-2 flex justify-start">
                              <div
                                className={`text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-full whitespace-nowrap ${stat.change.startsWith("+")
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                  }`}
                              >
                                {stat.change}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 px-4">
                      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 dark:from-gray-900/40 to-gray-100 dark:to-gray-900/40 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Ready to Track Performance</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
                        Start by adding your first product to see real-time analytics and performance metrics.
                      </p>
                      <Button onClick={() => setActiveTab("products")} className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm sm:text-base w-full sm:w-auto">
                        <Gift className="h-4 w-4 mr-2" /> Add Your First Product
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Completion / Missing Info */}
              <Card id="tour-profile-completion" className={`${missingFields.length > 0 ? "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 dark:from-orange-950/30 to-orange-100 dark:to-orange-900/30 shadow-lg dark:shadow-gray-900/50" : "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 dark:from-green-950/30 to-green-100 dark:to-green-900/30 shadow-lg dark:shadow-gray-900/50"}`}>
                <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg dark:text-gray-100">
                      {missingFields.length > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
                          Complete Your Profile
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                          Profile Complete
                        </>
                      )}
                    </CardTitle>
                    {missingFields.length > 0 && (
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${profileCompletion}, 100`}
                            className="text-orange-300 dark:text-orange-600"
                          />
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100, 100"
                            className="text-orange-500 dark:text-orange-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                            {profileCompletion}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    {missingFields.length > 0 ? (
                      <>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Complete your profile to unlock full features and increase visibility.
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700 shadow-sm dark:shadow-gray-900/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Missing Information</span>
                            </div>
                            <Badge className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700">
                              {missingFields.length} fields
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(showAllMissingFields ? missingFields : missingFields.slice(0, 5)).map((field) => (
                              <Badge
                                key={field}
                                variant="outline"
                                className="text-xs border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                              >
                                {humanReadableFields[field] || field}
                              </Badge>
                            ))}
                            {missingFields.length > 5 && !showAllMissingFields && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => setShowAllMissingFields(true)}
                              >
                                +{missingFields.length - 5} more
                              </Badge>
                            )}
                            {showAllMissingFields && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => setShowAllMissingFields(false)}
                              >
                                Show less
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:border-orange-400 dark:hover:border-orange-600 font-semibold transition-all duration-200 text-xs sm:text-sm"
                          onClick={() => setActiveTab("profile")}
                        >
                          Complete Profile
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center py-4">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 dark:from-green-900/40 to-emerald-100 dark:to-emerald-900/40 rounded-full flex items-center justify-center mb-3 shadow-lg dark:shadow-gray-900/30">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">🎉 Profile Complete!</h3>
                          <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                            Your profile is fully complete! All features are unlocked and your visibility is maximized.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600 font-semibold transition-all duration-200 text-sm"
                            onClick={() => setActiveTab("profile")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update Profile
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Purchase Requests */}
            <Card id="tour-purchase-requests" className="bg-white dark:bg-gray-950 border-0 dark:border dark:border-gray-800 shadow-lg dark:shadow-gray-900/50">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-100 dark:from-orange-900/40 to-red-100 dark:to-red-900/40 rounded-lg">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100">Recent Purchase Requests</CardTitle>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Manage customer purchase requests and approvals</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("requests")} className="border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 text-xs sm:text-sm w-full sm:w-auto">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {requests.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 dark:from-gray-700 to-gray-200 dark:to-gray-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Purchase Requests</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto">
                      When customers make purchase requests, they'll appear here for your review and approval.
                    </p>
                    <Button onClick={() => setActiveTab("products")} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base w-full sm:w-auto">
                      <Gift className="h-4 w-4 mr-2" /> Check Your Products
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {requests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-500 dark:from-gray-600 to-purple-600 dark:to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                            {request.customerName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{request.customerName}</h4>
                              <Badge
                                className={`px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${request.status === "approved"
                                  ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                                  : request.status === "pending"
                                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700"
                                    : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                                  }`}
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Menu className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span>{new Date(request.submittedAt).toLocaleString()}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {typeof request.amount === "number"
                                    ? request.amount.toLocaleString()
                                    : request.amount.replace(/^₹/, "")}
                                </span>
                              </span>
                            </div>
                          </div>
                          {request.status === "pending" && (
                            <div id="tour-purchase-requests-actions" className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white px-3 sm:px-4 py-1 text-xs font-medium rounded-md"
                                onClick={() => {
                                  // Handle approve action
                                  setRequests(prev => prev.map(r =>
                                    r.id === request.id ? { ...r, status: "approved" as const } : r
                                  ));
                                }}
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 sm:px-4 py-1 text-xs font-medium rounded-md"
                                onClick={() => {
                                  // Handle decline action
                                  setRequests(prev => prev.map(r =>
                                    r.id === request.id ? { ...r, status: "rejected" as const } : r
                                  ));
                                }}
                              >
                                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {requests.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => setActiveTab("requests")} className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base w-full sm:w-auto">
                          View {requests.length - 5} More Requests
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card id="tour-performance-chart" className="bg-white dark:bg-gray-950 border-0 dark:border dark:border-gray-800 shadow-lg dark:shadow-gray-900/50">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl dark:text-gray-100">Revenue Analytics</CardTitle>
                <CardDescription className="text-xs sm:text-sm dark:text-gray-400">Monthly and daily performance overview</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <PerformanceChart />
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Profile Removed Notice */}
      {profileRemovedNotice && (
        <ProfileRemovedNotice onClose={clearProfileRemovedNotice} />
      )}

      {/* Welcome Pending Modal */}
      <WelcomePendingModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          setActiveTab("overview");
          setCurrentTourIndex(0);
          setTourSteps([]);
          setRunTour(false);
        }}
      />

      <div className="flex flex-col lg:flex-row">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          merchantStatus={merchant.status}
          isTourRunning={runTour}
          activeOffersCount={activeOffersCount}
          pendingRequestsCount={pendingRequestsCount}
          unreadNotificationsCount={unreadNotificationsCount}
        />
        <div className="flex-1 lg:ml-64 flex flex-col">
          <DashboardNavbar
            merchantStatus={merchant.status}
            merchantSlug={merchant.merchantSlug}
            merchantId={merchant.merchantId}
            unreadNotificationsCount={unreadNotificationsCount}
            notificationCountLoading={notificationCountLoading}
            onNotificationClick={() => setActiveTab('notifications')}
            onProfileSettingsClick={() => setActiveTab('profile')}
            merchantName={(merchant as ExtendedMerchant).displayName || merchant.businessName}
            purchasedPackage={(merchant as ExtendedMerchant).purchasedPackage}
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 sm:pt-3 md:pt-4 pb-4 md:pb-8 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Menu Button */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-sm"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                {sidebarOpen ? "Collapse" : "Menu"}
              </Button>
            </div>

            {/* Email Verification Banner */}
            {merchant.emailVerified === false && (
              <EmailVerificationBanner
                merchantId={merchant.id}
                email={merchant.email}
                onVerified={() => {
                  // Refresh merchant data
                  if (setMerchant) {
                    setMerchant({ ...merchant, emailVerified: true });
                  }
                }}
              />
            )}

            {/* Merchant Plan Banner */}
            {!(merchant as ExtendedMerchant).purchasedPackage?.variantName && (
              <MerchantPlanBanner merchantId={merchant.id} />
            )}

            {/* Admin Access Banner */}
            {(() => {
              console.log('🎯 Checking Admin Banner. isAdmin:', merchant?.isAdmin, 'email:', merchant?.email);
              return merchant?.isAdmin && <AdminAccessBanner />;
            })()}

            {/* Pending Account Banner */}
            {merchant.status === "pending" && (
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-5 mb-6 shadow-sm dark:shadow-gray-900/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Incomplete Account Information</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Your account details are incomplete. Please fill in the missing information and submit for review.
                      The administrator will verify and approve your updates within 48 hours. You'll receive an email once your profile is approved and live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Title and Description based on active tab */}
            <div className="mb-6 md:mb-8">
              {/* <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "offers" && "Offers Management"}
              {activeTab === "products" && "Products Management"}
              {activeTab === "requests" && "Purchase Requests"}
              {activeTab === "profile" && "Profile Settings"}
              {activeTab === "support" && "Digital Support"}
            </h1> */}
              {/* <p className="text-base md:text-lg text-gray-700">
              {activeTab === "overview" &&
                "Welcome back! Here's what's happening with your business today."}
              {activeTab === "offers" &&
                "Create and manage your special offers and promotions."}
              {activeTab === "products" &&
                "Add and manage your products and services."}
              {activeTab === "requests" &&
                "Review and approve customer purchase requests."}
              {activeTab === "profile" &&
                "Manage your business profile and settings."}
              {activeTab === "support" &&
                "Request digital marketing materials and support."}
            </p> */}
            </div>

            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Support Widget */}
      <SupportWidget />

      {/* Toaster for notifications */}
      <Toaster />

      {/* Joyride Tour */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        stepIndex={currentTourIndex}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        hideCloseButton={true}
        disableOverlayClose={true}
        disableCloseOnEsc={true}
        scrollToFirstStep={true}
        spotlightClicks={false}
        disableScrolling={false}
        locale={{
          skip: "Close Tour",
          last: "Finish Tour",
          next: "Next",
          back: "Back"
        }}
        floaterProps={{
          disableAnimation: false,
          styles: {
            floater: {
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            },
          },
          options: {
            preventOverflow: {
              enabled: true,
              boundariesElement: 'viewport',
            },
            flip: {
              enabled: true,
              behavior: ['top', 'bottom', 'left', 'right'],
            },
            offset: {
              enabled: true,
              offset: '0, 10',
            },
          },
        }}
        callback={(data) => {
          const { index, status, type, action, lifecycle } = data;

          console.log('Tour callback:', { index, status, type, action, lifecycle });

          // Handle tour start - ensure we begin from overview
          if (type === "tour:start") {
            console.log('Tour starting, ensuring overview tab');
            setRunTour(false);
            setActiveTab("overview");
            setCurrentTourIndex(0);
            setTimeout(() => setRunTour(true), 600);
            return;
          }

          // Handle tour completion, skip, or close
          if (status === "finished" || status === "skipped" || action === "close" || action === "skip") {
            console.log('Tour ended:', status, action);
            setRunTour(false);
            setCurrentTourIndex(0);
            setTourSteps([]);
            setActiveTab("overview");
            if (isMobile) setSidebarOpen(false);
            return;
          }

          // Handle reaching the last step and clicking next/finish
          if (type === "step:after" && action === "next" && index >= tourSteps.length - 1) {
            console.log('Reached last step, ending tour');
            setTimeout(() => {
              setRunTour(false);
              setCurrentTourIndex(0);
              setTourSteps([]);
              setActiveTab("overview");
              if (isMobile) setSidebarOpen(false);
            }, 150);
            return;
          }

          // Handle navigation between steps
          if (type === "step:after" && (action === "next" || action === "prev")) {
            const targetIndex = action === "next" ? index + 1 : index - 1;

            // Check bounds
            if (targetIndex >= tourSteps.length || targetIndex < 0) {
              console.log('Tour navigation out of bounds, ending tour');
              setRunTour(false);
              setCurrentTourIndex(0);
              setTourSteps([]);
              setActiveTab("overview");
              return;
            }

            // Map tour target IDs to required tabs
            const targetMapping: Record<string, string> = {
              "#tour-merchant-id": "overview",
              "#tour-welcome": "overview",
              "#tour-performance": "overview",
              "#tour-preview-store": "overview",
              "#tour-profile-completion": "overview",
              "#tour-purchase-requests": "overview",
              "#tour-performance-chart": "overview",
              "#tour-profile-basic": "profile",
              "#tour-profile-business": "profile",
              "#tour-profile-banking": "profile",
              "#tour-profile-hours": "profile",
              "#tour-profile-images": "profile",
              "#tour-profile-additional": "profile",
              "#tour-offers": "offers",
              "#tour-offers-manage": "offers",
              "#tour-products": "products",
              "#tour-products-manage": "products",
              "#tour-offline-products": "offline-shopping",
              "#tour-requests": "requests",
              "#tour-coupons": "coupons",
              "#tour-support": "support",
              "#tour-notifications": "notifications",
            };

            const targetElement = tourSteps[targetIndex]?.target || "";
            const requiredTab = targetMapping[typeof targetElement === 'string' ? targetElement : ""] || "overview";
            const needsTabSwitch = requiredTab !== activeTab;

            console.log(`Moving to step ${targetIndex} (target: ${targetElement}, tab: ${requiredTab}, current: ${activeTab})`);

            // Batch updates: pause tour, update index
            setRunTour(false);
            setCurrentTourIndex(targetIndex);

            // Switch tab if needed
            if (needsTabSwitch) {
              console.log(`Switching tab from ${activeTab} to ${requiredTab}`);
              setActiveTab(requiredTab);
            }

            // Resume with longer timeout for tab switches, shorter for same tab
            // Special handling for profile tab which needs more time to render
            const resumeDelay = needsTabSwitch && requiredTab === 'profile' ? 1200 : needsTabSwitch ? 1000 : 300;
            setTimeout(() => {
              // Check if target element exists before resuming tour
              const targetElementExists = document.getElementById(typeof targetElement === 'string' ? targetElement : '');
              if (targetElementExists) {
                console.log(`Target element ${targetElement} found, resuming tour`);
                setRunTour(true);
              } else {
                console.warn(`Target element ${targetElement} not found, waiting longer...`);
                // Try again after additional delay
                setTimeout(() => {
                  const retryElement = document.getElementById(typeof targetElement === 'string' ? targetElement : '');
                  if (retryElement) {
                    console.log(`Target element ${targetElement} found on retry, resuming tour`);
                    setRunTour(true);
                  } else {
                    console.error(`Target element ${targetElement} still not found, skipping step`);
                    // Skip to next step or end tour
                    const nextIndex = targetIndex + 1;
                    if (nextIndex >= tourSteps.length) {
                      console.log('Reached end of tour due to missing element');
                      setRunTour(false);
                      setCurrentTourIndex(0);
                      setTourSteps([]);
                      setActiveTab("overview");
                    } else {
                      console.log(`Skipping to step ${nextIndex}`);
                      setCurrentTourIndex(nextIndex);
                      setTimeout(() => setRunTour(true), 300);
                    }
                  }
                }, 800);
              }
            }, resumeDelay);
          }
        }}
        styles={{
          options: {
            primaryColor: "#3b82f6",
            textColor: typeof window !== 'undefined' && (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark') ? "#e2e8f0" : "#1f2937",
            backgroundColor: typeof window !== 'undefined' && (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark') ? "#1e293b" : "#ffffff",
            overlayColor: typeof window !== 'undefined' && window.innerWidth < 640 ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.5)",
            zIndex: 10000,
            width: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 'calc(100vw - 20px)' :
                window.innerWidth < 640 ? '90vw' :
                  400
            ) : 400,
          },
          tooltip: {
            borderRadius: 8,
            padding: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 10 :
                window.innerWidth < 640 ? 12 : 20
            ) : 20,
            fontSize: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 13 :
                window.innerWidth < 640 ? 14 : 16
            ) : 16,
            maxWidth: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 'calc(100vw - 20px)' :
                window.innerWidth < 640 ? '90vw' : '400px'
            ) : '400px',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipContent: {
            padding: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? '6px 0' :
                window.innerWidth < 640 ? '8px 0' : '12px 0'
            ) : '12px 0',
          },
          buttonNext: {
            backgroundColor: '#3b82f6',
            fontSize: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 12 :
                window.innerWidth < 640 ? 13 : 14
            ) : 14,
            padding: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? '6px 10px' :
                window.innerWidth < 640 ? '8px 12px' : '10px 16px'
            ) : '10px 16px',
            borderRadius: 6,
          },
          buttonBack: {
            marginRight: 8,
            fontSize: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 12 :
                window.innerWidth < 640 ? 13 : 14
            ) : 14,
            padding: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? '6px 10px' :
                window.innerWidth < 640 ? '8px 12px' : '10px 16px'
            ) : '10px 16px',
            color: '#6b7280',
          },
          buttonSkip: {
            fontSize: typeof window !== 'undefined' ? (
              window.innerWidth < 360 ? 12 :
                window.innerWidth < 640 ? 13 : 14
            ) : 14,
            color: '#6b7280',
          },
          spotlight: {
            borderRadius: 4,
          },
        }}
      />

      {/* Block pointer events during tour with optimized CSS */}
      {runTour && (
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              transition: none !important;
            }
            
            #root,
            #__next {
              pointer-events: none !important;
            }
            .react-joyride__beacon,
            .react-joyride__spotlight,
            .react-joyride__tooltip,
            .react-joyride__tooltip *,
            .allow-during-tour {
              pointer-events: auto !important;
            }
            
            /* Prevent layout shift and flickering */
            .react-joyride__overlay {
              will-change: auto !important;
              contain: layout style paint !important;
            }
            
            .react-joyride__tooltip {
              max-width: 90vw !important;
              box-sizing: border-box !important;
              will-change: transform opacity !important;
              contain: layout style paint !important;
            }
            
            /* Extra small screens (< 360px) */
            @media (max-width: 359px) {
              .react-joyride__tooltip {
                max-width: calc(100vw - 20px) !important;
                margin: 8px !important;
                font-size: 13px !important;
              }
              
              .react-joyride__tooltip__button {
                font-size: 12px !important;
                padding: 6px 10px !important;
              }
            }
            
            /* Mobile responsive styles */
            @media (max-width: 640px) {
              .react-joyride__tooltip {
                max-width: 90vw !important;
                margin: 10px !important;
                font-size: 14px !important;
              }
              
              .react-joyride__tooltip__main {
                max-width: 100% !important;
              }
              
              .react-joyride__tooltip__footer {
                flex-wrap: wrap !important;
                gap: 8px !important;
              }
              
              .react-joyride__tooltip__button {
                font-size: 13px !important;
                padding: 8px 12px !important;
                white-space: nowrap !important;
              }
              
              .react-joyride__spotlight {
                border-radius: 4px !important;
              }
              
              .react-joyride__overlay {
                background-color: rgba(0, 0, 0, 0.6) !important;
              }
            }
            
            /* Tablet styles */
            @media (min-width: 641px) and (max-width: 1024px) {
              .react-joyride__tooltip {
                max-width: 400px !important;
              }
            }
            
            /* Ensure tooltip content is readable */
            .react-joyride__tooltip__content {
              line-height: 1.5 !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            /* Smooth animations */
            .react-joyride__tooltip {
              animation: tourTooltipFadeIn 0.25s ease-out !important;
            }
            
            @keyframes tourTooltipFadeIn {
              from {
                opacity: 0;
                transform: scale(0.98) translateY(-5px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `
        }} />
      )}
    </div>
  );
}
