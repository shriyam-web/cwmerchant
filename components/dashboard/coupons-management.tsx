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
import { Plus, Edit2, Trash2, QrCode, Loader2, Tag, Calendar, Percent, DollarSign } from 'lucide-react';
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
  usageLimit?: number;
  usedCount: number;
  status: 'active' | 'inactive';
  qrCodeData?: string;
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
  const [usageLimit, setUsageLimit] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (merchant?.id) {
      fetchCoupons();
    }
  }, [merchant?.id]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/merchant/coupons?merchantId=${merchant.id}`);
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      } else {
        toast.error('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
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

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinPurchase('');
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit('');
    setStatus('active');
    setEditingCoupon(null);
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
    setUsageLimit(coupon.usageLimit?.toString() || '');
    setStatus(coupon.status);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !discountValue || !expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const couponData = {
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      expiryDate,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      status,
    };

    try {
      const url = editingCoupon
        ? `/api/merchant/coupons/${editingCoupon._id}`
        : '/api/merchant/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...couponData, merchantId: merchant.id }),
      });

      if (response.ok) {
        toast.success(editingCoupon ? 'Coupon updated successfully' : 'Coupon created successfully');
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

    try {
      const response = await fetch(`/api/merchant/coupons/${couponId}`, {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <Card key={coupon._id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-600" />
                  {coupon.code}
                </CardTitle>
                <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                  {coupon.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                {coupon.discountType === 'percentage' ? (
                  <Percent className="h-4 w-4 mr-1" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-1" />
                )}
                {coupon.discountType === 'percentage'
                  ? `${coupon.discountValue}% off`
                  : `$${coupon.discountValue} off`
                }
              </div>

              {coupon.minPurchase && (
                <div className="text-sm text-gray-600">
                  Min. purchase: ${coupon.minPurchase}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                Expires: {formatDateToDDMMYYYY(coupon.expiryDate)}
              </div>

              {coupon.usageLimit && (
                <div className="text-sm text-gray-600">
                  Used: {coupon.usedCount}/{coupon.usageLimit}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateQRCode(coupon)}
                  className="flex-1"
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(coupon)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(coupon._id!)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                Discount Value * ({discountType === 'percentage' ? '%' : '$'})
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
                <Label htmlFor="minPurchase">Min. Purchase ($)</Label>
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
                <Label htmlFor="maxDiscount">Max. Discount ($)</Label>
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="100"
                  min="1"
                />
              </div>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCoupon ? 'Update' : 'Create'} Coupon
              </Button>
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