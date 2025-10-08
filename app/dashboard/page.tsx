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
  status: "active" | "pending" | "suspended" | "inactive";
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

  useEffect(() => {
    if (tourSteps.length > 0) {
      setRunTour(true);
    }
  }, [tourSteps]);

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
  }, [merchant?.id]); // only refetch if merchant id changes

  // Tour functions
  const startTour = () => {
    setTourSteps(getFullTourSteps());
    setRunTour(true);
  };

  const getFullTourSteps = (): Step[] => [
    { target: "#tour-welcome", content: "Welcome to your dashboard! This is the overview where you'll see your business performance and quick actions." },
    { target: "#tour-performance", content: "Here you'll track your store's performance with key metrics and analytics." },
    { target: "#tour-profile-completion", content: "Complete your profile to unlock all dashboard features." },
    { target: "body", content: "Fill in all your business details here. Complete information helps you get approved faster.", placement: "center" },
    { target: "body", content: "Once approved, you'll be able to create and manage special offers and promotions for your customers.", placement: "center" },
    { target: "body", content: "Once approved, you'll be able to add and manage your CW products here.", placement: "center" },
    { target: "body", content: "Once approved, you'll be able to add and manage your in-store products here.", placement: "center" },
    { target: "body", content: "Once approved, you'll be able to review and approve customer purchase requests here.", placement: "center" },
    { target: "body", content: "Once approved, you'll be able to request digital marketing materials and support here.", placement: "center" },
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
            target: "#tour-unavailable",
            content: "Once approved, you'll be able to create and manage special offers and promotions for your customers.",
          },
        ];
      case "products":
        return [
          {
            target: "#tour-unavailable",
            content: "Once approved, you'll be able to add and manage your products and services here.",
          },
        ];
      case "offline-products":
        return [
          {
            target: "#tour-unavailable",
            content: "Once approved, you'll be able to add and manage your in-store products here.",
          },
        ];
      case "requests":
        return [
          {
            target: "#tour-unavailable",
            content: "Once approved, you'll be able to review and approve customer purchase requests here.",
          },
        ];
      case "support":
        return [
          {
            target: "#tour-unavailable",
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
    const { status } = merchant;

    const renderProfileCompletionCard = () => (
      <Card id="tour-profile-completion" className={`${missingFields.length > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}`}>
        <CardHeader>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {missingFields.length > 0 ? (
              <>
                <p className="text-sm text-gray-700">
                  Complete your profile to unlock full features and increase visibility.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span className="font-medium">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-3" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Missing Fields ({missingFields.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(showAllMissingFields ? missingFields : missingFields.slice(0, 5)).map((field) => (
                      <Badge
                        key={field}
                        variant="outline"
                        className="text-xs border-orange-300 text-orange-700 bg-orange-100"
                      >
                        {humanReadableFields[field] || field}
                      </Badge>
                    ))}
                    {missingFields.length > 5 && !showAllMissingFields && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50"
                        onClick={() => setShowAllMissingFields(true)}
                      >
                        +{missingFields.length - 5} more
                      </Badge>
                    )}
                    {showAllMissingFields && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50"
                        onClick={() => setShowAllMissingFields(false)}
                      >
                        Show less
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 allow-during-tour" onClick={() => setActiveTab("profile")}>
                  Complete Profile
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  Your profile is fully complete! All features are unlocked.
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">100% Complete</span>
                </div>
                <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700 hover:bg-green-100 allow-during-tour" onClick={() => setActiveTab("profile")}>
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
                      Take Dashboard Tour
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
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Store Performance</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Available after approval</p>
                      </div>
                    </div>
                    <Badge className="px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div id="tour-unavailable" className="text-center py-8 sm:py-12">
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                      <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Performance Tracking Unavailable</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                      Complete your profile and wait for approval to start tracking performance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Completion Card */}
              {renderProfileCompletionCard()}
            </div>
          </div>
        );
      } else if (activeTab === "profile") {
        return <div id="tour-profile-settings"><ProfileSettings /></div>;
      } else {
        if (runTour) {
          // During tour, show actual features for educational purposes
          switch (activeTab) {
            case "offers":
              return <div id="tour-offers"><OffersManagement /></div>;
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
        } else {
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
        return <OffersManagement />;
      case "products":
        return <ProductsManagement />;
      case "offline-products":
        return <ProductsManagement />;
      case "requests":
        return <PurchaseRequests />;
      case "profile":
        return <ProfileSettings />;
      case "support":
        return <DigitalSupport />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Welcome Section */}
            <Card id="tour-welcome" className="mb-8 bg-white  border-0 transition-all duration-300 ">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Welcome back, {(merchant as ExtendedMerchant).displayName || merchant.businessName}!
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Your store is currently{" "}
                      <Badge
                        className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${status === "active"
                          ? "bg-green-100 text-green-700"
                          : status === "suspended"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {status || "unknown"}
                      </Badge>
                    </p>
                    <p className="text-sm sm:text-base text-gray-500">Manage your business efficiently with quick actions below.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto lg:ml-auto">
                    <Button
                      onClick={() => setActiveTab("products")}
                      className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                      disabled={status !== "active"}
                    >
                      Add Product
                    </Button>
                    <Button
                      onClick={() => setActiveTab("offers")}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                      disabled={status !== "active"}
                    >
                      Create Offer
                    </Button>
                    <Button
                      onClick={() => setActiveTab("requests")}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto hidden sm:flex"
                      disabled={status !== "active"}
                    >
                      View Requests
                    </Button>
                    <Button
                      onClick={startTour}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                      disabled={status !== "active"}
                    >
                      Take Dashboard Tour
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
              <Card id="tour-profile-completion" className={`${missingFields.length > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}`}>
                <CardHeader className="p-4 sm:p-6">
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
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {missingFields.length > 0 ? (
                      <>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Complete your profile to unlock full features and increase visibility.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Profile Completion</span>
                            <span className="font-medium">{profileCompletion}%</span>
                          </div>
                          <Progress value={profileCompletion} className="h-2 sm:h-3" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Missing Fields ({missingFields.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(showAllMissingFields ? missingFields : missingFields.slice(0, 5)).map((field) => (
                              <Badge
                                key={field}
                                variant="outline"
                                className="text-xs border-orange-300 text-orange-700 bg-orange-100"
                              >
                                {humanReadableFields[field] || field}
                              </Badge>
                            ))}
                            {missingFields.length > 5 && !showAllMissingFields && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50"
                                onClick={() => setShowAllMissingFields(true)}
                              >
                                +{missingFields.length - 5} more
                              </Badge>
                            )}
                            {showAllMissingFields && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-50"
                                onClick={() => setShowAllMissingFields(false)}
                              >
                                Show less
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 text-xs sm:text-sm">
                          Complete Profile
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Your profile is fully complete! All features are unlocked.
                        </p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          <span className="text-xs sm:text-sm font-medium text-green-700">100% Complete</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700 hover:bg-green-100 text-xs sm:text-sm">
                          Update Profile
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Purchase Requests */}
            <Card className="bg-white border-0 shadow-lg">
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
                  <div className="space-y-3 sm:space-y-4">
                    {requests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg flex-shrink-0">
                              {request.customer.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">{request.customer}</h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Menu className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.time}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="font-medium">₹{typeof request.amount === 'number' ? request.amount.toLocaleString() : request.amount}</span>
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${request.status === "approved"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex-1"
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
                              className="border-red-300 text-red-600 hover:bg-red-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex-1"
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
            <Card>
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
      <WelcomePendingModal isOpen={showWelcomeModal} onClose={() => { setShowWelcomeModal(false); setTourSteps(getFullTourSteps()); setRunTour(true); }} />

      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          merchantStatus={merchant.status}
          isTourRunning={runTour}
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
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        hideCloseButton={true}
        disableOverlayClose={true}
        disableCloseOnEsc={true}
        locale={{ skip: "Close Tour" }}
        callback={(data) => {
          const { index, status, type } = data;
          if (status === "finished" || status === "skipped") {
            setRunTour(false);
          } else if (type === "step:before") {
            setTimeout(() => {
              if (index === 0 || index === 1 || index === 2) {
                setActiveTab("overview");
              } else if (index === 3) {
                setActiveTab("profile");
              } else if (index === 4) {
                setActiveTab("offers");
              } else if (index === 5) {
                setActiveTab("products");
              } else if (index === 6) {
                setActiveTab("offline-products");
              } else if (index === 7) {
                setActiveTab("requests");
              } else if (index === 8) {
                setActiveTab("support");
              }
            }, 500);
          }
        }}
        styles={{
          options: {
            primaryColor: "#3b82f6",
            textColor: "#374151",
            backgroundColor: "#ffffff",
            overlayColor: "rgba(0, 0, 0, 0.5)",
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
          `
        }} />
      )}
    </div>
  );
}
