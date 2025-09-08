'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Contact', href: '/support' },
    { name: 'Pricing Plans', href: '#support' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Branding */}
          <Link href="/" className="flex items-center space-x-3">
            {/* Logo Image Placeholder */}
            {/* <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden"> */}
            <div className="w-15 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              {/* Replace with your logo image */}
              <img src="/logo.png" alt="Citywitty Logo" className="w-full h-full object-contain" />
              {/* <span className="text-white font-bold text-lg">C</span> */}

            </div>
            {/* <span className="text-xl font-bold text-gray-900">Citywitty Merchant Hub</span> */}
            <img
              src="/logo2.png"
              alt="Citywitty Logo"
              className="w-32 h-16 object-contain"
            />


          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Register as Merchant
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <div className="flex flex-col h-full justify-between">

                {/* Header with Close */}
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {/* <img src="/logo.png" alt="Citywitty Logo" className="w-full h-full object-contain" /> */}
                      <span className="text-white font-bold">C</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">Citywitty</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="mt-8 flex flex-col space-y-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setIsOpen(false)}>
                      Register as Merchant
                    </Button>
                  </Link>
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
