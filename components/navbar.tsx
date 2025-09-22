// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { usePathname } from "next/navigation";
// import { Menu, X } from 'lucide-react';

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();
//   const navigation = [
//     { name: 'Home', href: '/' },
//     { name: 'About ', href: '/about' },
//     { name: 'Categories', href: '/categories' },
//     { name: 'Success Stories', href: '/success-stories' },
//     { name: 'Contact', href: '/contact' },
//     { name: 'Pricing Plans', href: '/merchant-packages' },
//   ];

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
//       <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo / Branding */}
//           <Link href="/" className="flex items-center space-x-3">
//             {/* Logo Image Placeholder */}
//             {/* <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden"> */}
//             <div className="w-15 h-10 rounded-xl flex items-center justify-center overflow-hidden">
//               {/* Replace with your logo image */}
//               <img src="/logo.png" alt="Citywitty Logo" className="w-full h-full object-contain" />
//               {/* <span className="text-white font-bold text-lg">C</span> */}

//             </div>
//             {/* <span className="text-xl font-bold text-gray-900">Citywitty Merchant Hub</span> */}
//             <img
//               src="/logo2.png"
//               alt="Citywitty Logo"
//               className="w-32 h-16 object-contain"
//             />


//           </Link>

//           {/* Desktop Navigation */}
//           {/* <div className="hidden md:flex items-center space-x-9">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div> */}
//           <div className="hidden md:flex items-center space-x-3">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href; // 👈 current route check
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`transition-all px-3 py-1.5 rounded-lg font-medium ${isActive
//                     ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
//                     : "text-gray-600 hover:text-blue-600"
//                     }`}
//                 >
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </div>


//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-2">
//             <Link href="/login">
//               <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
//                 Login
//               </Button>
//             </Link>
//             <Link href="/register">
//               <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
//                 Register as Merchant
//               </Button>
//             </Link>
//           </div>

//           {/* Mobile Menu */}
//           <Sheet open={isOpen} onOpenChange={setIsOpen}>
//             <SheetTrigger asChild className="md:hidden">
//               <Button variant="ghost" size="sm">
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>

//             <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
//               <div className="flex flex-col h-full justify-between">

//                 {/* Header with Close */}
//                 <div className="flex items-center justify-between mb-8">
//                   <Link href="/" className="flex items-center space-x-2">
//                     <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
//                       {/* <img src="/logo.png" alt="Citywitty Logo" className="w-full h-full object-contain" /> */}
//                       <span className="text-white font-bold">C</span>
//                     </div>
//                     <span className="font-bold text-gray-900 text-lg">CW Merchant Hub</span>
//                   </Link>
//                   {/* <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
//                     <X className="h-6 w-6" />
//                   </Button> */}
//                 </div>

//                 {/* Navigation Links */}
//                 {/* <div className="flex flex-col space-y-4">
//                   {navigation.map((item) => (
//                     <Link
//                       key={item.name}
//                       href={item.href}
//                       className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       {item.name}
//                     </Link>
//                   ))}
//                 </div> */}
//                 <div className="flex flex-col space-y-4">
//                   {navigation.map((item) => {
//                     const isActive = pathname === item.href;
//                     return (
//                       <Link
//                         key={item.name}
//                         href={item.href}
//                         className={`transition-all font-medium py-2 px-3 rounded-md ${isActive
//                           ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//                           : "text-gray-600 hover:text-blue-600"
//                           }`}
//                         onClick={() => setIsOpen(false)}
//                       >
//                         {item.name}
//                       </Link>
//                     );
//                   })}
//                 </div>

//                 {/* Auth Buttons */}
//                 <div className="mt-8 flex flex-col space-y-4">
//                   <Link href="/login">
//                     <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
//                       Login
//                     </Button>
//                   </Link>
//                   <Link href="/register">
//                     <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setIsOpen(false)}>
//                       Register as Merchant
//                     </Button>
//                   </Link>
//                 </div>

//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </nav>
//   );
// }

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useMerchantAuth } from '@/lib/auth-context'; // path adjust karo
import { useEffect, useRef } from "react";



export function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // Desktop dropdown
  const pathname = usePathname();
  const { merchant, logout, loadingProfile } = useMerchantAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target as Node)) {
        setMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstWord = merchant?.businessName?.split(" ")[0];
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Categories', href: '/categories' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Contact', href: '/contact' },
    { name: 'Pricing Plans', href: '/merchant-packages' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* ===== Logo ===== */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-17 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/merchant-hub.png" alt="Citywitty Logo" className="w-full h-full object-contain p-1" />
            </div>
          </Link>

          {/* ===== Desktop Navigation ===== */}
          <div className="hidden md:flex items-center space-x-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-all px-3 py-1.5 rounded-lg font-medium ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* ===== Desktop Auth / Merchant ===== */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {loadingProfile ? (
              <span className="text-gray-500">Loading...</span>
            ) : !merchant ? (
              <>
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
              </>
            ) : (
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() => setDesktopDropdownOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center gap-2 shadow-lg transition-all p-3 ml-2 mt-1 mb-1 pt-1 pb-1"
                >
                  Hey, {firstWord} <ChevronDown className="w-4 h-4" />
                </button>

                {desktopDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:text-white transition-all"
                      onClick={() => setDesktopDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
                      onClick={() => {
                        logout();
                        setDesktopDropdownOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>


            )}
          </div>

          {/* ===== Mobile Right Section (Auth + Burger) ===== */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile Auth / Merchant */}
            {loadingProfile ? (
              <span className="text-gray-500 text-sm">Loading...</span>
            ) : !merchant ? (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={() => setMobileDropdownOpen((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center gap-1 shadow"
                >
                  Hey, {firstWord}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {mobileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setMobileDropdownOpen(false)}
                    >
                      Merchant Dashboard
                    </Link>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
                      onClick={() => {
                        logout();
                        setMobileDropdownOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 [&>button]:hidden">
                <div className="flex flex-col h-full justify-between">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        <span className="text-white font-bold">C</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">CW Merchant Hub</span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-4">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`transition-all font-medium py-2 px-3 rounded-md ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'text-gray-600 hover:text-blue-600'
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Auth / Merchant Inside Drawer */}
                  <div className="mt-8 flex flex-col space-y-4">
                    {!merchant ? (
                      <>
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
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <span className="px-4 py-2 font-medium">Hey, {firstWord}</span>

                        <Link
                          href="/dashboard"
                          className="px-4 py-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          Merchant Dashboard
                        </Link>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </nav>
  );
}
