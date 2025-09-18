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
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useMerchantAuth } from '@/lib/auth-context'; // path adjust karo

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // Desktop dropdown
  const pathname = usePathname();
  const { merchant, logout } = useMerchantAuth();

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

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-15 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Citywitty Logo" className="w-full h-full object-contain" />
            </div>
            <img src="/logo2.png" alt="Citywitty Logo" className="w-32 h-16 object-contain" />
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth / Merchant */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {!merchant ? (
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
              <div
                className="cursor-pointer px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <span>{merchant.businessName}</span>
                <ChevronDown className="w-4 h-4" />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
                    <Link
                      href="/merchant/dashboard"
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      className="px-4 py-2 text-left hover:bg-gray-100"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
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

                {/* Links */}
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

                {/* Mobile Auth / Merchant */}
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
                      <span className="px-4 py-2 font-medium">{merchant.businessName}</span>
                      <Link
                        href="/merchant/dashboard"
                        className="px-4 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
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
    </nav>
  );
}
