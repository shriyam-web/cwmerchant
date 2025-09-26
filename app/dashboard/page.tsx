// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { DashboardSidebar } from "@/components/dashboard/sidebar";
// import { PerformanceChart } from "@/components/dashboard/performance-chart";
// import { OffersManagement } from "@/components/dashboard/offers-management";
// import { ProductsManagement } from "@/components/dashboard/products-management";
// import { PurchaseRequests } from "@/components/dashboard/purchase-requests";
// import { ProfileSettings } from "@/components/dashboard/profile-settings";
// import { DigitalSupport } from "@/components/dashboard/digital-support";
// import {
//   TrendingUp,
//   Users,
//   DollarSign,
//   Activity,
//   Eye,
//   CheckCircle,
//   Clock,
//   Gift,
//   AlertTriangle,
// } from "lucide-react";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [storeStatus, setStoreStatus] = useState<"active" | "inactive">(
//     "active",
//   );

//   const stats = [
//     {
//       title: "Monthly Revenue",
//       value: "₹2,45,680",
//       change: "+12.5%",
//       changeType: "positive" as const,
//       icon: <DollarSign className="h-6 w-6" />,
//     },
//     {
//       title: "Card Users",
//       value: "1,234",
//       change: "+8.2%",
//       changeType: "positive" as const,
//       icon: <Users className="h-6 w-6" />,
//     },
//     {
//       title: "Daily Performance",
//       value: "₹8,450",
//       change: "+5.1%",
//       changeType: "positive" as const,
//       icon: <TrendingUp className="h-6 w-6" />,
//     },
//     {
//       title: "Active Offers",
//       value: "12",
//       change: "+2",
//       changeType: "neutral" as const,
//       icon: <Gift className="h-6 w-6" />,
//     },
//   ];

//   const recentRequests = [
//     {
//       id: "1",
//       customer: "Rahul Sharma",
//       amount: "₹1,250",
//       status: "pending",
//       time: "2 hours ago",
//     },
//     {
//       id: "2",
//       customer: "Priya Singh",
//       amount: "₹850",
//       status: "approved",
//       time: "5 hours ago",
//     },
//     {
//       id: "3",
//       customer: "Amit Kumar",
//       amount: "₹2,100",
//       status: "pending",
//       time: "1 day ago",
//     },
//   ];

//   const renderMainContent = () => {
//     switch (activeTab) {
//       case "offers":
//         return <OffersManagement />;
//       case "products":
//         return <ProductsManagement />;
//       case "requests":
//         return <PurchaseRequests />;
//       case "profile":
//         return <ProfileSettings />;
//       case "support":
//         return <DigitalSupport />;
//       default:
//         return (
//           <div className="space-y-8">
//             {/* Store Status & Profile Completion */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <Card className="lg:col-span-2">
//                 {/* Card Header */}
//                 <CardHeader className="flex items-center justify-between">
//                   {/* Left: Title + Status Badge */}
//                   <div className="flex items-center gap-2">
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="h-5 w-5" /> Store Status
//                     </CardTitle>
//                     <Badge
//                       className={`text-xs px-2 py-0.5 rounded-full ${status === "active"
//                         ? "bg-green-100 text-green-700"
//                         : status === "pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : status === "suspended"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                     >
//                       {status || "unknown"}
//                     </Badge>
//                   </div>

//                   {/* Right: Preview Store Button */}
//                   <Button variant="outline" size="sm" className="h-8 px-3">
//                     <Eye className="h-4 w-4 mr-1" /> Preview Store
//                   </Button>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {stats.map((stat, index) => (
//                       <div
//                         key={index}
//                         className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
//                       >
//                         <div className="flex justify-center mb-2">
//                           <div className="p-2 bg-white rounded-lg shadow-sm">
//                             <div className="text-blue-600">{stat.icon}</div>
//                           </div>
//                         </div>
//                         <div className="text-2xl font-bold text-gray-900 mb-1">
//                           {stat.value}
//                         </div>
//                         <div className="text-xs text-gray-600 mb-1">
//                           {stat.title}
//                         </div>
//                         <Badge
//                           variant={
//                             stat.changeType === "positive"
//                               ? "default"
//                               : "secondary"
//                           }
//                           className={`text-xs ${stat.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
//                         >
//                           {stat.change}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Profile Completion</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between text-sm">
//                       <span>85% Complete</span>
//                       <span className="text-gray-500">3 items remaining</span>
//                     </div>
//                     <Progress value={85} className="h-2" />
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-green-600" /> Basic
//                         Information
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-green-600" /> Bank
//                         Details
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock className="h-4 w-4 text-orange-500" /> Add
//                         Products
//                       </div>
//                     </div>
//                     <Button variant="outline" size="sm" className="w-full">
//                       Complete Profile
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Performance Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue Analytics</CardTitle>
//                 <CardDescription>
//                   Monthly and daily performance overview
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <PerformanceChart />
//               </CardContent>
//             </Card>

//             {/* Recent Purchase Requests */}
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>Recent Purchase Requests</CardTitle>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setActiveTab("requests")}
//                   >
//                     View All
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {recentRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                     >
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {request.customer}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {request.time}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-semibold text-gray-900">
//                           {request.amount}
//                         </div>
//                         <Badge
//                           variant={
//                             request.status === "approved"
//                               ? "default"
//                               : "secondary"
//                           }
//                           className={
//                             request.status === "approved"
//                               ? "bg-green-600"
//                               : "bg-orange-500"
//                           }
//                         >
//                           {request.status}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
//         <div className="flex-1 lg:ml-64 p-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {activeTab === "overview" && "Dashboard Overview"}
//               {activeTab === "offers" && "Offers Management"}
//               {activeTab === "products" && "Products Management"}
//               {activeTab === "requests" && "Purchase Requests"}
//               {activeTab === "profile" && "Profile Settings"}
//               {activeTab === "support" && "Digital Support"}
//             </h1>
//             <p className="text-gray-600">
//               {activeTab === "overview" &&
//                 "Welcome back! Here's what's happening with your business today."}
//               {activeTab === "offers" &&
//                 "Create and manage your special offers and promotions."}
//               {activeTab === "products" &&
//                 "Add and manage your products and services."}
//               {activeTab === "requests" &&
//                 "Review and approve customer purchase requests."}
//               {activeTab === "profile" &&
//                 "Manage your business profile and settings."}
//               {activeTab === "support" &&
//                 "Request digital marketing materials and support."}
//             </p>
//           </div>

//           {renderMainContent()}
//         </div>
//       </div>
//     </div>
//   );
// }

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

  const profileFields: string[] = [
    "applicationId", //1
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
    applicationId: "Application ID",
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
            {/* Store Status + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                {/* Card Header */}
                <CardHeader className="flex items-center justify-between">
                  {/* Left: Title + Status Badge */}
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" /> Store Status
                    </CardTitle>
                    <Badge
                      className={`text-xs px-2 py-0.5 rounded-full ${status === "active"
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
                  </div>

                  {/* Right: Preview Store Button */}
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    <Eye className="h-4 w-4 mr-1" /> Preview Store
                  </Button>
                </CardHeader>

                {/* Card Content: Stats Grid */}
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.slice(0, 4).map((stat, idx) => (
                      <div
                        key={idx}
                        className="text-center p-4 bg-gray-50 rounded-xl shadow-sm"
                      >
                        {/* Icon */}
                        <div className="flex justify-center mb-2">
                          <div className="p-2 bg-white rounded-lg shadow">
                            {iconMap[stat.icon] || <Gift className="h-6 w-6" />}
                          </div>
                        </div>
                        {/* Value */}
                        <div className="text-2xl font-bold">{stat.value}</div>
                        {/* Title */}
                        <div className="text-xs text-gray-600">{stat.title}</div>
                        {/* Optional change percentage */}
                        {stat.change && (
                          <div
                            className={`text-xs mt-1 ${stat.change.startsWith("+")
                              ? "text-green-500"
                              : "text-red-500"
                              }`}
                          >
                            {stat.change}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>





              {/* Missing Info */}
              {missingFields.length > 0 && (
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>Missing Information</CardTitle>
                    <Badge className="bg-orange-500 text-white">
                      {missingFields.length} Fields Missing
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Complete your profile to increase visibility:
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {missingFields.map((field) => (
                        <span
                          key={field}
                          className="px-1 py-0.5 border border-red-500 rounded-full text-[11px] text-red-500 bg-white"
                        >
                          {humanReadableFields[field] || field}
                        </span>
                      ))}
                    </div>




                    <Progress value={profileCompletion} className="h-2 mt-2" />
                    <p className="text-xs text-gray-500 mt-1">{profileCompletion}% Complete</p>

                  </CardContent>
                </Card>
              )}
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

            {/* Recent Requests */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Recent Purchase Requests</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("requests")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {requests.length === 0 ? (
                  <p className="text-gray-500 text-sm">No requests found.</p>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <div>
                        <div className="font-medium">{request.customer}</div>
                        <div className="text-sm text-gray-500">{request.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{request.amount}</div>
                        <Badge
                          className={`${request.status === "approved"
                            ? "bg-green-600 text-white"
                            : request.status === "pending"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                            }`}
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 lg:ml-64 p-8">
          {/* Dashboard Title */}
          <h2 className="text-3xl  font-bold mb-2">Dashboard Overview</h2>

          {/* Welcome Message */}
          <p className="text mb-4">
            Welcome back! Here's what's happening with your business today.
          </p>

          {/* Merchant Name */}
          {/* <h3 className="text-xl font-medium mb-6">
            Welcome {merchant.businessName}
          </h3> */}

          {renderMainContent()}
        </div>


      </div>
    </div>
  );
}
