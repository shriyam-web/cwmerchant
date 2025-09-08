'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 w-64 shadow-2xl border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">WhatsApp</span>
              </a>
              <a 
                href="tel:+919876543210"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Call Us</span>
              </a>
              <a 
                href="mailto:support@citywitty.com"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <Mail className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">Email</span>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}