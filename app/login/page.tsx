'use client';

import { useMerchantAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { toast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'citywittymerchant@gmail.com';

export default function Login() {
  const { login, loading, error } = useMerchantAuth();
  const router = useRouter();

  // Standard login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Remote access fields
  const [isRemoteAccess, setIsRemoteAccess] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Detect admin email
  useEffect(() => {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
    setIsRemoteAccess(isAdmin);

    if (!isAdmin) {
      // Reset remote access state when switching away from admin email
      setOtpSent(false);
      setOtp('');
      setMerchantId('');
      setOtpTimer(0);
    }
  }, [email]);

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Standard merchant login
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  // Send OTP for remote access
  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      const response = await fetch('/api/auth/remote-access/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setOtpTimer(600); // 10 minutes
      toast({
        title: 'OTP Sent',
        description: 'Check your email for the verification code',
      });
    } catch (error) {
      toast({
        title: 'Failed to send OTP',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP and login to merchant account
  const handleRemoteAccessLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      toast({
        title: 'OTP Required',
        description: 'Please request an OTP first',
        variant: 'destructive',
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await fetch('/api/auth/remote-access/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, merchantId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Store token and merchant data
      localStorage.setItem('merchantToken', data.token);
      localStorage.setItem('merchant', JSON.stringify(data.merchant));

      toast({
        title: 'Remote Access Granted',
        description: `Logged in as ${data.merchant.businessName}`,
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
        window.location.reload(); // Force refresh to update auth context
      }, 500);
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Please check your OTP and Merchant ID',
        variant: 'destructive',
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    setOtpSent(false);
    await handleSendOtp();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="flex flex-1 pt-10">
        {/* Left branding section */}
        <div className={`hidden lg:flex lg:w-1/2 ${isRemoteAccess
          ? 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600'
          : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600'
          } text-white items-center justify-center relative overflow-hidden transition-all duration-500`}>
          <div className="absolute inset-0 opacity-20" />
          <div className="relative z-10 max-w-md text-center p-10">
            <h1 className="text-3xl font-extrabold mb-4">
              {isRemoteAccess ? 'CityWitty Admin Access' : 'CityWitty Merchant Hub'}
            </h1>
            <p className="text-lg text-indigo-100 mb-6">
              {isRemoteAccess
                ? 'Secure remote access system for administrative support and merchant account management.'
                : 'Grow your business with digital presence, local visibility, and e-commerce tools. Login to manage your journey 🚀'}
            </p>
            <img src="/Asset-1-1.png" alt="Merchant Growth" className="w-164 mx-auto drop-shadow-xl" />
          </div>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center px-6 mb-2 mt-2 pt-7">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${isRemoteAccess
                  ? 'bg-gradient-to-br from-orange-100 to-red-100'
                  : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                  } rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner transition-all duration-300`}>
                  {isRemoteAccess ? (
                    <Shield className="h-8 w-8 text-orange-600" />
                  ) : (
                    <Lock className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {isRemoteAccess ? 'Remote Access' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isRemoteAccess
                    ? 'Administrative login with OTP verification'
                    : 'Sign in to your merchant dashboard'}
                </p>
              </div>

              {/* Security warning for remote access */}
              {isRemoteAccess && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Privileged Access Mode</p>
                    <p className="text-xs text-orange-700 mt-1">
                      OTP verification required for merchant account access
                    </p>
                  </div>
                </div>
              )}

              {/* Form - Standard or Remote Access */}
              <form onSubmit={isRemoteAccess ? handleRemoteAccessLogin : handleStandardLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email">
                    {isRemoteAccess ? 'Admin Email *' : 'Business Email *'}
                  </Label>
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
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {/* Conditional fields based on login type */}
                {isRemoteAccess ? (
                  <>
                    {/* Merchant ID */}
                    <div>
                      <Label htmlFor="merchantId">Merchant ID *</Label>
                      <Input
                        id="merchantId"
                        type="text"
                        value={merchantId}
                        onChange={(e) => setMerchantId(e.target.value)}
                        placeholder="Enter target merchant ID"
                        className="h-12 text-base"
                        required
                      />
                    </div>

                    {/* OTP */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="otp">Verification Code *</Label>
                        {otpTimer > 0 && (
                          <span className="text-xs text-gray-500">
                            Expires in {formatTime(otpTimer)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit code"
                          className="h-12 text-base text-center tracking-widest font-mono text-lg"
                          required
                          maxLength={6}
                          disabled={!otpSent}
                        />
                        {!otpSent ? (
                          <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || !email}
                            className="h-12 px-6 bg-orange-600 hover:bg-orange-700"
                          >
                            {sendingOtp ? 'Sending...' : 'Send OTP'}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={sendingOtp || otpTimer > 540}
                            variant="outline"
                            className="h-12 px-6"
                          >
                            Resend
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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

                    {/* Forgot password link */}
                    <div className="flex items-center justify-end">
                      <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </>
                )}

                {/* Error message */}
                {error && !isRemoteAccess && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className={`w-full h-12 text-lg font-medium rounded-xl shadow-lg transition-all ${isRemoteAccess
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  disabled={isRemoteAccess ? (verifyingOtp || !otpSent) : loading}
                >
                  {isRemoteAccess
                    ? (verifyingOtp ? 'Verifying...' : 'Verify & Login')
                    : (loading ? 'Signing in...' : 'Sign In')}
                </Button>
              </form>

              {/* Register link - only for standard login */}
              {!isRemoteAccess && (
                <div className="text-center mt-8">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                      Register as Merchant
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
