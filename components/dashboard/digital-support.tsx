'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, CheckCircle, Clock, Image as ImageIcon, Video, Mic, Globe, BarChart3, History, TrendingUp, Zap, Crown, Star } from 'lucide-react';

interface Request {
    id: string;
    type: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    submittedAt: string;
    completedAt: string | null;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface SupportItemWithLimits {
    type: string;
    title: string;
    total: number;
    used: number;
    icon: any;
    description: string;
}

interface SupportItemWithBuilt {
    type: string;
    title: string;
    built: boolean;
    icon: any;
    description: string;
}

type SupportItem = SupportItemWithLimits | SupportItemWithBuilt;

interface DigitalSupportProps {
    merchant?: any;
}

export default function DigitalSupport({ merchant }: DigitalSupportProps) {
    const [requests, setRequests] = useState<Request[]>([
        {
            id: '1',
            type: 'banner',
            title: 'Festival Sale Banner',
            description: 'Need a banner for Diwali sale promotion',
            status: 'completed',
            submittedAt: '2025-01-10',
            completedAt: '2025-01-12',
            priority: 'normal'
        },
        {
            id: '2',
            type: 'social_media',
            title: 'Instagram Post Design',
            description: 'Social media post for new product launch',
            status: 'in_progress',
            submittedAt: '2025-01-14',
            completedAt: null,
            priority: 'normal'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-600';
            case 'in_progress':
                return 'text-blue-600';
            case 'pending':
                return 'text-amber-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'in_progress':
                return <Clock className="h-4 w-4" />;
            case 'pending':
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'normal':
                return 'bg-blue-100 text-blue-800';
            case 'low':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Enhanced support data with descriptions
    const supportData: SupportItem[] = [
        {
            type: 'graphics',
            title: 'Graphics Design',
            total: 10,
            used: 0,
            icon: ImageIcon,
            description: 'Professional banners, logos, and marketing graphics'
        },
        {
            type: 'reels',
            title: 'Video Reels',
            total: 5,
            used: 0,
            icon: Video,
            description: 'Engaging short-form videos for social media'
        },
        {
            type: 'podcast',
            title: 'Podcast Production',
            total: 3,
            used: 0,
            icon: Mic,
            description: 'Professional podcast recording and editing'
        },
        {
            type: 'website',
            title: 'Website Development',
            built: false,
            icon: Globe,
            description: 'Custom website design and development'
        }
    ];

    return (
        <div id="tour-support-main" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-6 pt-0 pb-6 space-y-8">
                {/* Upgrade Banner */}
                <Card className="border border-blue-200 bg-blue-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1">
                                        AD
                                    </Badge>
                                    <Crown className="h-4 w-4 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Don’t settle for limits when your business deserves the world.
                                </h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Get higher limits, priority digital support, and access to advanced tools for graphics, videos, podcasts, and websites.
                                    Strengthen your brand visibility, attract new customers, and accelerate your business growth with expert-level assistance.
                                </p>
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span>More Reels and Graphics</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="h-4 w-4 text-green-500" />
                                        <span>Faster Growth</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="h-4 w-4 text-purple-500" />
                                        <span>Own E-commerce Store</span>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-6 flex-shrink-0">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg">
                                    Upgrade Now
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Your Plan Heading */}
                <div id="tour-support-plan" className="flex items-center gap-3 mb-6">

                    <h2 className="text-2xl font-bold text-gray-900">Your Plan</h2>
                    <Badge className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1">
                        {merchant?.purchasedPackage?.variantName || 'No Plan available'}
                    </Badge>
                </div>

                {/* Support Services */}
                <Card id="tour-support-services" className="border border-gray-200">
                    {/* <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center">
                            <BarChart3 className="h-6 w-6 text-gray-700 mr-3" />
                            <CardTitle className="text-xl font-semibold text-gray-900">Available Support Services</CardTitle>
                        </div>
                    </CardHeader> */}
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {supportData.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={item.type} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 rounded-lg border border-gray-200 flex-shrink-0">
                                                <IconComponent className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                                                {'built' in item ? (
                                                    <div className="flex items-center space-x-2">
                                                        {(item as SupportItemWithBuilt).built ? (
                                                            <>
                                                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                                                                <span className="text-sm font-medium text-emerald-700">Built & Ready</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Globe className="h-5 w-5 text-gray-400" />
                                                                <span className="text-sm font-medium text-gray-500">Not Built Yet</span>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600">Usage</span>
                                                            <span className="text-gray-900 font-medium">
                                                                {(item as SupportItemWithLimits).used} / {(item as SupportItemWithLimits).total}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={((item as SupportItemWithLimits).used / (item as SupportItemWithLimits).total) * 100}
                                                            className="h-2"
                                                        />
                                                        <p className="text-xs text-gray-500">
                                                            {Math.round(((item as SupportItemWithLimits).used / (item as SupportItemWithLimits).total) * 100)}% utilized
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Request History */}
                <Card id="tour-support-history" className="border border-gray-200">
                    <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center">
                            <History className="h-6 w-6 text-gray-700 mr-3" />
                            <CardTitle className="text-xl font-semibold text-gray-900">Request History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {requests.map((request) => (
                                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-lg border flex-shrink-0 ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-gray-900 text-base">{request.title}</h4>
                                                {request.priority && (
                                                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(request.priority)}`}>
                                                        {request.priority}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{request.description}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Submitted: {new Date(request.submittedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                {request.completedAt && (
                                                    <div className="flex items-center gap-1 text-emerald-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Completed: {new Date(request.completedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                )}
                                                <span className={`text-sm font-medium capitalize ${getStatusColor(request.status)}`}>
                                                    {request.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {requests.length === 0 && (
                            <div className="text-center py-12">
                                <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                                <p className="text-gray-600">Your digital support request history will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}