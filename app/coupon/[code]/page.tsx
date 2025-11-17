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
  const config = themeConfig[coupon.theme || 'classic'] || themeConfig.classic;
  const address = [merchant.streetAddress, merchant.locality, merchant.city]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {merchant.logo && (
            <img
              src={merchant.logo}
              alt={merchant.displayName}
              className="h-16 mx-auto mb-4 rounded-lg shadow"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {merchant.displayName}
          </h1>
          <p className="text-gray-600">{merchant.category}</p>
          {address && <p className="text-sm text-gray-500 mt-1">{address}</p>}
        </div>

        {/* Status Banner */}
        {expired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">⚠️ This coupon has expired</p>
          </div>
        )}

        {coupon.status === 'inactive' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700 font-semibold">⚠️ This coupon is inactive</p>
          </div>
        )}

        {/* Coupon Card */}
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-xl shadow-2xl p-8 mb-8 border-2 ${expired ? 'border-red-200 opacity-75' : 'border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Discount Section */}
            <div className={`bg-gradient-to-br ${config.leftGradient} text-white rounded-lg p-8 flex flex-col justify-center items-center text-center`}>
              <p className="text-sm font-semibold opacity-90 mb-2">SAVE</p>
              <p className="text-5xl font-black mb-2">
                {coupon.discountType === 'percentage'
                  ? `${coupon.discountValue}%`
                  : `₹${coupon.discountValue}`}
              </p>
              <p className="text-lg font-bold">OFF</p>
            </div>

            {/* Coupon Code Section */}
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-3">
                Coupon Code
              </p>
              <p className="text-3xl font-mono font-black text-gray-900 tracking-wider mb-4 select-all">
                {coupon.code}
              </p>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="gap-2"
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
            <div className="flex flex-col justify-center space-y-3">
              {coupon.minPurchase && (
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold">Min Purchase</p>
                  <p className="text-lg font-bold text-gray-900">₹{coupon.minPurchase}</p>
                </div>
              )}
              {coupon.maxDiscount && (
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold">Max Discount</p>
                  <p className="text-lg font-bold text-gray-900">₹{coupon.maxDiscount}</p>
                </div>
              )}
              <div className="bg-white bg-opacity-60 rounded-lg p-3">
                <p className="text-xs text-gray-600 font-semibold">Valid Till</p>
                <p className={`text-lg font-bold ${expired ? 'text-red-600' : 'text-green-600'}`}>
                  {formatDateToDDMMYYYY(coupon.expiryDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Terms */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Terms & Conditions</h2>
            <ul className="space-y-2 text-sm text-gray-700">
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h2>
            <div className="space-y-3 text-sm">
              {merchant.phone && (
                <div>
                  <p className="text-gray-600 font-semibold">Phone</p>
                  <a
                    href={`tel:${merchant.phone}`}
                    className="text-blue-600 hover:underline"
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
                    className="text-blue-600 hover:underline"
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
                    className="text-blue-600 hover:underline"
                  >
                    Visit Site
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {!expired && coupon.status === 'active' && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleCopyCode}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg"
            >
              {copied ? '✓ Code Copied!' : 'Copy & Use Coupon'}
            </Button>
            <p className="text-gray-600 text-sm mt-3">
              Copy the coupon code and apply it during checkout
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by CityWitty</p>
        </div>
      </div>
    </div>
  );
}
