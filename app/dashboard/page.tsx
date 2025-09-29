"use client";

import { useState, useEffect, useMemo } from "react";
import { useMerchantAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { OffersManagement } from "@/components/dashboard/offers-management";
import { ProductsManagement } from "@/components/dashboard/products-management";
import { PurchaseRequests } from "@/components/dashboard/purchase-requests";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { DigitalSupport } from "@/components/dashboard/digital-support";
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
  DollarSign,
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

export default function Dashboard() {
  const { merchant, setMerchant, loadingProfile } = useMerchantAuth();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState<Stat[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 1024);
  }, []);

  const profileFields: string[] = [
    "merchantId", //1
    "businessName", //2
    "ownerName", //3
    "email", //4
    "phone", //5
    "category", //6
    "city", //7
    "address", //8
    "whatsapp", //9
    "gstNumber", //10 
    "panNumber", //11
    "businessType", //12
    "yearsInBusiness",//13
    "averageMonthlyRevenue", //14
    "discountOffered", //15
    "description", //16
    "website", //17
    "socialLinks.linkedin", //18
    "socialLinks.twitter", //19
    "socialLinks.youtube", //20
    "socialLinks.instagram", //21
    "socialLinks.facebook", //22
    "logo", //23
    "storeImages", //24
    "mapLocation", //25
    "tags", //26
  ];
  const humanReadableFields: Record<string, string> = {
    merchantId: "Merchant Id",
    businessName: "Business Name",
    ownerName: "Owner Name",
    email: "Email Address",
    phone: "Phone Number",
    category: "Category",
    city: "City",
    address: "Address",
    whatsapp: "WhatsApp Number",
    gstNumber: "GST Number",
    panNumber: "PAN Number",
    businessType: "Business Type",
    yearsInBusiness: "Years in Business",
    averageMonthlyRevenue: "Average Monthly Revenue",
    discountOffered: "Discount Offered",
    description: "Business Description",
    website: "Website",
    "socialLinks.linkedin": "LinkedIn Profile",
    "socialLinks.twitter": "Twitter Profile",
    "socialLinks.youtube": "YouTube Channel",
    "socialLinks.instagram": "Instagram Profile",
    "socialLinks.facebook": "Facebook Profile",
    logo: "Store Logo",
    storeImages: "Store Images",
    mapLocation: "Store Location",
    tags: "Tags",
  };

  // Only booleans that are required
  const requiredBooleans = ["agreeToTerms"];

  // Helper to get nested values safely
  const getNestedValue = (obj: any, path: string) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

  const missingFields = useMemo(() => {
    if (!merchant) return [];

    return profileFields.filter((field) => {
      const value = getNestedValue(merchant, field);

      if (value === undefined || value === null) return true;
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === "string") return value.trim() === "";
      if (typeof value === "boolean" && requiredBooleans.includes(field) && value === false) return true;
      if (typeof value === "number" && isNaN(value)) return true;

      return false;
    });
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
    DollarSign: <DollarSign className="h-6 w-6 text-green-500" />,
    TrendingUp: <TrendingUp className="h-6 w-6 text-purple-500" />,
    AlertTriangle: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    Users: <Users className="h-6 w-6 text-indigo-500" />,
    CheckCircle: <CheckCircle className="h-6 w-6 text-teal-500" />,
  };

  useEffect(() => {
    if (!merchant) return; // login ke baad hi

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


  if (loadingProfile || loading) return <div className="p-8">Loading...</div>;
  if (!merchant) return <div className="p-8">No merchant found.</div>;

  const renderMainContent = () => {
    const { status } = merchant;

    switch (activeTab) {
      case "offers":
        return <OffersManagement />;
      case "products":
        return <ProductsManagement />;
      case "requests":
        return <PurchaseRequests />;
      case "profile":
        return <ProfileSettings />;
      case "support":
        return <DigitalSupport />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Welcome Section */}
            <Card className="mb-8 bg-white shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome back, {merchant.businessName}!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your store is currently{" "}
                      <Badge
                        className={`text-sm px-3 py-1 rounded-full ${status === "active"
                          ? "bg-green-100 text-green-700"
                          : status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "suspended"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {status || "unknown"}
                      </Badge>
                    </p>
                    <p className="text-gray-500">Manage your business efficiently with quick actions below.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setActiveTab("products")}
                      className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                    >
                      Add Product
                    </Button>
                    <Button
                      onClick={() => setActiveTab("offers")}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                      Create Offer
                    </Button>
                    <Button
                      onClick={() => setActiveTab("requests")}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                      View Requests
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Status + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Store Performance</h3>
                        <p className="text-sm text-gray-600">Track your business growth and key metrics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${status === "active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : status === "suspended"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                      >
                        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
                      </Badge>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-2" /> Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {stats.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.slice(0, 4).map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                              {iconMap[stat.icon] || <Gift className="h-5 w-5 text-blue-600" />}
                            </div>
                            {stat.change && (
                              <div
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith("+")
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {stat.change}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                        <Activity className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Track Performance</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Start by adding your first product to see real-time analytics and performance metrics.
                      </p>
                      <Button onClick={() => setActiveTab("products")} className="bg-blue-600 hover:bg-blue-700">
                        <Gift className="h-4 w-4 mr-2" /> Add Your First Product
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Completion / Missing Info */}
              <Card className={`${missingFields.length > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}`}>
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
                            {missingFields.slice(0, 5).map((field) => (
                              <Badge
                                key={field}
                                variant="outline"
                                className="text-xs border-orange-300 text-orange-700 bg-orange-100"
                              >
                                {humanReadableFields[field] || field}
                              </Badge>
                            ))}
                            {missingFields.length > 5 && (
                              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                +{missingFields.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
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
                        <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700 hover:bg-green-100">
                          Update Profile
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Monthly and daily performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            {/* Recent Purchase Requests */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Purchase Requests</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Manage customer purchase requests and approvals</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("requests")} className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchase Requests</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      When customers make purchase requests, they'll appear here for your review and approval.
                    </p>
                    <Button onClick={() => setActiveTab("products")} variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                      <Gift className="h-4 w-4 mr-2" /> Check Your Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {request.customer.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">{request.customer}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Menu className="h-4 w-4" />
                                  {request.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ₹{typeof request.amount === 'number' ? request.amount.toLocaleString() : request.amount}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${request.status === "approved"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : request.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                            {request.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                  onClick={() => {
                                    // Handle approve action
                                    setRequests(prev => prev.map(r =>
                                      r.id === request.id ? { ...r, status: "approved" as const } : r
                                    ));
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                  onClick={() => {
                                    // Handle reject action
                                    setRequests(prev => prev.map(r =>
                                      r.id === request.id ? { ...r, status: "rejected" as const } : r
                                    ));
                                  }}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {requests.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => setActiveTab("requests")} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                          View {requests.length - 5} More Requests
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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

      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 lg:ml-64 p-4 md:p-8">
          {/* Menu Button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5 mr-1" />
              {sidebarOpen ? 'Collapse' : 'Expand'}
            </Button>
          </div>

          {/* Dynamic Title and Description based on active tab */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "offers" && "Offers Management"}
              {activeTab === "products" && "Products Management"}
              {activeTab === "requests" && "Purchase Requests"}
              {activeTab === "profile" && "Profile Settings"}
              {activeTab === "support" && "Digital Support"}
            </h1>
            <p className="text-lg text-gray-700">
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
            </p>
          </div>

          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
