"use client";

import { useState, useEffect, useMemo } from "react";
import { useMerchantAuth } from "@/lib/auth-context";
import ProfileRemovedNotice from "@/components/ui/ProfileRemovedNotice";
import WelcomePendingModal from "@/components/ui/WelcomePendingModal";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { OffersManagement } from "@/components/dashboard/offers-management";
import { ProductsManagement } from "@/components/dashboard/products-management";
import { PurchaseRequests } from "@/components/dashboard/purchase-requests";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import DigitalSupport from "@/components/dashboard/digital-support";
import { SupportWidget } from "@/components/dashboard/support-widget";
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
  customer: string;
  time: string;
  amount: string | number;
  status: "approved" | "pending" | "rejected";
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
}

export default function Dashboard() {
  const { merchant, setMerchant, loadingProfile, profileRemovedNotice, clearProfileRemovedNotice } = useMerchantAuth();

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

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 1024);
  }, []);

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
    Gift: <Gift className="h-6 w-6 text-blue-500" />,
    Star: <Star className="h-6 w-6 text-yellow-500" />,
    Eye: <Eye className="h-6 w-6 text-green-500" />,
    DollarSign: <IndianRupee className="h-6 w-6 text-green-500" />,
    TrendingUp: <TrendingUp className="h-6 w-6 text-purple-500" />,
    AlertTriangle: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    Users: <Users className="h-6 w-6 text-indigo-500" />,
    CheckCircle: <CheckCircle className="h-6 w-6 text-teal-500" />,
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
          // ✅ set stats & requests from API
          setStats(data.stats || []);
          setRequests(data.requests || []);

          // ✅ update merchant state with fresh data for calculation
          setMerchant?.(data.merchant);

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
  }, [merchant?.id]); // only refetch if merchant id changes

  // Tour functions
  const startTour = () => {
    setActiveTab("overview");
    setCurrentTourIndex(0);
    setTourSteps(getFullTourSteps());
    setRunTour(true);
  };

  const getFullTourSteps = (): Step[] => [
    { target: "#tour-welcome", content: "Welcome to your dashboard! This is the overview where you'll see your business performance and quick actions.", placement: "auto" },
    { target: "#tour-performance", content: "Here you'll track your store's performance with key metrics and analytics.", placement: "auto" },
    { target: "#tour-profile-completion", content: "Complete your profile to unlock all dashboard features.", placement: "auto" },
    { target: "#tour-profile-basic", content: "Start with basic information - your name, contact details, and business category. This is essential for customer discovery.", placement: "auto" },
    { target: "#tour-profile-business", content: "Add your business details including description, website, and social media links to build credibility.", placement: "auto" },
    { target: "#tour-profile-banking", content: "Set up your banking information for secure payments and settlements.", placement: "auto" },
    { target: "#tour-profile-hours", content: "Configure your business hours so customers know when you're open.", placement: "auto" },
    { target: "#tour-profile-images", content: "Upload photos of your store to showcase your business to customers.", placement: "auto" },
    { target: "#tour-profile-additional", content: "Complete additional details like payment methods and minimum order values.", placement: "auto" },
    { target: "#tour-offers-main", content: "Create and manage special offers and promotions to attract more customers.", placement: "auto" },
    { target: "#tour-offers-add", content: "Click here to create new promotional offers and discounts for your products.", placement: "auto" },
    { target: "#tour-products-main", content: "Add and manage your product catalog. Keep your inventory up to date.", placement: "auto" },
    { target: "#tour-products-add", content: "Click here to add new products to your catalog with details, pricing, and images.", placement: "auto" },
    { target: "#tour-requests-main", content: "Review and approve customer purchase requests. Manage your sales pipeline.", placement: "auto" },
    { target: "#tour-requests-filters", content: "Use filters to quickly find pending, approved, or rejected requests.", placement: "auto" },
    { target: "#tour-support-plan", content: "Check your current plan and available digital support services.", placement: "auto" },
    { target: "#tour-support-services", content: "Explore available digital services like graphics design, video reels, and website development.", placement: "auto" },
    { target: "#tour-support-history", content: "Track all your digital support requests and their completion status.", placement: "auto" },
    // Temporarily skip support-wide tour step because that section loads on a different tab
    // { target: "#tour-support-main", content: "Access your dedicated support tools and resources whenever you need assistance.", placement: "auto" },
  ];

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
      case "offline-products":
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
      <Card id="tour-profile-completion" className={`${missingFields.length > 0 ? "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100" : "border-green-200 bg-gradient-to-br from-green-50 to-green-100"} shadow-lg`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {missingFields.length > 0 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Complete Your Profile
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
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
                  className={missingFields.length > 0 ? "text-orange-200" : "text-green-200"}
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                  className={missingFields.length > 0 ? "text-orange-600" : "text-green-600"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${missingFields.length > 0 ? "text-orange-700" : "text-green-700"}`}>
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
                <p className="text-sm text-gray-700 mb-3">
                  Complete your profile to unlock full features and increase visibility.
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">Missing Information</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border border-orange-200">
                        {missingFields.length} fields
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(showAllMissingFields ? missingFields : missingFields.slice(0, 4)).map((field) => (
                        <Badge
                          key={field}
                          variant="outline"
                          className="text-xs border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                          {humanReadableFields[field] || field}
                        </Badge>
                      ))}
                      {missingFields.length > 4 && !showAllMissingFields && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setShowAllMissingFields(true)}
                        >
                          +{missingFields.length - 4} more
                        </Badge>
                      )}
                      {showAllMissingFields && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
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
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 font-semibold transition-all duration-200 allow-during-tour"
                  onClick={() => setActiveTab("profile")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </>
            ) : (
              <>
                <div className="text-center py-3">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Profile Complete!</h3>
                  <p className="text-sm text-green-700">
                    Your profile is fully complete! All features are unlocked and your visibility is maximized.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 font-semibold transition-all duration-200 allow-during-tour"
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
            <Card id="tour-welcome" className="mb-8 bg-white border-0 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Welcome back, {(merchant as ExtendedMerchant).displayName || merchant.businessName}!
                    </h3>
                    <div className="text-sm sm:text-base text-gray-600 mb-4">
                      Your store is currently{" "}
                      <Badge className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        pending
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500">Complete your profile to unlock full features.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto lg:ml-auto">
                    <Button disabled className="bg-gray-400 text-sm sm:text-base w-full sm:w-auto">
                      Add Product
                    </Button>
                    <Button disabled variant="outline" className="text-sm sm:text-base w-full sm:w-auto">
                      Create Offer
                    </Button>
                    <Button disabled variant="outline" className="text-sm sm:text-base w-full sm:w-auto hidden sm:flex">
                      View Requests
                    </Button>
                    <Button variant="outline" onClick={startTour} className="text-sm sm:text-base w-full sm:w-auto">
                      Take  Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Package Card */}
            {!((merchant as ExtendedMerchant).purchasedPackage?.variantName) && (
              <Card className="border-red-500 bg-red-50 mb-6">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800">No Active Merchant Plan</h3>
                      <p className="text-xs sm:text-sm text-red-700 mt-1">
                        You don't have any active merchant plan, purchase now to take your business to heights.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 border-red-300 text-red-700 hover:bg-red-100 w-full sm:w-auto text-xs sm:text-sm">
                        Purchase Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Store Status + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card id="tour-performance" className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Store Performance</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Key metrics and insights</p>
                      </div>
                    </div>
                    <Badge
                      className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${String(status) === "active"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : String(status) === "suspended"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : String(status) === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                    >
                      {status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  {loading ? (
                    <div className="text-center py-6">
                      <Activity className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Loading performance data...</p>
                    </div>
                  ) : status === "pending" ? (
                    <div className="text-center py-6 sm:py-8">
                      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Awaiting Activation</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 max-w-md mx-auto px-4">
                        Your Store Performance will be live once your account is activated.
                      </p>
                    </div>
                  ) : stats.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                              {iconMap[stat.icon] || <Gift className="h-5 w-5 text-blue-600" />}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.changeType === "positive"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : stat.changeType === "negative"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}>
                              {stat.change}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                          <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
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
        return <div id="tour-profile-settings"><ProfileSettings tourIndex={currentTourIndex} /></div>;
      } else {
        // Show actual features for educational purposes when status is pending
        switch (activeTab) {
          case "offers":
            return <div id="tour-offers"><OffersManagement onOffersChange={fetchActiveOffersCount} /></div>;
          case "products":
            return <div id="tour-products"><ProductsManagement /></div>;
          case "offline-products":
            return <div id="tour-offline-products"><ProductsManagement /></div>;
          case "requests":
            return <div id="tour-requests"><PurchaseRequests /></div>;
          case "support":
            return <div id="tour-support"><DigitalSupport merchant={merchant} /></div>;
          default:
            return (
              <div id="tour-unavailable" className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature Unavailable</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  This feature will be available once your profile is approved. Please complete your profile and wait for administrator approval.
                </p>
              </div>
            );
        }
      }
    }

    switch (activeTab) {
      case "offers":
        return <OffersManagement onOffersChange={fetchActiveOffersCount} />;
      case "products":
        return <ProductsManagement />;
      case "offline-products":
        return <ProductsManagement />;
      case "requests":
        return <PurchaseRequests />;
      case "profile":
        return <ProfileSettings tourIndex={currentTourIndex} />;
      case "support":
        return <DigitalSupport merchant={merchant} />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Welcome Section */}
            <Card id="tour-welcome" className="-mt-4 mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 border-0 shadow-xl text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
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
                            ? "bg-green-500 text-white"
                            : status === "suspended"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                            }`}
                        >
                          {status === "active" ? "Active" : status === "suspended" ? "Suspended" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-blue-100 text-lg mb-4">Manage your business efficiently with quick actions below.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{requests.filter(r => r.status === "pending").length}</div>
                        <div className="text-xs text-blue-100">Pending Requests</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{stats.length > 0 ? stats[0]?.value || 0 : 0}</div>
                        <div className="text-xs text-blue-100">Total Orders</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{profileCompletion}%</div>
                        <div className="text-xs text-blue-100">Profile Complete</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{((merchant as ExtendedMerchant).purchasedPackage?.variantName) ? "Yes" : "No"}</div>
                        <div className="text-xs text-blue-100">Plan Active</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full lg:w-auto">
                    <Button
                      onClick={() => setActiveTab("products")}
                      className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                      disabled={status !== "active"}
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      Add Product
                    </Button>
                    <Button
                      onClick={() => setActiveTab("offers")}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                      disabled={status !== "active"}
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Create Offer
                    </Button>
                    <Button
                      onClick={() => setActiveTab("requests")}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hidden sm:flex"
                      disabled={status !== "active"}
                    >
                      <Activity className="h-5 w-5 mr-2" />
                      View Requests
                    </Button>
                    <Button
                      onClick={startTour}
                      className="bg-white/90 text-blue-700 hover:bg-white border-2 border-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Take Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Package Card */}
            {!((merchant as ExtendedMerchant).purchasedPackage?.variantName) && (
              <Card className="border-red-500 bg-red-50 mb-6">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800">No Active Merchant Plan</h3>
                      <p className="text-xs sm:text-sm text-red-700 mt-1">
                        You don't have any active merchant plan, purchase now to take your business to heights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Store Status + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card id="tour-performance" className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Store Performance</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Track your business growth and key metrics</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <Badge
                        className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${status === "active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : status === "suspended"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                      >
                        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm w-full sm:w-auto"
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      {stats.slice(0, 4).map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105 text-left"
                        >
                          <div className="flex flex-col justify-center mb-2 sm:mb-3 gap-1">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0 w-fit">
                              {iconMap[stat.icon] || <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-600 font-medium line-clamp-2 overflow-hidden break-words">{stat.title}</div>
                          </div>
                          {stat.change && (
                            <div className="mt-2 flex justify-start">
                              <div
                                className={`text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-full whitespace-nowrap ${stat.change.startsWith("+")
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
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
                      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready to Track Performance</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                        Start by adding your first product to see real-time analytics and performance metrics.
                      </p>
                      <Button onClick={() => setActiveTab("products")} className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto">
                        <Gift className="h-4 w-4 mr-2" /> Add Your First Product
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Completion / Missing Info */}
              <Card id="tour-profile-completion" className={`${missingFields.length > 0 ? "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg" : "border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg"}`}>
                <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      {missingFields.length > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                          Complete Your Profile
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
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
                            className="text-orange-200"
                          />
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100, 100"
                            className="text-orange-600"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-700">
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
                        <p className="text-sm sm:text-base text-gray-700 mb-3">
                          Complete your profile to unlock full features and increase visibility.
                        </p>
                        <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-gray-900">Missing Information</span>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 border border-orange-200">
                              {missingFields.length} fields
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(showAllMissingFields ? missingFields : missingFields.slice(0, 5)).map((field) => (
                              <Badge
                                key={field}
                                variant="outline"
                                className="text-xs border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                              >
                                {humanReadableFields[field] || field}
                              </Badge>
                            ))}
                            {missingFields.length > 5 && !showAllMissingFields && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setShowAllMissingFields(true)}
                              >
                                +{missingFields.length - 5} more
                              </Badge>
                            )}
                            {showAllMissingFields && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
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
                          className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 font-semibold transition-all duration-200 text-xs sm:text-sm"
                          onClick={() => setActiveTab("profile")}
                        >
                          Complete Profile
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center py-4">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-lg">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Profile Complete!</h3>
                          <p className="text-sm text-green-700 mb-4">
                            Your profile is fully complete! All features are unlocked and your visibility is maximized.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 font-semibold transition-all duration-200 text-sm"
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
            <Card id="tour-purchase-requests" className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-xl font-bold text-gray-900">Recent Purchase Requests</CardTitle>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage customer purchase requests and approvals</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("requests")} className="border-orange-200 text-orange-600 hover:bg-orange-50 text-xs sm:text-sm w-full sm:w-auto">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {requests.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Purchase Requests</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-sm mx-auto">
                      When customers make purchase requests, they'll appear here for your review and approval.
                    </p>
                    <Button onClick={() => setActiveTab("products")} variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto">
                      <Gift className="h-4 w-4 mr-2" /> Check Your Products
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {requests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                            {request.customer.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{request.customer}</h4>
                              <Badge
                                className={`px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${request.status === "approved"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : request.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                  }`}
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Menu className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span>{request.time}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-medium">₹{typeof request.amount === 'number' ? request.amount.toLocaleString() : request.amount}</span>
                              </span>
                            </div>
                          </div>
                          {request.status === "pending" && (
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1 text-xs font-medium rounded-md"
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
                                className="border-red-300 text-red-600 hover:bg-red-50 px-3 sm:px-4 py-1 text-xs font-medium rounded-md"
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
                        <Button variant="outline" onClick={() => setActiveTab("requests")} className="border-gray-300 text-gray-600 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto">
                          View {requests.length - 5} More Requests
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card id="tour-performance-chart">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">Revenue Analytics</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Monthly and daily performance overview</CardDescription>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
      <WelcomePendingModal isOpen={showWelcomeModal} onClose={() => { setShowWelcomeModal(false); setActiveTab("overview"); setCurrentTourIndex(0); setTourSteps(getFullTourSteps()); setRunTour(true); }} />

      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          merchantStatus={merchant.status}
          isTourRunning={runTour}
          activeOffersCount={activeOffersCount}
        />
        <div className="flex-1 lg:ml-64 pt-2 sm:pt-3 md:pt-4 pb-4 md:pb-8 px-3 sm:px-4 md:px-8">
          {/* Menu Button */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sm"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
              {sidebarOpen ? 'Collapse' : 'Menu'}
            </Button>
          </div>

          {/* Pending Account Banner */}
          {merchant.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Incomplete Account Information</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account details are incomplete. Please fill in the missing information and submit for review.
                    The administrator will verify and approve your updates within 48 hours.
                    You’ll receive an email once your profile is approved and live.
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
            setTimeout(() => {
              setRunTour(true);
            }, 350);
            return;
          }

          // Handle tour completion, skip, or close
          if (status === "finished" || status === "skipped" || action === "close" || action === "skip") {
            console.log('Tour ended:', status, action);
            setRunTour(false);
            setCurrentTourIndex(0);
            setTourSteps([]);
            setActiveTab("overview");
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
            }, 100);
            return;
          }

          // Handle navigation between steps
          if (type === "step:after" && (action === "next" || action === "prev")) {
            // Calculate target index based on action
            const targetIndex = action === "next" ? index + 1 : index - 1;

            // Check if we're going beyond the tour steps
            if (targetIndex >= tourSteps.length || targetIndex < 0) {
              console.log('Tour navigation out of bounds, ending tour');
              setRunTour(false);
              setCurrentTourIndex(0);
              setTourSteps([]);
              setActiveTab("overview");
              return;
            }

            // Determine which tab the target step needs
            let requiredTab = "overview";
            if (targetIndex >= 3 && targetIndex <= 8) {
              requiredTab = "profile";
            } else if (targetIndex === 9 || targetIndex === 10) {
              requiredTab = "offers";
            } else if (targetIndex === 11 || targetIndex === 12) {
              requiredTab = "products";
            } else if (targetIndex === 13 || targetIndex === 14) {
              requiredTab = "requests";
            } else if (targetIndex >= 15 && targetIndex <= 17) {
              requiredTab = "support";
            }

            console.log(`Moving to step ${targetIndex} (tab: ${requiredTab}, current: ${activeTab})`);

            // Pause tour temporarily to allow DOM updates
            setRunTour(false);

            // Update tour index so child components receive correct prop
            setCurrentTourIndex(targetIndex);

            // Switch tab if different from current
            if (requiredTab !== activeTab) {
              console.log(`Switching tab from ${activeTab} to ${requiredTab}`);
              setActiveTab(requiredTab);
            }

            // Wait for DOM to update (child components need time to render/update)
            setTimeout(() => {
              setRunTour(true);
            }, 350);
          }
        }}
        styles={{
          options: {
            primaryColor: "#3b82f6",
            textColor: "#374151",
            backgroundColor: "#ffffff",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10000,
            width: typeof window !== 'undefined' && window.innerWidth < 640 ? '90vw' : 400,
          },
          tooltip: {
            borderRadius: 8,
            padding: typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 20,
            fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 14 : 16,
            maxWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? '90vw' : '400px',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipContent: {
            padding: typeof window !== 'undefined' && window.innerWidth < 640 ? '8px 0' : '12px 0',
          },
          buttonNext: {
            backgroundColor: '#3b82f6',
            fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 13 : 14,
            padding: typeof window !== 'undefined' && window.innerWidth < 640 ? '8px 12px' : '10px 16px',
            borderRadius: 6,
          },
          buttonBack: {
            marginRight: 8,
            fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 13 : 14,
            padding: typeof window !== 'undefined' && window.innerWidth < 640 ? '8px 12px' : '10px 16px',
            color: '#6b7280',
          },
          buttonSkip: {
            fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 13 : 14,
            color: '#6b7280',
          },
          spotlight: {
            borderRadius: 4,
          },
        }}
      />

      {/* Block pointer events during tour */}
      {runTour && (
        <style dangerouslySetInnerHTML={{
          __html: `
            body * {
              pointer-events: none !important;
            }
            .react-joyride__beacon,
            .react-joyride__spotlight,
            .react-joyride__tooltip,
            .react-joyride__tooltip * {
              pointer-events: auto !important;
            }
            .allow-during-tour {
              pointer-events: auto !important;
            }
            
            /* Ensure tooltip stays within viewport */
            .react-joyride__tooltip {
              max-width: 90vw !important;
              box-sizing: border-box !important;
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
              
              /* Ensure spotlight doesn't overflow */
              .react-joyride__spotlight {
                border-radius: 4px !important;
              }
              
              /* Better overlay on mobile */
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
              animation: tooltipFadeIn 0.3s ease-in-out !important;
            }
            
            @keyframes tooltipFadeIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `
        }} />
      )}
    </div>
  );
}
