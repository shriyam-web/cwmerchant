"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { OffersManagement } from "@/components/dashboard/offers-management";
import { ProductsManagement } from "@/components/dashboard/products-management";
import { PurchaseRequests } from "@/components/dashboard/purchase-requests";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { DigitalSupport } from "@/components/dashboard/digital-support";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Eye,
  CheckCircle,
  Clock,
  Gift,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [storeStatus, setStoreStatus] = useState<"active" | "inactive">(
    "active",
  );

  const stats = [
    {
      title: "Monthly Revenue",
      value: "₹2,45,680",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "Card Users",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Daily Performance",
      value: "₹8,450",
      change: "+5.1%",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Active Offers",
      value: "12",
      change: "+2",
      changeType: "neutral" as const,
      icon: <Gift className="h-6 w-6" />,
    },
  ];

  const recentRequests = [
    {
      id: "1",
      customer: "Rahul Sharma",
      amount: "₹1,250",
      status: "pending",
      time: "2 hours ago",
    },
    {
      id: "2",
      customer: "Priya Singh",
      amount: "₹850",
      status: "approved",
      time: "5 hours ago",
    },
    {
      id: "3",
      customer: "Amit Kumar",
      amount: "₹2,100",
      status: "pending",
      time: "1 day ago",
    },
  ];

  const renderMainContent = () => {
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
            {/* Store Status & Profile Completion */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" /> Store Status
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="group relative">
                        <Badge
                          variant={
                            storeStatus === "active" ? "default" : "destructive"
                          }
                          className={`cursor-help ${storeStatus === "active" ? "bg-green-600" : ""}`}
                        >
                          {storeStatus === "active" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Inactive
                            </span>
                          )}
                        </Badge>
                        {storeStatus === "inactive" && (
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-3 w-64 z-10">
                            <div className="space-y-1">
                              <div>• Incomplete profile information</div>
                              <div>• Missing bank verification</div>
                              <div>• No products added</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Preview Shop
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                      >
                        <div className="flex justify-center mb-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <div className="text-blue-600">{stat.icon}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          {stat.title}
                        </div>
                        <Badge
                          variant={
                            stat.changeType === "positive"
                              ? "default"
                              : "secondary"
                          }
                          className={`text-xs ${stat.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>85% Complete</span>
                      <span className="text-gray-500">3 items remaining</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Basic
                        Information
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Bank
                        Details
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" /> Add
                        Products
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>
                  Monthly and daily performance overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            {/* Recent Purchase Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Purchase Requests</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("requests")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {request.amount}
                        </div>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            request.status === "approved"
                              ? "bg-green-600"
                              : "bg-orange-500"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "offers" && "Offers Management"}
              {activeTab === "products" && "Products Management"}
              {activeTab === "requests" && "Purchase Requests"}
              {activeTab === "profile" && "Profile Settings"}
              {activeTab === "support" && "Digital Support"}
            </h1>
            <p className="text-gray-600">
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
