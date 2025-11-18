'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiryDate: string;
  status: 'active' | 'inactive';
  usedCount?: number;
  theme?: string;
  couponType?: 'regular' | 'happy-hour';
  happyHourDays?: string[];
  happyHourStartTime?: string;
  happyHourEndTime?: string;
}

interface Merchant {
  id: string;
  displayName: string;
  businessName?: string;
  category: string;
  streetAddress: string;
  locality: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

const themeConfig: Record<string, any> = {
  classic: {
    leftGradient: 'from-blue-600 to-blue-700',
    bgGradient: 'from-blue-50 to-indigo-50',
    accentColor: '#1e40af',
  },
  friendship: {
    leftGradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    accentColor: '#9333ea',
  },
  love: {
    leftGradient: 'from-rose-600 to-red-600',
    bgGradient: 'from-rose-50 to-red-50',
    accentColor: '#e11d48',
  },
  gift: {
    leftGradient: 'from-pink-600 to-purple-600',
    bgGradient: 'from-pink-50 to-purple-50',
    accentColor: '#db2777',
  },
  'happy-hour': {
    leftGradient: 'from-orange-600 to-yellow-600',
    bgGradient: 'from-orange-50 to-yellow-50',
    accentColor: '#ea580c',
  },
};

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const isExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

const isHappyHourAvailable = (
  happyHourDays?: string[],
  happyHourStartTime?: string,
  happyHourEndTime?: string
): boolean => {
  if (!happyHourDays || !happyHourStartTime || !happyHourEndTime) return true;

  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  const isDayValid = !!happyHourDays.includes(currentDay);
  const isTimeValid = currentTime >= happyHourStartTime && currentTime <= happyHourEndTime;

  return isDayValid && isTimeValid;
};

const formatTimeRange = (startTime?: string, endTime?: string): string => {
  if (!startTime || !endTime) return '';
  return `${startTime} - ${endTime}`;
};

export default function CouponPage({ params }: { params: { code: string } }) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await fetch(`/api/coupon/${params.code}`);
        
        if (!response.ok) {
          setError('Coupon not found');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setCoupon(data.coupon);
        setMerchant(data.merchant);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching coupon:', err);
        setError('Failed to load coupon');
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [params.code]);

  const handleCopyCode = () => {
    if (coupon) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success('Coupon code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading coupon...</p>
        </div>
      </div>
    );
  }

  if (error || !coupon || !merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error || 'Coupon not found'}</p>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const expired = isExpired(coupon.expiryDate);
  const isHappyHour = coupon.couponType === 'happy-hour';
  const happyHourAvailable = isHappyHourAvailable(coupon.happyHourDays, coupon.happyHourStartTime, coupon.happyHourEndTime);
  const canBeRedeemed = !expired && coupon.status === 'active' && (!isHappyHour || happyHourAvailable);
  const config = themeConfig[coupon.theme || 'classic'] || themeConfig.classic;
  const address = [merchant.streetAddress, merchant.locality, merchant.city]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          {merchant.logo && (
            <img
              src={merchant.logo}
              alt={merchant.displayName}
              className="h-12 sm:h-14 md:h-16 lg:h-20 mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 rounded-lg shadow"
            />
          )}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">
            {merchant.displayName}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">{merchant.category}</p>
          {address && <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1 lg:mt-2">{address}</p>}
        </div>

        {/* Redemption Status Banner */}
        <div className={`rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6 border-2 ${canBeRedeemed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${canBeRedeemed ? 'text-green-700' : 'text-red-700'}`}>
            {canBeRedeemed ? (
              <>✅ Ready for Use</>
            ) : (
              <>❌ Cannot Be Redeemed</>
            )}
          </p>
          {isHappyHour && !happyHourAvailable && (
            <p className="text-xs sm:text-sm text-red-600 mt-1 sm:mt-2">
              This is a Happy Hour coupon. Available on {coupon.happyHourDays?.join(', ')} from {coupon.happyHourStartTime} to {coupon.happyHourEndTime}
            </p>
          )}
        </div>

        {/* Status Banner */}
        {expired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
            <p className="text-sm sm:text-base text-red-700 font-semibold">⚠️ This coupon has expired</p>
          </div>
        )}

        {coupon.status === 'inactive' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
            <p className="text-sm sm:text-base text-yellow-700 font-semibold">⚠️ This coupon is inactive</p>
          </div>
        )}

        {/* Coupon Card */}
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 ${expired ? 'border-red-200 opacity-75' : 'border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Discount Section */}
            <div className={`bg-gradient-to-br ${config.leftGradient} text-white rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center`}>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mb-1 sm:mb-2">SAVE</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2">
                {coupon.discountType === 'percentage'
                  ? `${coupon.discountValue}%`
                  : `₹${coupon.discountValue}`}
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold">OFF</p>
            </div>

            {/* Coupon Code Section */}
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-bold uppercase tracking-widest mb-2 sm:mb-3">
                Coupon Code
              </p>
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl md:text-3xl font-mono font-black text-gray-900 tracking-wider select-all">
                  {coupon.code}
                </span>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="gap-2 text-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center space-y-2 sm:space-y-3">
              {coupon.minPurchase && (
                <div className="bg-white bg-opacity-60 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-gray-600 font-semibold">Min Purchase</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">₹{coupon.minPurchase}</p>
                </div>
              )}
              {coupon.maxDiscount && (
                <div className="bg-white bg-opacity-60 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-gray-600 font-semibold">Max Discount</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">₹{coupon.maxDiscount}</p>
                </div>
              )}
              <div className="bg-white bg-opacity-60 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 font-semibold">Valid Till</p>
                <p className={`text-sm sm:text-lg font-bold ${expired ? 'text-red-600' : 'text-green-600'}`}>
                  {formatDateToDDMMYYYY(coupon.expiryDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Terms */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Terms & Conditions</h2>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
              {isHappyHour && (
                <>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">⏰</span>
                    <span className="font-semibold text-blue-700">Happy Hour Coupon</span>
                  </li>
                  <li className="flex items-start ml-6">
                    <span className="text-blue-600 mr-2">→</span>
                    Available on: {coupon.happyHourDays?.join(', ')}
                  </li>
                  <li className="flex items-start ml-6">
                    <span className="text-blue-600 mr-2">→</span>
                    Time: {formatTimeRange(coupon.happyHourStartTime, coupon.happyHourEndTime)}
                  </li>
                </>
              )}
              {coupon.minPurchase && (
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Minimum purchase of ₹{coupon.minPurchase} required
                </li>
              )}
              {coupon.maxDiscount && (
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Maximum discount capped at ₹{coupon.maxDiscount}
                </li>
              )}
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Valid till {formatDateToDDMMYYYY(coupon.expiryDate)}
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Cannot be combined with other offers
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Contact Info</h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {merchant.phone && (
                <div>
                  <p className="text-gray-600 font-semibold">Phone</p>
                  <a
                    href={`tel:${merchant.phone}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {merchant.phone}
                  </a>
                </div>
              )}
              {merchant.email && (
                <div>
                  <p className="text-gray-600 font-semibold">Email</p>
                  <a
                    href={`mailto:${merchant.email}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {merchant.email}
                  </a>
                </div>
              )}
              {merchant.website && (
                <div>
                  <p className="text-gray-600 font-semibold">Website</p>
                  <a
                    href={merchant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    Visit Site
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {canBeRedeemed && (
          <div className="mt-6 sm:mt-8 text-center">
            <Button
              onClick={handleCopyCode}
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold rounded-lg"
            >
              {copied ? '✓ Code Copied!' : 'Copy & Use Coupon'}
            </Button>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3">
              Copy the coupon code and apply it during checkout
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 sm:mt-8 md:mt-12 text-center text-gray-500 text-xs sm:text-sm">
          <p>Powered by CityWitty</p>
        </div>
      </div>
    </div>
  );
}
