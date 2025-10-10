'use client';

import { useState, useEffect, useMemo } from 'react';
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
    // Transform database data into request history format
    const requests = useMemo(() => {
        if (!merchant) return [];

        const allRequests: Request[] = [];

        // Add graphics requests
        if (merchant.ds_graphics && Array.isArray(merchant.ds_graphics)) {
            merchant.ds_graphics.forEach((graphic: any, index: number) => {
                allRequests.push({
                    id: graphic.graphicId || `graphic-${index}`,
                    type: 'graphics',
                    title: graphic.subject || 'Graphics Design Request',
                    description: graphic.content || 'Graphics design request',
                    status: graphic.status === 'completed' ? 'completed' : 'pending',
                    submittedAt: graphic.requestDate ? new Date(graphic.requestDate).toLocaleDateString() : 'N/A',
                    completedAt: graphic.completionDate ? new Date(graphic.completionDate).toLocaleDateString() : null,
                    priority: 'normal'
                });
            });
        }

        // Add reel requests
        if (merchant.ds_reel && Array.isArray(merchant.ds_reel)) {
            merchant.ds_reel.forEach((reel: any, index: number) => {
                allRequests.push({
                    id: reel.reelId || `reel-${index}`,
                    type: 'reels',
                    title: reel.subject || 'Video Reel Request',
                    description: reel.content || 'Video reel production request',
                    status: reel.status === 'completed' ? 'completed' : 'pending',
                    submittedAt: reel.requestDate ? new Date(reel.requestDate).toLocaleDateString() : 'N/A',
                    completedAt: reel.completionDate ? new Date(reel.completionDate).toLocaleDateString() : null,
                    priority: 'normal'
                });
            });
        }

        // Add podcast requests
        if (merchant.podcastLog && Array.isArray(merchant.podcastLog)) {
            merchant.podcastLog.forEach((podcast: any, index: number) => {
                allRequests.push({
                    id: `podcast-${index}`,
                    type: 'podcast',
                    title: podcast.title || 'Podcast Production Request',
                    description: 'Podcast recording and editing',
                    status: podcast.status === 'completed' ? 'completed' : podcast.status === 'scheduled' ? 'in_progress' : 'pending',
                    submittedAt: podcast.scheduleDate ? new Date(podcast.scheduleDate).toLocaleDateString() : 'N/A',
                    completedAt: podcast.completeDate ? new Date(podcast.completeDate).toLocaleDateString() : null,
                    priority: 'normal'
                });
            });
        }

        // Add website request if exists
        if (merchant.ds_weblog && Array.isArray(merchant.ds_weblog) && merchant.ds_weblog.length > 0) {
            merchant.ds_weblog.forEach((weblog: any, index: number) => {
                allRequests.push({
                    id: weblog.weblog_id || `website-${index}`,
                    type: 'website',
                    title: 'Website Development',
                    description: weblog.description || 'Website development request',
                    status: weblog.status === 'completed' ? 'completed' : 'pending',
                    submittedAt: 'N/A',
                    completedAt: weblog.completionDate ? new Date(weblog.completionDate).toLocaleDateString() : null,
                    priority: 'normal'
                });
            });
        }

        // Sort by date (most recent first)
        return allRequests.sort((a, b) => {
            const dateA = new Date(a.submittedAt).getTime();
            const dateB = new Date(b.submittedAt).getTime();
            return dateB - dateA;
        });
    }, [merchant]);

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

    // Enhanced support data with descriptions - dynamically calculated from merchant data
    const supportData: SupportItem[] = useMemo(() => {
        if (!merchant) {
            return [
                {
                    type: 'graphics',
                    title: 'Graphics Design',
                    total: 0,
                    used: 0,
                    icon: ImageIcon,
                    description: 'Professional banners, logos, and marketing graphics'
                },
                {
                    type: 'reels',
                    title: 'Video Reels',
                    total: 0,
                    used: 0,
                    icon: Video,
                    description: 'Engaging short-form videos for social media'
                },
                {
                    type: 'podcast',
                    title: 'Podcast Production',
                    total: 0,
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
        }

        // Calculate used graphics (completed + pending)
        const usedGraphics = merchant.ds_graphics ? merchant.ds_graphics.length : 0;
        const totalGraphics = merchant.totalGraphics || 0;

        // Calculate used reels (completed + pending)
        const usedReels = merchant.ds_reel ? merchant.ds_reel.length : 0;
        const totalReels = merchant.totalReels || 0;

        // Calculate used podcasts (completed + pending)
        const usedPodcasts = merchant.podcastLog ? merchant.podcastLog.length : 0;
        const totalPodcasts = merchant.totalPodcast || 0;

        // Check if website is built
        const isWebsiteBuilt = merchant.isWebsite || false;

        return [
            {
                type: 'graphics',
                title: 'Graphics Design',
                total: totalGraphics,
                used: usedGraphics,
                icon: ImageIcon,
                description: 'Professional banners, logos, and marketing graphics'
            },
            {
                type: 'reels',
                title: 'Video Reels',
                total: totalReels,
                used: usedReels,
                icon: Video,
                description: 'Engaging short-form videos for social media'
            },
            {
                type: 'podcast',
                title: 'Podcast Production',
                total: totalPodcasts,
                used: usedPodcasts,
                icon: Mic,
                description: 'Professional podcast recording and editing'
            },
            {
                type: 'website',
                title: 'Website Development',
                built: isWebsiteBuilt,
                icon: Globe,
                description: 'Custom website design and development'
            }
        ];
    }, [merchant]);

    return (
        <div id="tour-support-main" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-6 pt-0 pb-6 space-y-8">
                {/* Upgrade Banner */}
                <Card className="border border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1">
                                        AD
                                    </Badge>
                                    <Crown className="h-4 w-4 text-blue-600" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    Don’t settle for limits when your business deserves the world.
                                </h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Get higher limits, priority digital support, and access to advanced tools for graphics, videos, podcasts, and websites.
                                    Strengthen your brand visibility, attract new customers, and accelerate your business growth with expert-level assistance.
                                </p>
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
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
                            <div className="flex-shrink-0">
                                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg">
                                    Upgrade Now
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Your Plan Heading */}
                <div id="tour-support-plan" className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">

                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your Plan</h2>
                    <Badge className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1">
                        {merchant?.purchasedPackage?.variantName || 'No Plan available'}
                    </Badge>
                </div>

                {/* Support Services */}
                <Card id="tour-support-services" className="border border-gray-200">
                    {/* <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center">
                            <BarChart3 className="h-6 w-6 text-gray-700 mr-3" />
                            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Available Support Services</CardTitle>
                        </div>
                    </CardHeader> */}
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {supportData.map((item) => {
                                const IconComponent = item.icon;

                                // Check if service has 0 limit or is fully consumed
                                const isLimitExhausted = 'total' in item && (item.total === 0 || item.used >= item.total);
                                const cardBgClass = isLimitExhausted ? 'bg-red-50 border-red-300' : 'border-gray-200';

                                return (
                                    <div key={item.type} className={`border rounded-lg p-4 sm:p-6 ${cardBgClass}`}>
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
                                            <div className={`p-3 rounded-lg border flex-shrink-0 self-center sm:self-start ${isLimitExhausted ? 'border-red-300 bg-red-100' : 'border-gray-200'}`}>
                                                <IconComponent className={`h-6 w-6 ${isLimitExhausted ? 'text-red-600' : 'text-gray-600'}`} />
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
                                                    <>
                                                        {(item as SupportItemWithLimits).total === 0 ? (
                                                            <div className="space-y-3">
                                                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                    <div className="flex-shrink-0 mt-0.5">
                                                                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-red-800 mb-1">
                                                                            This isn't included in your plan
                                                                        </p>
                                                                        <p className="text-xs text-red-600">
                                                                            Upgrade now to avail this service
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-gray-600">Usage</span>
                                                                    <span className={`font-medium ${isLimitExhausted ? 'text-red-600' : 'text-gray-900'}`}>
                                                                        {(item as SupportItemWithLimits).used} / {(item as SupportItemWithLimits).total}
                                                                    </span>
                                                                </div>
                                                                <Progress
                                                                    value={(item as SupportItemWithLimits).total > 0 ? ((item as SupportItemWithLimits).used / (item as SupportItemWithLimits).total) * 100 : 0}
                                                                    className="h-2"
                                                                />
                                                                <div className="flex justify-between items-center">
                                                                    <p className={`text-xs ${isLimitExhausted ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                                        {(item as SupportItemWithLimits).total > 0 ? Math.round(((item as SupportItemWithLimits).used / (item as SupportItemWithLimits).total) * 100) : 0}% utilized
                                                                    </p>
                                                                    {isLimitExhausted && (
                                                                        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
                                                                            Limit Reached
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
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
                            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Request History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            {requests.map((request) => (
                                <div key={request.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
                                        <div className={`p-3 rounded-lg border flex-shrink-0 self-center sm:self-start ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
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
                            <div className="text-center py-8 sm:py-12">
                                <History className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                                <p className="text-gray-600">Your digital support request history will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}