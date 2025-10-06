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
    MessageCircle
} from 'lucide-react';

const faqs = [
    {
        question: "How do I add products to my store?",
        answer: "Go to the Products tab and click 'Add Product'. Fill in the details and save."
    },
    {
        question: "How do I create offers?",
        answer: "Navigate to the Offers tab and click 'Create Offer'. Set your discount and conditions."
    },
    {
        question: "How do I view purchase requests?",
        answer: "Check the Purchase Requests tab to see and manage customer requests."
    },
    {
        question: "How do I update my profile?",
        answer: "Go to Profile Settings to complete or update your business information."
    },
    {
        question: "When will my account be approved?",
        answer: "Account approval typically takes 24-48 hours after profile completion."
    }
];

export function SupportWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showFAQ, setShowFAQ] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isExpanded ? (
                <Card className="w-80 max-h-96 overflow-hidden shadow-lg border-2 border-blue-200">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-blue-600" />
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
                    <CardContent className="space-y-4">
                        {/* Contact Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">Call Support</span>
                            </div>
                            <a
                                href="tel:+919876543210"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium block"
                            >
                                +91 98765 43210
                            </a>
                            <p className="text-xs text-gray-600">Available: Mon-Fri, 9AM-6PM IST</p>
                        </div>

                        {/* FAQ Toggle */}
                        <div className="border-t pt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFAQ(!showFAQ)}
                                className="w-full justify-between p-0 h-auto text-left"
                            >
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Frequently Asked Questions
                                </span>
                                {showFAQ ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>

                            {showFAQ && (
                                <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                {faq.question}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsExpanded(true)}
                    className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg border-2 border-white"
                >
                    <HelpCircle className="h-6 w-6 text-white" />
                </Button>
            )}
        </div>
    );
}
