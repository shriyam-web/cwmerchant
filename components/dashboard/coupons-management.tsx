'use client';

import { useState, useEffect } from 'react';
import { useMerchantAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, QrCode, Loader2, Tag, Calendar, Percent, IndianRupee, ChevronDown, ChevronRight, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface Coupon {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiryDate: string;
  usedCount: number;
  status: 'active' | 'inactive';
  qrCodeData?: string;
  userId?: string;
  isRestricted?: boolean;
  seriesId?: string;
  sequence?: number;
  seriesNote?: string;
  theme?: 'classic' | 'friendship' | 'love' | 'gift' | 'festival' | 'sale' | 'emoji' | 'first-time' | 'missed-you' | 'birthday' | 'holiday' | 'seasonal' | 'weekend' | 'student' | 'senior' | 'bulk' | 'flash' | 'members' | 'loyalty' | 'launch' | 'bonus';
}

interface CouponsManagementProps {
  onCouponsChange?: () => void;
}

// Utility functions for date formatting
const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateRandomCode = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CWC-${randomPart}`;
};

const generateMultipleCodes = (count: number, merchantId?: string): string[] => {
  const codes: string[] = [];
  const padding = Math.max(3, count.toString().length);
  const uniquePrefix = merchantId ? merchantId.slice(-6).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  for (let i = 1; i <= count; i++) {
    const sequentialPart = i.toString().padStart(padding, '0');
    codes.push(`CWC-${uniquePrefix}-${timestamp}-${sequentialPart}`);
  }
  return codes;
};

const themeConfig: Record<string, any> = {
  classic: {
    leftGradient: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-200',
    bgGradient: 'from-blue-50 to-indigo-50',
    accentColor: '#1e40af',
    leftAccent: '#1e40af',
    emoji: '🎫',
    title: 'CLASSIC',
  },
  friendship: {
    leftGradient: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-200',
    bgGradient: 'from-purple-50 to-pink-50',
    accentColor: '#9333ea',
    leftAccent: '#9333ea',
    emoji: '👯',
    title: 'FRIEND SPECIAL',
  },
  love: {
    leftGradient: 'from-rose-600 to-red-600',
    borderColor: 'border-rose-200',
    bgGradient: 'from-rose-50 to-red-50',
    accentColor: '#e11d48',
    leftAccent: '#e11d48',
    emoji: '💕',
    title: 'LOVE OFFER',
  },
  gift: {
    leftGradient: 'from-yellow-500 to-orange-600',
    borderColor: 'border-yellow-200',
    bgGradient: 'from-yellow-50 to-orange-50',
    accentColor: '#f59e0b',
    leftAccent: '#f59e0b',
    emoji: '🎁',
    title: 'GIFT VOUCHER',
  },
  festival: {
    leftGradient: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-200',
    bgGradient: 'from-orange-50 to-red-50',
    accentColor: '#ea580c',
    leftAccent: '#ea580c',
    emoji: '🎉',
    title: 'FESTIVAL OFFER',
  },
  sale: {
    leftGradient: 'from-red-600 to-red-700',
    borderColor: 'border-red-300',
    bgGradient: 'from-red-50 to-pink-50',
    accentColor: '#dc2626',
    leftAccent: '#dc2626',
    emoji: '🔥',
    title: 'MEGA SALE',
  },
  emoji: {
    leftGradient: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-200',
    bgGradient: 'from-cyan-50 to-blue-50',
    accentColor: '#0891b2',
    leftAccent: '#0891b2',
    emoji: '😊',
    title: 'SPECIAL DEAL',
  },
  'first-time': {
    leftGradient: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-200',
    bgGradient: 'from-indigo-50 to-purple-50',
    accentColor: '#4f46e5',
    leftAccent: '#4f46e5',
    emoji: '🌟',
    title: 'WELCOME OFFER',
  },
  'missed-you': {
    leftGradient: 'from-teal-600 to-green-600',
    borderColor: 'border-teal-200',
    bgGradient: 'from-teal-50 to-green-50',
    accentColor: '#0d9488',
    leftAccent: '#0d9488',
    emoji: '💚',
    title: 'MISSED YOU',
  },
  birthday: {
    leftGradient: 'from-pink-500 to-purple-500',
    borderColor: 'border-pink-200',
    bgGradient: 'from-pink-50 to-purple-50',
    accentColor: '#ec4899',
    leftAccent: '#ec4899',
    emoji: '🎂',
    title: 'BIRTHDAY BASH',
  },
  holiday: {
    leftGradient: 'from-emerald-600 to-blue-600',
    borderColor: 'border-emerald-200',
    bgGradient: 'from-emerald-50 to-blue-50',
    accentColor: '#059669',
    leftAccent: '#059669',
    emoji: '🏖️',
    title: 'HOLIDAY SPECIAL',
  },
  seasonal: {
    leftGradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-200',
    bgGradient: 'from-amber-50 to-orange-50',
    accentColor: '#d97706',
    leftAccent: '#d97706',
    emoji: '🌸',
    title: 'SEASONAL SALE',
  },
  weekend: {
    leftGradient: 'from-fuchsia-600 to-purple-600',
    borderColor: 'border-fuchsia-200',
    bgGradient: 'from-fuchsia-50 to-purple-50',
    accentColor: '#d946ef',
    leftAccent: '#d946ef',
    emoji: '🎊',
    title: 'WEEKEND OFFER',
  },
  student: {
    leftGradient: 'from-sky-500 to-cyan-600',
    borderColor: 'border-sky-200',
    bgGradient: 'from-sky-50 to-cyan-50',
    accentColor: '#0ea5e9',
    leftAccent: '#0ea5e9',
    emoji: '🎓',
    title: 'STUDENT DISCOUNT',
  },
  senior: {
    leftGradient: 'from-yellow-500 to-amber-600',
    borderColor: 'border-yellow-200',
    bgGradient: 'from-yellow-50 to-amber-50',
    accentColor: '#ca8a04',
    leftAccent: '#ca8a04',
    emoji: '👴',
    title: 'SENIOR SPECIAL',
  },
  bulk: {
    leftGradient: 'from-red-600 to-orange-600',
    borderColor: 'border-red-200',
    bgGradient: 'from-red-50 to-orange-50',
    accentColor: '#dc2626',
    leftAccent: '#dc2626',
    emoji: '📦',
    title: 'BULK BUY SAVE',
  },
  flash: {
    leftGradient: 'from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-300',
    bgGradient: 'from-yellow-50 to-orange-50',
    accentColor: '#eab308',
    leftAccent: '#eab308',
    emoji: '⚡',
    title: 'FLASH SALE',
  },
  members: {
    leftGradient: 'from-purple-600 to-indigo-600',
    borderColor: 'border-purple-200',
    bgGradient: 'from-purple-50 to-indigo-50',
    accentColor: '#7c3aed',
    leftAccent: '#7c3aed',
    emoji: '👑',
    title: 'MEMBERS ONLY',
  },
  loyalty: {
    leftGradient: 'from-yellow-600 to-yellow-500',
    borderColor: 'border-yellow-300',
    bgGradient: 'from-yellow-50 to-amber-50',
    accentColor: '#eab308',
    leftAccent: '#eab308',
    emoji: '💎',
    title: 'LOYALTY REWARD',
  },
  launch: {
    leftGradient: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-200',
    bgGradient: 'from-violet-50 to-purple-50',
    accentColor: '#7c3aed',
    leftAccent: '#7c3aed',
    emoji: '🚀',
    title: 'NEW LAUNCH',
  },
  bonus: {
    leftGradient: 'from-lime-500 to-green-600',
    borderColor: 'border-lime-200',
    bgGradient: 'from-lime-50 to-green-50',
    accentColor: '#65a30d',
    leftAccent: '#65a30d',
    emoji: '🎁',
    title: 'BONUS OFFER',
  },
};

const CouponCard = ({
  coupon,
  sortedCoupons,
  theme = 'classic',
  onGenerateQR,
  onEdit,
  onDelete,
  isPreview = false,
  onDownload,
  onShare,
}: {
  coupon: Coupon;
  sortedCoupons: Coupon[];
  theme?: string;
  onGenerateQR: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  isPreview?: boolean;
  onDownload?: (coupon: Coupon) => void;
  onShare?: (coupon: Coupon) => void;
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const config = themeConfig[theme] || themeConfig.classic;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = `https://www.citywitty.com/coupon/${coupon.code}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
          width: 100,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        });
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQR();
  }, [coupon.code]);
  
  return (
    <div className="flex gap-3 items-center">
      <div
        id={`coupon-visual-${coupon._id}`}
        className={`relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow`}
        style={{
          minHeight: '140px',
          width: '680px',
          borderRadius: '3px',
          background: 'linear-gradient(135deg, #fefdfb 0%, #faf9f7 50%, #f5f4f2 100%)',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
        }}
      >
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(200,200,200,0.03) 2px, rgba(200,200,200,0.03) 4px),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,200,200,0.02) 2px, rgba(200,200,200,0.02) 4px)
          `,
          pointerEvents: 'none'
        }}></div>

        <p className="absolute top-2.5 right-3 text-xs text-gray-400 font-semibold z-10">Powered by CityWitty</p>
        
        <div className="flex h-full relative z-5">
          <div 
            className={`w-44 flex-shrink-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br ${config.leftGradient} text-white relative overflow-hidden`}
            style={{
              boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.15), inset 3px 0 8px rgba(255,255,255,0.1)'
            }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.08) 10px, rgba(0,0,0,0.08) 11px),
                repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)
              `,
              mixBlendMode: 'overlay'
            }}></div>
            
            {config.emoji && (
              <p className="text-6xl mb-2 relative z-10 drop-shadow-lg">{config.emoji}</p>
            )}
            <p className="text-xs font-bold tracking-widest mb-2 relative z-10 text-white opacity-95">{config.title || 'SAVE'}</p>
            <div className="text-5xl font-black text-center leading-tight relative z-10" style={{ 
              textShadow: '0 3px 6px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.2)'
            }}>
              {coupon.discountType === 'percentage'
                ? `${coupon.discountValue}%`
                : `₹${coupon.discountValue}`
              }
            </div>
            <p className="text-sm mt-1.5 font-bold relative z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>OFF</p>
          </div>

          <svg className="absolute top-0 bottom-0" width="2" height="100%" style={{ left: '176px', zIndex: 5 }} preserveAspectRatio="none">
            <defs>
              <pattern id="dashed" x="0" y="0" width="8" height="100%" patternUnits="userSpaceOnUse">
                <line x1="1" y1="0" x2="1" y2="4" stroke={config.accentColor} strokeWidth="1.5" strokeDasharray="2,4" opacity="0.6" />
              </pattern>
            </defs>
            <line x1="1" y1="0" x2="1" y2="100%" stroke={config.accentColor} strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />
          </svg>

          <div className="flex-1 px-7 py-5 flex flex-col justify-between bg-white bg-opacity-60 relative">
            <div className="space-y-1.5">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Coupon Code</p>
              <p className="text-2xl font-mono font-black text-gray-900 tracking-wider" style={{ letterSpacing: '3px' }}>{coupon.code}</p>
              <p className="text-xs text-gray-500 font-semibold">
                Valid Till: {formatDateToDDMMYYYY(coupon.expiryDate)}
              </p>
            </div>

            <div className="space-y-1 text-xs text-gray-700">
              {coupon.minPurchase && (
                <p>Min Purchase: <span className="font-bold">₹{coupon.minPurchase}</span></p>
              )}
              {coupon.maxDiscount && (
                <p>Max Discount: <span className="font-bold">₹{coupon.maxDiscount}</span></p>
              )}
              <div className={`font-bold ${coupon.usedCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {coupon.usedCount > 0 ? '✓ Used' : '○ Not Used'}
              </div>
            </div>
          </div>

          {qrCodeUrl && (
            <div className="flex-shrink-0 px-4 py-3 flex flex-col justify-center items-center bg-white bg-opacity-80">
              <img src={qrCodeUrl} alt="Coupon QR Code" className="w-24 h-24" />
              <p className="text-xs text-gray-600 mt-1 font-semibold">Scan</p>
            </div>
          )}
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
        }}></div>
      </div>

      {!isPreview && (
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGenerateQR(coupon)}
            className="h-8 w-8 p-0 hover:bg-gray-300"
            title="Generate QR Code"
          >
            <QrCode className="h-4 w-4" />
          </Button>
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(coupon)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
              title="Download as Image"
            >
              <Download className="h-4 w-4 text-blue-600" />
            </Button>
          )}
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(coupon)}
              className="h-8 w-8 p-0 hover:bg-green-100"
              title="Share Coupon"
            >
              <Share2 className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(coupon)}
            className="h-8 w-8 p-0 hover:bg-gray-300"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(coupon._id!)}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export function CouponsManagement({ onCouponsChange }: CouponsManagementProps) {
  const { merchant } = useMerchantAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [theme, setTheme] = useState<'classic' | 'friendship' | 'love' | 'gift' | 'festival' | 'sale' | 'emoji' | 'first-time' | 'missed-you' | 'birthday' | 'holiday' | 'seasonal' | 'weekend' | 'student' | 'senior' | 'bulk' | 'flash' | 'members' | 'loyalty' | 'launch' | 'bonus'>('classic');

  // Bulk and user-specific coupon state
  const [bulkGenerationCount, setBulkGenerationCount] = useState('');
  const [userId, setUserId] = useState('');
  const [isRestricted, setIsRestricted] = useState(false);
  const [generationType, setGenerationType] = useState<'single' | 'bulk' | 'user'>('single');
  const [usageFilter, setUsageFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const [expandedBulk, setExpandedBulk] = useState(false);
  const [expandedIndividual, setExpandedIndividual] = useState(false);
  const [seriesNote, setSeriesNote] = useState('');
  const [seriesPagination, setSeriesPagination] = useState<Record<string, number>>({});
  const [individualPagination, setIndividualPagination] = useState(0);

  useEffect(() => {
    if (merchant?.id) {
      fetchCoupons();
    }
  }, [merchant?.id]);

  const fetchCoupons = async () => {
    if (!merchant?.id) {
      console.log('[Coupons] Skipping fetch - merchant.id not available');
      return;
    }

    try {
      setLoading(true);
      console.log('[Coupons] Fetching for merchant:', merchant.id);
      const response = await fetch(`/api/merchant/coupons?merchantId=${merchant.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('[Coupons] Fetched successfully:', data.coupons?.length || 0);
        console.log('[Coupons] First coupon sample:', data.coupons?.[0]);
        console.log('[Coupons] Coupons with seriesId:', data.coupons?.filter((c: Coupon) => c.seriesId).length || 0);
        setCoupons(data.coupons || []);
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Coupons] Fetch failed:', response.status, error);
        toast.error(error?.error || 'Failed to fetch coupons');
      }
    } catch (error) {
      console.error('[Coupons] Error fetching coupons:', error);
      toast.error('Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (coupon: Coupon) => {
    try {
      const qrData = `https://www.citywitty.com/coupon/${coupon.code}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrCodeDataUrl);
      setSelectedCoupon(coupon);
      setQrDialogOpen(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const downloadCouponAsImage = async (coupon: Coupon) => {
    try {
      const couponElement = document.getElementById(`coupon-visual-${coupon._id}`);
      if (!couponElement) {
        toast.error('Coupon element not found');
        return;
      }

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(couponElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `coupon-${coupon.code}-${new Date().getTime()}.png`;
      link.click();
      toast.success('Coupon downloaded successfully');
    } catch (error) {
      console.error('Error downloading coupon:', error);
      toast.error('Failed to download coupon');
    }
  };

  const shareCoupon = async (coupon: Coupon) => {
    try {
      const couponElement = document.getElementById(`coupon-visual-${coupon._id}`);
      if (!couponElement) {
        toast.error('Coupon element not found');
        return;
      }

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(couponElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const address = [merchant?.streetAddress, merchant?.locality, merchant?.city]
        .filter(Boolean)
        .join(', ') || 'CityWitty';
      
      const shareText = `🏪 ${merchant?.displayName || merchant?.businessName || 'CityWitty'}
📂 Category: ${merchant?.category || 'Retail'}
📍 ${address}

🎉 Special Offer!
💰 Code: ${coupon.code}
🎁 Discount: ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue} OFF${coupon.minPurchase ? `
📋 Min Purchase: ₹${coupon.minPurchase}` : ''}${coupon.maxDiscount ? `
🔝 Max Discount: ₹${coupon.maxDiscount}` : ''}
⏰ Valid Till: ${formatDateToDDMMYYYY(coupon.expiryDate)}

✨ Use this coupon at CityWitty!`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to create image');
          return;
        }

        const imageFile = new File([blob], `coupon-${coupon.code}.png`, { type: 'image/png' });
        const textBlob = new Blob([shareText], { type: 'text/plain' });
        const textFile = new File([textBlob], `coupon-${coupon.code}-details.txt`, { type: 'text/plain' });

        if (navigator.share) {
          try {
            await navigator.share({
              title: `${merchant?.displayName || merchant?.businessName || 'CityWitty'} - ${coupon.code}`,
              files: [imageFile, textFile],
            });
            toast.success('Coupon shared successfully!');
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.log('Share error:', error);
              navigator.clipboard.writeText(shareText).then(() => {
                toast.success('Coupon details copied to clipboard!');
              });
            }
          }
        } else {
          navigator.clipboard.writeText(shareText);
          toast.success('Coupon details copied to clipboard');
        }
      });
    } catch (error) {
      console.error('Error sharing coupon:', error);
      toast.error('Failed to share coupon');
    }
  };

  const groupCouponsBySeries = (couponsToGroup: Coupon[]) => {
    const filteredCoupons = couponsToGroup.filter((coupon) => {
      if (usageFilter === 'used') {
        return coupon.usedCount > 0;
      } else if (usageFilter === 'unused') {
        return coupon.usedCount === 0;
      }
      return true;
    });

    const grouped: { [key: string]: Coupon[] } = { 'individual': [] };
    
    console.log('[Grouping] Total filtered coupons:', filteredCoupons.length);
    
    filteredCoupons.forEach((coupon) => {
      if (coupon.seriesId) {
        console.log('[Grouping] Coupon has seriesId:', coupon.code, coupon.seriesId);
        if (!grouped[coupon.seriesId]) {
          grouped[coupon.seriesId] = [];
        }
        grouped[coupon.seriesId].push(coupon);
      } else {
        console.log('[Grouping] Coupon NO seriesId:', coupon.code);
        grouped['individual'].push(coupon);
      }
    });

    console.log('[Grouping] Final groups:', Object.keys(grouped));
    return grouped;
  };

  const toggleSeriesExpand = (seriesId: string) => {
    setExpandedSeries(prev => ({
      ...prev,
      [seriesId]: !prev[seriesId]
    }));
  };

  const getSeriesSummary = (couponsSeries: Coupon[]) => {
    const totalUsed = couponsSeries.reduce((sum, c) => sum + c.usedCount, 0);
    const totalRemaining = couponsSeries.length - totalUsed;
    
    return { totalUsed, totalRemaining };
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinPurchase('');
    setMaxDiscount('');
    setExpiryDate('');
    setStatus('active');
    setTheme('classic');
    setEditingCoupon(null);
    setBulkGenerationCount('');
    setUserId('');
    setIsRestricted(false);
    setGenerationType('single');
    setSeriesNote('');
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMinPurchase(coupon.minPurchase?.toString() || '');
    setMaxDiscount(coupon.maxDiscount?.toString() || '');
    setExpiryDate(formatDateToYYYYMMDD(coupon.expiryDate));
    setStatus(coupon.status);
    setTheme(coupon.theme || 'classic');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchant?.id) {
      toast.error('Merchant information not available');
      return;
    }

    if (!discountValue || !expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (generationType === 'bulk' && !bulkGenerationCount) {
      toast.error('Please enter number of coupons to generate');
      return;
    }

    if (generationType === 'user' && !userId) {
      toast.error('Please enter user ID');
      return;
    }

    if (generationType === 'single' && !code) {
      toast.error('Please enter coupon code');
      return;
    }

    try {
      let couponDataArray: any[] = [];
      let couponDataObject: any = null;
      let endpoint = '/api/merchant/coupons';
      let isArray = false;

      if (generationType === 'bulk') {
        const count = parseInt(bulkGenerationCount);
        const codes = generateMultipleCodes(count, merchant?.id);
        couponDataArray = codes.map((couponCode) => ({
          code: couponCode,
          discountType,
          discountValue: parseFloat(discountValue),
          minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
          expiryDate,
          status,
          theme,
        }));
        isArray = true;
      } else if (generationType === 'user') {
        couponDataArray = [{
          code: generateRandomCode(),
          discountType,
          discountValue: parseFloat(discountValue),
          minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
          expiryDate,
          status,
          userId,
          isRestricted,
          theme,
        }];
        endpoint = '/api/merchant/coupons/user-specific';
        isArray = true;
      } else {
        couponDataObject = {
          code: code.toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
          expiryDate,
          status,
          theme,
        };

        if (editingCoupon) {
          endpoint = `/api/merchant/coupons/${editingCoupon._id}`;
          const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...couponDataObject,
              merchantId: merchant.id,
            }),
          });

          if (response.ok) {
            toast.success('Coupon updated successfully');
            setDialogOpen(false);
            resetForm();
            fetchCoupons();
            onCouponsChange?.();
          } else {
            const error = await response.json();
            toast.error(error.message || 'Failed to save coupon');
          }
          return;
        }
      }

      const requestBody: any = {
        coupons: isArray ? couponDataArray : couponDataObject,
        isBulk: generationType === 'bulk',
        merchantId: merchant.id,
      };
      
      if (generationType === 'bulk' && seriesNote) {
        requestBody.seriesNote = seriesNote;
      }
      console.log('[Frontend] Generation type selected:', generationType);
      console.log('[Frontend] Is bulk flag:', generationType === 'bulk');
      console.log('[Frontend] IsArray flag:', isArray);
      console.log('[Frontend] Request body:', requestBody);
      console.log('[Frontend] Request coupons is array:', Array.isArray(requestBody.coupons));
      console.log('[Frontend] Coupons count:', Array.isArray(requestBody.coupons) ? requestBody.coupons.length : 'object');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('[Frontend] Response received, status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('[Frontend] Response data:', responseData);
        console.log('[Frontend] Response seriesId:', responseData.seriesId);
        if (responseData.coupons && responseData.coupons[0]) {
          console.log('[Frontend] First coupon in response:', responseData.coupons[0]);
        }
        const message = generationType === 'bulk'
          ? `${bulkGenerationCount} coupons generated successfully`
          : generationType === 'user'
          ? 'User-specific coupon created successfully'
          : 'Coupon created successfully';
        toast.success(message);
        setDialogOpen(false);
        resetForm();
        fetchCoupons();
        onCouponsChange?.();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('Error saving coupon');
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    if (!merchant?.id) {
      toast.error('Merchant information not available');
      return;
    }

    try {
      const response = await fetch(`/api/merchant/coupons/${couponId}?merchantId=${merchant.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Coupon deleted successfully');
        fetchCoupons();
        onCouponsChange?.();
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Error deleting coupon');
    }
  };

  const handleDeleteSeries = async (seriesId: string, couponsCount: number) => {
    if (!confirm(`Are you sure you want to delete all ${couponsCount} coupons in this series? This action cannot be undone.`)) return;

    if (!merchant?.id) {
      toast.error('Merchant information not available');
      return;
    }

    try {
      setLoading(true);
      const couponsByIdToDelete = coupons.filter((c) => c.seriesId === seriesId).map((c) => c._id);
      
      let deletedCount = 0;
      for (const couponId of couponsByIdToDelete) {
        const response = await fetch(`/api/merchant/coupons/${couponId}?merchantId=${merchant.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          deletedCount++;
        }
      }

      if (deletedCount === couponsByIdToDelete.length) {
        toast.success(`Series deleted successfully (${deletedCount} coupons removed)`);
        fetchCoupons();
        onCouponsChange?.();
      } else {
        toast.warning(`Deleted ${deletedCount}/${couponsByIdToDelete.length} coupons`);
        fetchCoupons();
      }
    } catch (error) {
      console.error('Error deleting series:', error);
      toast.error('Error deleting series');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCoupons = () => {
    return coupons.filter((coupon) => {
      if (usageFilter === 'used') {
        return coupon.usedCount > 0;
      } else if (usageFilter === 'unused') {
        return coupon.usedCount === 0;
      }
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredCoupons = getFilteredCoupons();
  const groupedCoupons = groupCouponsBySeries(filteredCoupons);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
          <p className="text-gray-600">Create and manage discount coupons for your store</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <Select value={usageFilter} onValueChange={(value: 'all' | 'used' | 'unused') => setUsageFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coupons</SelectItem>
            <SelectItem value="used">Used Coupons</SelectItem>
            <SelectItem value="unused">Unused Coupons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {(() => {
          const seriesArray = Object.entries(groupedCoupons).filter(([id]) => id !== 'individual');
          return seriesArray.length > 0 ? (
            <div key="bulk-accordion" className="border-2 border-purple-300 rounded-lg overflow-hidden bg-white shadow">
              <button
                onClick={() => setExpandedBulk(!expandedBulk)}
                className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all text-white"
              >
                <div className="flex items-center gap-4 flex-1">
                  {expandedBulk ? (
                    <ChevronDown className="h-6 w-6 text-white" />
                  ) : (
                    <ChevronRight className="h-6 w-6 text-white" />
                  )}
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-white">
                      Bulk Generated Series
                    </h3>
                    <p className="text-sm text-purple-100">
                      {seriesArray.length} series
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-300 text-purple-900">
                  {seriesArray.reduce((sum, [, coupons]) => sum + coupons.length, 0)}
                </Badge>
              </button>

              {expandedBulk && (
                <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-4 border-t-2 border-purple-100">
                  {seriesArray.map(([seriesId, couponsSeries]) => {
                    const isExpanded = expandedSeries[seriesId] || false;
                    const sortedCoupons = [...couponsSeries].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
                    const summary = getSeriesSummary(couponsSeries);

                    return (
                      <div key={seriesId} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <div className="px-5 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-150 transition-colors">
                          <button
                            onClick={() => toggleSeriesExpand(seriesId)}
                            className="flex items-center gap-3 flex-1 text-left hover:opacity-75 transition-opacity"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-gray-700" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-700" />
                            )}
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {sortedCoupons[0]?.seriesNote ? sortedCoupons[0].seriesNote : `${sortedCoupons[0]?.code} to ${sortedCoupons[sortedCoupons.length - 1]?.code}`}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {couponsSeries.length} coupons · {summary.totalUsed} used · {summary.totalRemaining} remaining
                              </p>
                            </div>
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSeries(seriesId, couponsSeries.length)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Series
                          </Button>
                        </div>

                        {isExpanded && (() => {
                          const itemsPerPage = 30;
                          const currentPage = seriesPagination[seriesId] || 0;
                          const startIdx = currentPage * itemsPerPage;
                          const paginatedSeries = sortedCoupons.slice(startIdx, startIdx + itemsPerPage);
                          const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage);

                          return (
                            <div className="p-6 bg-gray-50 border-t space-y-4">
                              <div className="grid gap-6">
                                {paginatedSeries.map((coupon) => (
                                  <CouponCard
                                    key={coupon._id}
                                    coupon={coupon}
                                    sortedCoupons={sortedCoupons}
                                    theme={coupon.theme || 'classic'}
                                    onGenerateQR={generateQRCode}
                                    onDownload={downloadCouponAsImage}
                                    onShare={shareCoupon}
                                    onEdit={openEditDialog}
                                    onDelete={handleDelete}
                                  />
                                ))}
                              </div>
                              {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSeriesPagination(prev => ({
                                      ...prev,
                                      [seriesId]: Math.max(0, (prev[seriesId] || 0) - 1)
                                    }))}
                                    disabled={currentPage === 0}
                                  >
                                    Previous
                                  </Button>
                                  <span className="text-sm text-gray-600">
                                    Page {currentPage + 1} of {totalPages}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSeriesPagination(prev => ({
                                      ...prev,
                                      [seriesId]: Math.min(totalPages - 1, (prev[seriesId] || 0) + 1)
                                    }))}
                                    disabled={currentPage === totalPages - 1}
                                  >
                                    Next
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null;
        })()}

        {(() => {
          const individualCoupons = groupedCoupons['individual'] || [];
          const itemsPerPage = 30;
          const currentPage = individualPagination;
          const startIdx = currentPage * itemsPerPage;
          const paginatedCoupons = individualCoupons.slice(startIdx, startIdx + itemsPerPage);
          const totalPages = Math.ceil(individualCoupons.length / itemsPerPage);

          return individualCoupons.length > 0 ? (
            <div key="individual-accordion" className="border-2 border-green-300 rounded-lg overflow-hidden bg-white shadow">
              <button
                onClick={() => setExpandedIndividual(!expandedIndividual)}
                className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all text-white"
              >
                <div className="flex items-center gap-4 flex-1">
                  {expandedIndividual ? (
                    <ChevronDown className="h-6 w-6 text-white" />
                  ) : (
                    <ChevronRight className="h-6 w-6 text-white" />
                  )}
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-white">
                      Individual Coupons
                    </h3>
                    <p className="text-sm text-green-100">
                      {individualCoupons.length} coupons
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-300 text-green-900">
                  {individualCoupons.length}
                </Badge>
              </button>

              {expandedIndividual && (
                <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-4 border-t-2 border-green-100">
                  <div className="grid gap-6">
                    {paginatedCoupons.map((coupon) => (
                      <CouponCard
                        key={coupon._id}
                        coupon={coupon}
                        sortedCoupons={[coupon]}
                        theme={coupon.theme || 'classic'}
                        onGenerateQR={generateQRCode}
                        onDownload={downloadCouponAsImage}
                        onShare={shareCoupon}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIndividualPagination(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIndividualPagination(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null;
        })()}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
          <p className="text-gray-600 mb-4">Create your first coupon to start offering discounts</p>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Coupon
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
            {!editingCoupon && (
              <div>
                <Label htmlFor="generationType">Generation Type</Label>
                <Select value={generationType} onValueChange={(value: 'single' | 'bulk' | 'user') => setGenerationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Coupon</SelectItem>
                    <SelectItem value="bulk">Bulk Generation (Series)</SelectItem>
                    <SelectItem value="user">User-Specific Coupon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {generationType === 'single' && (
                <div>
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
              )}
              {generationType === 'bulk' && (
                <div>
                  <Label htmlFor="bulkGenerationCount">Number of Coupons *</Label>
                  <Input
                    id="bulkGenerationCount"
                    type="number"
                    value={bulkGenerationCount}
                    onChange={(e) => setBulkGenerationCount(e.target.value)}
                    placeholder="10"
                    required
                    min="1"
                  />
                </div>
              )}
              {generationType === 'user' && (
                <div>
                  <Label htmlFor="userId">User ID *</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="user-123"
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="discountValue">
                Discount Value * ({discountType === 'percentage' ? '%' : '₹'})
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'percentage' ? '20' : '10'}
                required
                min="0"
                step={discountType === 'percentage' ? '0.1' : '0.01'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPurchase">Min. Purchase (₹)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(e.target.value)}
                  placeholder="50"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="maxDiscount">Max. Discount (₹)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'active' | 'inactive') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Coupon Theme</Label>
              <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">🎫 Classic</SelectItem>
                  <SelectItem value="friendship">👯 Friendship Special</SelectItem>
                  <SelectItem value="love">💕 Love Offer</SelectItem>
                  <SelectItem value="gift">🎁 Gift Voucher</SelectItem>
                  <SelectItem value="festival">🎉 Festival Offer</SelectItem>
                  <SelectItem value="sale">🔥 Mega Sale</SelectItem>
                  <SelectItem value="emoji">😊 Emoji Special</SelectItem>
                  <SelectItem value="first-time">🌟 Welcome Offer</SelectItem>
                  <SelectItem value="missed-you">💚 Missed You</SelectItem>
                  <SelectItem value="birthday">🎂 Birthday Bash</SelectItem>
                  <SelectItem value="holiday">🏖️ Holiday Special</SelectItem>
                  <SelectItem value="seasonal">🌸 Seasonal Sale</SelectItem>
                  <SelectItem value="weekend">🎊 Weekend Offer</SelectItem>
                  <SelectItem value="student">🎓 Student Discount</SelectItem>
                  <SelectItem value="senior">👴 Senior Special</SelectItem>
                  <SelectItem value="bulk">📦 Bulk Buy Save</SelectItem>
                  <SelectItem value="flash">⚡ Flash Sale</SelectItem>
                  <SelectItem value="members">👑 Members Only</SelectItem>
                  <SelectItem value="loyalty">💎 Loyalty Reward</SelectItem>
                  <SelectItem value="launch">🚀 New Launch</SelectItem>
                  <SelectItem value="bonus">🎁 Bonus Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {generationType === 'bulk' && !editingCoupon && (
              <div>
                <Label htmlFor="seriesNote">Series Note (Optional)</Label>
                <Input
                  id="seriesNote"
                  value={seriesNote}
                  onChange={(e) => setSeriesNote(e.target.value)}
                  placeholder="e.g., Summer Sale 2024, Employee Discount, etc."
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">Add a note to remember what occasion this series was created for</p>
              </div>
            )}

            {generationType === 'user' && !editingCoupon && (
              <div className="flex items-center space-x-2 border rounded-lg p-3 bg-blue-50">
                <input
                  type="checkbox"
                  id="isRestricted"
                  checked={isRestricted}
                  onChange={(e) => setIsRestricted(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="isRestricted" className="cursor-pointer flex-1">
                  Restrict to this user only (Can only be used by specified user)
                </Label>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 col-span-2 border-t">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCoupon 
                  ? 'Update Coupon' 
                  : generationType === 'bulk' 
                  ? `Generate ${bulkGenerationCount} Coupons`
                  : generationType === 'user'
                  ? 'Create User Coupon'
                  : 'Create Coupon'
                }
              </Button>
            </div>
            </div>

            <div className="flex flex-col justify-start gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-4">Live Preview</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 sticky top-0">
                  {discountValue ? (
                    <CouponCard
                      coupon={{
                        _id: 'preview',
                        code: generationType === 'single' ? (code || 'SAMPLECODE') : (generationType === 'bulk' ? `CWC-XXX-XXX-001` : 'USER-CODE'),
                        discountType: (discountType as 'percentage' | 'fixed'),
                        discountValue: parseFloat(discountValue),
                        minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
                        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
                        expiryDate: expiryDate || new Date().toISOString(),
                        usedCount: 0,
                        status: (status as 'active' | 'inactive'),
                        theme: (theme as any),
                        sequence: 1,
                      }}
                      sortedCoupons={[]}
                      theme={theme}
                      isPreview={true}
                      onGenerateQR={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onDownload={undefined}
                      onShare={undefined}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">Enter discount value to see preview</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold mb-2 text-gray-600">THEME SAMPLES</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {['classic', 'friendship', 'love', 'gift', 'festival', 'sale', 'emoji', 'first-time', 'missed-you', 'birthday', 'holiday', 'seasonal', 'weekend', 'student', 'senior', 'bulk', 'flash', 'members', 'loyalty', 'launch', 'bonus'].map((t) => (
                    <div key={t} className={`p-2 rounded border-2 bg-white hover:bg-gray-50 cursor-pointer transition-all ${theme === t ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}`} onClick={() => setTheme(t as any)}>
                      <CouponCard
                        coupon={{
                          _id: `sample-${t}`,
                          code: 'SAMPLE',
                          discountType: 'percentage',
                          discountValue: 25,
                          expiryDate: new Date().toISOString(),
                          usedCount: 0,
                          status: 'active',
                          theme: t as any,
                          sequence: 1,
                        }}
                        sortedCoupons={[]}
                        theme={t}
                        isPreview={true}
                        onGenerateQR={() => {}}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onDownload={undefined}
                        onShare={undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>QR Code for {selectedCoupon?.code}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            )}
            <p className="text-sm text-gray-600 text-center">
              Scan this QR code to apply the coupon {selectedCoupon?.code}
            </p>
            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrCodeUrl;
                link.download = `coupon-${selectedCoupon?.code}-qr.png`;
                link.click();
              }}
              variant="outline"
            >
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}