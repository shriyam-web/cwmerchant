// 'use client';
// // 'use client';
// import { useMerchantAuth } from '@/lib/auth-context';
// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
// import { Navbar } from '@/components/navbar';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Prepare payload
//       const payload = { email, password };

//       // Send login request
//       const response = await fetch("/api/merchant/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       // Handle errors from server
//       if (!response.ok) {
//         const errorMsg = result.error || "Login failed. Please try again.";
//         alert(errorMsg);
//         return;
//       }

//       // Save merchant info and token to localStorage
//       localStorage.setItem("merchantToken", result.token);
//       localStorage.setItem("merchant", JSON.stringify(result.merchant));

//       // Redirect to dashboard
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Something went wrong. Please check your network or try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       <Navbar />

//       <div className="flex flex-1 pt-10">
//         {/* Left branding / illustration section */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white items-center justify-center relative overflow-hidden">
//           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
//           <div className="relative z-10 max-w-md text-center p-10">
//             <h1 className="text-3xl font-extrabold mb-4">
//               CityWitty Merchant Hub
//             </h1>
//             <p className="text-lg text-indigo-100 mb-6">
//               Grow your business with digital presence, local visibility, and e-commerce tools.
//               Login to manage your journey 🚀
//             </p>
//             <img
//               src="/Asset-1-1.png"
//               alt="Merchant Growth"
//               className="w-164 mx-auto drop-shadow-xl"
//             />
//           </div>
//         </div>

//         {/* Right login form */}
//         <div className="flex-1 flex items-center justify-center px-6 mb-2 mt-3 pt-7">
//           <div className="w-full max-w-md">
//             <Link
//               href="/"
//               className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Back to Home</span>
//             </Link>

//             <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-100">
//               <div className="text-center mb-8">
//                 <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
//                   <Lock className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
//                 <p className="text-gray-600 mt-2">
//                   Sign in to your merchant dashboard
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Email */}
//                 <div>
//                   <Label htmlFor="email">Business Email *</Label>
//                   <div className="relative mt-1">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <Input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter your email"
//                       className="pl-10 pr-3 h-12 text-base"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <Label htmlFor="password">Password *</Label>
//                   <div className="relative mt-1">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Enter your password"
//                       className="pl-10 pr-10 h-12 text-base"
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       onClick={() => setShowPassword(!showPassword)}
//                       tabIndex={-1}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <Link
//                     href="/forgot-password"
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg transition-all"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </form>

//               <div className="text-center mt-8">
//                 <p className="text-gray-600">
//                   Don&apos;t have an account?{" "}
//                   <Link
//                     href="/register"
//                     className="text-blue-600 hover:underline font-medium"
//                   >
//                     Register as Merchant
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useMerchantAuth } from '@/lib/auth-context';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function Login() {
  const { login } = useMerchantAuth(); // context login method
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password); // ✅ use context
      if (success) {
        router.push('/dashboard'); // redirect on success
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="flex flex-1 pt-10">
        {/* Left branding section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative z-10 max-w-md text-center p-10">
            <h1 className="text-3xl font-extrabold mb-4">CityWitty Merchant Hub</h1>
            <p className="text-lg text-indigo-100 mb-6">
              Grow your business with digital presence, local visibility, and e-commerce tools. Login to manage your journey 🚀
            </p>
            <img
              src="/Asset-1-1.png"
              alt="Merchant Growth"
              className="w-164 mx-auto drop-shadow-xl"
            />
          </div>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center px-6 mb-2 mt-3 pt-7">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to your merchant dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 pr-3 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 text-base"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Register link */}
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Register as Merchant
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
