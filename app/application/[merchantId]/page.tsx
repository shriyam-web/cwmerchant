"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    ArrowRight,
    Mail,
    Building,
    MapPin,
    Phone,
    Image as ImageIcon,
    Package,
    Eye,
    Shield,
    Award,
    Calendar,
    TrendingUp,
} from "lucide-react";

interface ApplicationStatus {
    merchantId: string;
    displayName: string;
    legalName: string;
    email: string;
    status: "pending" | "active" | "suspended" | "inactive";
    emailVerified: boolean;
    joinedSince: string;
    completionPercentage: number;
    missingFieldsCount: number;
    completedFieldsCount: number;
    totalRequiredFields: number;
    missingFields: Record<string, { key: string; label: string; category: string }[]>;
    nextSteps: string[];
    profileDetails: {
        category: string;
        city: string;
        state: string;
        phone: string;
        hasLogo: boolean;
        hasStoreImages: boolean;
        storeImagesCount: number;
        hasProducts: boolean;
        productsCount: number;
        visibility: boolean;
        citywittyAssured: boolean;
        isVerified: boolean;
        purchasedPackage: string | null;
    };
}

export default function ApplicationStatusPage() {
    const params = useParams();
    const router = useRouter();
    const merchantId = params?.merchantId as string;

    const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!merchantId) return;

        const fetchApplicationStatus = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/application/${merchantId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch application status");
                }

                setApplicationData(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationStatus();
    }, [merchantId]);

    // Status configuration
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return {
                    icon: <CheckCircle className="h-8 w-8" />,
                    color: "text-green-500",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    label: "Active",
                    description: "Your profile is live and visible to customers",
                };
            case "pending":
                return {
                    icon: <Clock className="h-8 w-8" />,
                    color: "text-yellow-500",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    label: "Pending",
                    description: "Your application is under review",
                };
            case "suspended":
                return {
                    icon: <AlertCircle className="h-8 w-8" />,
                    color: "text-red-500",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    label: "Suspended",
                    description: "Your account has been temporarily suspended",
                };
            case "inactive":
                return {
                    icon: <XCircle className="h-8 w-8" />,
                    color: "text-gray-500",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    label: "Inactive",
                    description: "Your account is currently inactive",
                };
            default:
                return {
                    icon: <Clock className="h-8 w-8" />,
                    color: "text-gray-500",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    label: "Unknown",
                    description: "Status unknown",
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-64 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !applicationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <XCircle className="h-6 w-6" />
                                Error
                            </CardTitle>
                            <CardDescription>{error || "Application not found"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => router.push("/login")} className="w-full">
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(applicationData.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Application Status
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Track your merchant application progress
                    </p>
                </div>

                {/* Status Card */}
                <Card className={`border-2 ${statusConfig.borderColor}`}>
                    <CardHeader className={statusConfig.bgColor}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={statusConfig.color}>
                                    {statusConfig.icon}
                                </div>
                                <div className="text-center md:text-left">
                                    <CardTitle className="text-2xl">{applicationData.displayName}</CardTitle>
                                    <CardDescription className="text-base">
                                        Merchant ID: {applicationData.merchantId}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge
                                variant={applicationData.status === "active" ? "default" : "secondary"}
                                className={`text-lg px-4 py-2 ${statusConfig.color}`}
                            >
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-gray-700 text-center md:text-left">
                            {statusConfig.description}
                        </p>
                    </CardContent>
                </Card>

                {/* Profile Completion */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Profile Completion
                        </CardTitle>
                        <CardDescription>
                            Complete your profile to increase visibility
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {applicationData.completedFieldsCount} of {applicationData.totalRequiredFields} fields completed
                                </span>
                                <span className="font-semibold text-gray-900">
                                    {applicationData.completionPercentage}%
                                </span>
                            </div>
                            <Progress value={applicationData.completionPercentage} className="h-3" />
                        </div>

                        {applicationData.missingFieldsCount > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-yellow-800">
                                    {applicationData.missingFieldsCount} required {applicationData.missingFieldsCount === 1 ? "field" : "fields"} remaining
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Business Info */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Building className="h-5 w-5 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Business Type</p>
                                    <p className="text-lg font-semibold text-gray-900">{applicationData.profileDetails.category}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-green-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {applicationData.profileDetails.city}, {applicationData.profileDetails.state}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-purple-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-lg font-semibold text-gray-900">{applicationData.profileDetails.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Mail className={`h-5 w-5 mt-1 ${applicationData.emailVerified ? "text-green-500" : "text-red-500"}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email Status</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {applicationData.emailVerified ? "Verified" : "Not Verified"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logo Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <ImageIcon className={`h-5 w-5 mt-1 ${applicationData.profileDetails.hasLogo ? "text-green-500" : "text-gray-400"}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Logo</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {applicationData.profileDetails.hasLogo ? "Uploaded" : "Not Added"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Store Images */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <ImageIcon className={`h-5 w-5 mt-1 ${applicationData.profileDetails.hasStoreImages ? "text-green-500" : "text-gray-400"}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Store Images</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {applicationData.profileDetails.storeImagesCount} {applicationData.profileDetails.storeImagesCount === 1 ? "Image" : "Images"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Package className={`h-5 w-5 mt-1 ${applicationData.profileDetails.hasProducts ? "text-green-500" : "text-gray-400"}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Products</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {applicationData.profileDetails.productsCount} {applicationData.profileDetails.productsCount === 1 ? "Product" : "Products"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visibility */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Eye className={`h-5 w-5 mt-1 ${applicationData.profileDetails.visibility ? "text-green-500" : "text-gray-400"}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Visibility</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {applicationData.profileDetails.visibility ? "Live" : "Hidden"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Badges */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-yellow-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Badges</p>
                                    <div className="flex gap-2 mt-1">
                                        {applicationData.profileDetails.citywittyAssured && (
                                            <Badge variant="secondary" className="text-xs">Assured</Badge>
                                        )}
                                        {applicationData.profileDetails.isVerified && (
                                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                                        )}
                                        {!applicationData.profileDetails.citywittyAssured && !applicationData.profileDetails.isVerified && (
                                            <span className="text-sm text-gray-500">None</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Next Steps */}
                {applicationData.nextSteps.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowRight className="h-5 w-5 text-blue-500" />
                                Next Steps
                            </CardTitle>
                            <CardDescription>
                                Complete these steps to activate your merchant profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {applicationData.nextSteps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-700 mt-0.5">{step}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Missing Fields */}
                {applicationData.missingFieldsCount > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Missing Information
                            </CardTitle>
                            <CardDescription>
                                Complete these fields to reach 100% profile completion
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {Object.entries(applicationData.missingFields).map(([category, fields]) => (
                                    <div key={category} className="space-y-2">
                                        <h4 className="font-semibold text-gray-900">{category}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {fields.map((field: any) => (
                                                <div
                                                    key={field.key}
                                                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2"
                                                >
                                                    <XCircle className="h-4 w-4 text-red-400" />
                                                    {field.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={() => router.push("/dashboard")}
                                className="w-full sm:w-auto"
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => router.push("/login")}
                                className="w-full sm:w-auto"
                            >
                                Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Member since {new Date(applicationData.joinedSince).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}