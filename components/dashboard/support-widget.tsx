'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle,
    Phone,
    ChevronUp,
    ChevronDown,
    MessageCircle,
    Mail,
    ExternalLink,
    Clock,
    CheckCircle,
    AlertCircle,
    Zap,
    Image,
    Video,
    Mic,
    Globe,
    FileText,
    CreditCard,
    User,
    Settings
} from 'lucide-react';

const faqs = [
    {
        category: "Getting Started",
        questions: [
            {
                question: "How do I add products to my store?",
                answer: "Go to the Products tab and click 'Add Product'. Fill in the product details, pricing, and images, then save."
            },
            {
                question: "How do I create offers and discounts?",
                answer: "Navigate to the Offers tab and click 'Create Offer'. Set your discount percentage, conditions, and validity period."
            },
            {
                question: "How do I update my business profile?",
                answer: "Go to Profile Settings to complete or update your business information, contact details, and store preferences."
            },
            {
                question: "When will my account be approved?",
                answer: "Account approval typically takes 24-48 hours after profile completion. You'll receive an email notification once approved."
            }
        ]
    },
    {
        category: "Digital Support Services",
        questions: [
            {
                question: "What digital support services are available?",
                answer: "We offer Graphics Design, Video Reels, Podcast Production, and Website Development services based on your package."
            },
            {
                question: "How do I request graphics design services?",
                answer: "Visit the Digital Support tab, check your Graphics Design usage, and submit a new request with your requirements."
            },
            {
                question: "Can I create video reels for social media?",
                answer: "Yes! Use our Video Reels service to create engaging short-form videos. Check your package limits in Digital Support."
            },
            {
                question: "Do you help with podcast production?",
                answer: "Absolutely! Our Podcast Production service includes recording, editing, and post-production. Schedule through Digital Support."
            },
            {
                question: "Can you build a website for my business?",
                answer: "Yes, we offer custom Website Development services. Check your plan status in Digital Support to see if this is included."
            }
        ]
    },
    {
        category: "Orders & Customers",
        questions: [
            {
                question: "How do I view and manage purchase requests?",
                answer: "Check the Purchase Requests tab to see customer orders, update status, and manage fulfillment."
            },
            {
                question: "How do I handle customer inquiries?",
                answer: "Use the Messages tab to communicate with customers. All conversations are tracked and organized by order."
            },
            {
                question: "Can I export my order data?",
                answer: "Yes, go to Reports section to export order history, customer data, and sales analytics in various formats."
            }
        ]
    },
    {
        category: "Billing & Packages",
        questions: [
            {
                question: "How do I upgrade my package?",
                answer: "Visit the Billing section or contact support to upgrade your plan and unlock more digital support services."
            },
            {
                question: "What happens when I reach my service limits?",
                answer: "You'll see a 'Limit Reached' indicator. Upgrade your package to increase limits or contact support for assistance."
            },
            {
                question: "How do I view my current usage?",
                answer: "Check the Digital Support tab to see your current usage for Graphics, Reels, Podcasts, and Website services."
            }
        ]
    },
    {
        category: "Technical Support",
        questions: [
            {
                question: "I'm having trouble uploading images",
                answer: "Ensure images are under 5MB and in JPG/PNG format. Clear your browser cache and try again, or contact support."
            },
            {
                question: "How do I reset my password?",
                answer: "Click 'Forgot Password' on the login page, or go to Profile Settings > Security to change your password."
            },
            {
                question: "The dashboard is loading slowly",
                answer: "Try clearing your browser cache, use a modern browser (Chrome/Firefox), or contact support if issues persist."
            }
        ]
    }
];

const quickLinks = [
    {
        title: "Digital Support",
        description: "Request graphics, videos, podcasts & websites",
        icon: Zap,
        href: "/dashboard?tab=support",
        color: "text-blue-600 dark:text-blue-400"
    },
    {
        title: "Add Product",
        description: "Add new products to your store",
        icon: FileText,
        href: "/dashboard?tab=products",
        color: "text-green-600 dark:text-green-400"
    },
    {
        title: "View Orders",
        description: "Check purchase requests & orders",
        icon: CreditCard,
        href: "/dashboard?tab=requests",
        color: "text-purple-600 dark:text-purple-400"
    },
    {
        title: "Profile Settings",
        description: "Update your business information",
        icon: User,
        href: "/dashboard?tab=profile",
        color: "text-orange-600 dark:text-orange-400"
    }
];

const serviceStatus = [
    { service: "Platform", status: "operational", icon: CheckCircle },
    { service: "Digital Support", status: "operational", icon: CheckCircle },
    { service: "Payment Processing", status: "operational", icon: CheckCircle },
    { service: "API Services", status: "operational", icon: CheckCircle }
];

export function SupportWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showQuickLinks, setShowQuickLinks] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isExpanded ? (
                <Card className="w-96 max-h-[80vh] overflow-hidden shadow-xl border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Support Center
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsExpanded(false)}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-y-auto max-h-[70vh]">
                        {/* Contact Methods */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Contact Support
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                <a
                                    href="tel:+919336458109"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors group"
                                >
                                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">Call Support</span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">+91 93364 58109</p>
                                    </div>
                                </a>
                                <a
                                    href="mailto:support@citywitty.com"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group"
                                >
                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Email Support</span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">support@citywitty.com</p>
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/919336458109"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors group"
                                >
                                    <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">WhatsApp</span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Quick chat support</p>
                                    </div>
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-2 rounded border border-blue-100 dark:border-blue-900">
                                <Clock className="h-3 w-3" />
                                <span>Mon-Fri: 9AM-6PM IST | Sat: 9AM-2PM IST</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="border-t pt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowQuickLinks(!showQuickLinks)}
                                className="w-full justify-between p-0 h-auto text-left mb-2"
                            >
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Quick Links
                                </span>
                                {showQuickLinks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>

                            {showQuickLinks && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {quickLinks.map((link, index) => {
                                        const IconComponent = link.icon;
                                        return (
                                            <a
                                                key={index}
                                                href={link.href}
                                                className="flex flex-col items-center p-3 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                                            >
                                                <IconComponent className={`h-5 w-5 mb-1 ${link.color}`} />
                                                <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                                    {link.title}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">
                                                    {link.description}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Service Status */}
                        <div className="border-t pt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowStatus(!showStatus)}
                                className="w-full justify-between p-0 h-auto text-left mb-2"
                            >
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    System Status
                                </span>
                                {showStatus ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>

                            {showStatus && (
                                <div className="space-y-2 mt-2">
                                    {serviceStatus.map((service, index) => {
                                        const IconComponent = service.icon;
                                        return (
                                            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/40 rounded border border-blue-100 dark:border-blue-900">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{service.service}</span>
                                                <div className="flex items-center gap-1">
                                                    <IconComponent className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                    <span className="text-xs text-green-700 dark:text-green-400 capitalize">{service.status}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className="border-t pt-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                                <MessageCircle className="h-4 w-4" />
                                Help & FAQs
                            </h4>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {faqs.map((category, categoryIndex) => (
                                    <div key={categoryIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setActiveCategory(activeCategory === category.category ? null : category.category)}
                                            className="w-full justify-between p-3 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-900/40"
                                        >
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.category}</span>
                                            {activeCategory === category.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>

                                        {activeCategory === category.category && (
                                            <div className="px-3 pb-3 space-y-2">
                                                {category.questions.map((faq, faqIndex) => (
                                                    <div key={faqIndex} className="bg-blue-50 dark:bg-blue-950/30 rounded p-3 border border-blue-100 dark:border-blue-900">
                                                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                            {faq.question}
                                                        </h5>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsExpanded(true)}
                    className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg border-2 border-white"
                >
                    <HelpCircle className="h-6 w-6 text-white" />
                </Button>
            )}
        </div>
    );
}
