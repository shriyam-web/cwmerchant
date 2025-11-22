'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useMerchantAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Calendar, Percent, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Offer {
  _id?: string;
  category: string;
  offerTitle: string;
  offerDescription: string;
  originalPrice?: number;
  discountValue: number;
  discountPercent: number;
  status: 'Active' | 'Inactive';
  validUpto: string;
}

interface OffersManagementProps {
  onOffersChange?: () => void;
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

const convertDDMMYYYYToYYYYMMDD = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return '';
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
};

const convertYYYYMMDDToDDMMYYYY = (yyyymmdd: string): string => {
  if (!yyyymmdd) return '';
  const [year, month, day] = yyyymmdd.split('-');
  return `${day}/${month}/${year}`;
};

const calculateFinalPrice = (price: { originalPrice?: number; discountValue?: number; discountPercent?: number; }) => {
  const original = price.originalPrice ?? 0;
  if (original <= 0) return 0;
  const valueBased = price.discountValue ? Math.max(original - price.discountValue, 0) : original;
  const percentBased = price.discountPercent ? Math.max(original * (1 - price.discountPercent / 100), 0) : original;
  const final = Math.min(valueBased, percentBased);
  return Math.max(Number(final.toFixed(2)), 0);
};

const formatCurrency = (value: number) => {
  const safeValue = Number.isFinite(value) ? Math.max(value, 0) : 0;
  return `₹${safeValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export function OffersManagement({ onOffersChange }: OffersManagementProps = {}) {
  const { merchant } = useMerchantAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [migrating, setMigrating] = useState(false);

  const [formData, setFormData] = useState<Offer>({
    category: '',
    offerTitle: '',
    offerDescription: '',
    originalPrice: 0,
    discountValue: 0,
    discountPercent: 0,
    status: 'Active',
    validUpto: ''
  });

  // Fetch offers on component mount
  useEffect(() => {
    if (merchant?.id) {
      fetchOffers();
    }
  }, [merchant?.id]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/merchant/offers?merchantId=${merchant?.id}`);
      const data = await response.json();

      if (data.success) {
        console.log('Fetched offers:', data.offers);
        // Log which offers have IDs and which don't
        data.offers?.forEach((offer: Offer, index: number) => {
          console.log(`Offer ${index}:`, {
            title: offer.offerTitle,
            hasId: !!offer._id,
            id: offer._id
          });
        });
        const offersWithFinalPrice = (data.offers || []).map((offer: Offer) => ({
          ...offer,
          originalPrice: offer.originalPrice ?? 0
        }));
        setOffers(offersWithFinalPrice);
      } else {
        toast.error(data.error || 'Failed to fetch offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/merchant/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: merchant?.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        await fetchOffers(); // Refresh data to ensure consistency
        toast.success('Offer created successfully!');
        resetForm();
        setIsAddDialogOpen(false);
        onOffersChange?.(); // Notify parent about the change
      } else {
        toast.error(data.error || 'Failed to create offer');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Failed to create offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOffer = async () => {
    if (!editingOffer?._id || !validateForm()) return;

    try {
      setSubmitting(true);
      console.log('Updating offer with ID:', editingOffer._id);
      console.log('Form data:', formData);

      const response = await fetch('/api/merchant/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: merchant?.id,
          offerId: editingOffer._id,
          ...formData
        })
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (data.success) {
        await fetchOffers(); // Refresh data to ensure consistency
        toast.success('Offer updated successfully!');
        resetForm();
        setIsEditDialogOpen(false);
        setEditingOffer(null);
        onOffersChange?.(); // Notify parent about the change
      } else {
        toast.error(data.error || 'Failed to update offer');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Failed to update offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      console.log('Deleting offer with ID:', offerId);

      const response = await fetch(`/api/merchant/offers?merchantId=${merchant?.id}&offerId=${offerId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (data.success) {
        await fetchOffers(); // Refresh data to ensure consistency
        toast.success('Offer deleted successfully!');
        onOffersChange?.(); // Notify parent about the change
      } else {
        toast.error(data.error || 'Failed to delete offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Failed to delete offer');
    }
  };

  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      category: offer.category,
      offerTitle: offer.offerTitle,
      offerDescription: offer.offerDescription,
      originalPrice: offer.originalPrice ?? 0,
      discountValue: offer.discountValue,
      discountPercent: offer.discountPercent,
      status: offer.status,
      validUpto: offer.validUpto ? formatDateToYYYYMMDD(offer.validUpto) : ''
    });
    setIsEditDialogOpen(true);
  };

  const validateForm = () => {
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.offerTitle.trim()) {
      toast.error('Offer title is required');
      return false;
    }
    if (!formData.offerDescription.trim()) {
      toast.error('Offer description is required');
      return false;
    }
    if (!formData.originalPrice || formData.originalPrice <= 0) {
      toast.error('Original price must be greater than 0');
      return false;
    }
    if (formData.discountValue <= 0 && formData.discountPercent <= 0) {
      toast.error('Please provide either discount value or discount percent');
      return false;
    }
    if (formData.discountPercent > 100) {
      toast.error('Discount percent cannot exceed 100%');
      return false;
    }
    // Only require validUpto if status is Active
    if (formData.status === 'Active' && !formData.validUpto) {
      toast.error('Valid until date is required for active offers');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      category: '',
      offerTitle: '',
      offerDescription: '',
      originalPrice: 0,
      discountValue: 0,
      discountPercent: 0,
      status: 'Active',
      validUpto: ''
    });
  };

  const isOfferExpired = (validUpto: string) => {
    return new Date(validUpto) < new Date();
  };

  const handleMigrateOffers = async () => {
    try {
      setMigrating(true);
      const response = await fetch('/api/merchant/offers/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: merchant?.id })
      });

      const data = await response.json();

      if (data.success) {
        await fetchOffers(); // Refresh data to ensure consistency
        toast.success(data.message || 'Offers migrated successfully!');
      } else {
        toast.error(data.error || 'Failed to migrate offers');
      }
    } catch (error) {
      console.error('Error migrating offers:', error);
      toast.error('Failed to migrate offers');
    } finally {
      setMigrating(false);
    }
  };

  const renderOfferForm = (isEdit: boolean = false) => {
    const finalPrice = calculateFinalPrice({
      originalPrice: formData.originalPrice,
      discountValue: formData.discountValue,
      discountPercent: formData.discountPercent
    });
    const hasDiscount = (formData.discountValue ?? 0) > 0 || (formData.discountPercent ?? 0) > 0;
    const discountApplied = hasDiscount && finalPrice < (formData.originalPrice ?? 0);

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Electronics, Fashion, Food"
            className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <Label htmlFor="offerTitle" className="text-gray-700 dark:text-gray-300">Offer Title *</Label>
          <Input
            id="offerTitle"
            value={formData.offerTitle}
            onChange={(e) => setFormData({ ...formData, offerTitle: e.target.value })}
            placeholder="e.g., 20% Off on Electronics"
            className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <Label htmlFor="offerDescription" className="text-gray-700 dark:text-gray-300">Description *</Label>
          <Textarea
            id="offerDescription"
            value={formData.offerDescription}
            onChange={(e) => setFormData({ ...formData, offerDescription: e.target.value })}
            placeholder="Describe your offer in detail"
            className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="originalPrice" className="text-gray-700 dark:text-gray-300">Original Price (₹) *</Label>
          <Input
            id="originalPrice"
            type="number"
            min="0"
            value={formData.originalPrice || ''}
            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
            placeholder="e.g., 2500"
            className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discountValue" className="text-gray-700 dark:text-gray-300">Discount Value (₹)</Label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              value={formData.discountValue || ''}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              placeholder="e.g., 500"
              className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="discountPercent" className="text-gray-700 dark:text-gray-300">Discount Percent (%)</Label>
            <Input
              id="discountPercent"
              type="number"
              min="0"
              max="100"
              value={formData.discountPercent || ''}
              onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
              placeholder="e.g., 20"
              className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {formData.originalPrice ? (
          <div className="rounded-md border bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 px-3 py-2 space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Original</span>
              <span className={discountApplied ? "line-through" : undefined}>{formatCurrency(formData.originalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Final Price</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        ) : null}

        <div>
          <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'Active' | 'Inactive') => {
              if (value === 'Inactive') {
                setFormData({ ...formData, status: value, validUpto: '' });
              } else {
                setFormData({ ...formData, status: value });
              }
            }}
          >
            <SelectTrigger className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-950 border dark:border-gray-800">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="validUpto" className="text-gray-700 dark:text-gray-300">
            Valid Until {formData.status === 'Active' ? '*' : '(Optional)'}
          </Label>
          <Input
            id="validUpto"
            type="date"
            value={formData.validUpto}
            onChange={(e) => setFormData({ ...formData, validUpto: e.target.value })}
            className="mt-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            min={new Date().toISOString().split('T')[0]}
            disabled={formData.status === 'Inactive'}
          />
          {formData.validUpto && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Selected: {convertYYYYMMDDToDDMMYYYY(formData.validUpto)}
            </p>
          )}
        </div>

        <Button
          onClick={isEdit ? handleEditOffer : handleAddOffer}
          className="w-full"
          disabled={submitting}
          variant={isEdit ? 'default' : 'success'}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEdit ? 'Update Offer' : 'Create Offer'
          )}
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  // Check if there are offers without IDs
  const offersWithoutIds = offers.filter(offer => !offer._id);
  const hasOffersWithoutIds = offersWithoutIds.length > 0;

  return (
    <div id="tour-offers" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Offers Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your promotional offers</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button id="tour-offers-actions">
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-950 border dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Create New Offer</DialogTitle>
            </DialogHeader>
            {renderOfferForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      {/* Migration Banner */}
      {hasOffersWithoutIds && (
        <Card className="border-yellow-500 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg dark:shadow-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-400 mb-2">
                  Action Required: Migrate Your Offers
                </h3>
                <p className="text-yellow-800 dark:text-yellow-300 mb-3">
                  {offersWithoutIds.length} of your offers need to be migrated to enable editing and deletion.
                  This is a one-time process that will update your offers to the new format.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Note: Your offer data will be preserved. This only adds necessary identifiers.
                </p>
              </div>
              <Button
                onClick={handleMigrateOffers}
                disabled={migrating}
                className="ml-4 bg-yellow-600 hover:bg-yellow-700"
              >
                {migrating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  'Migrate Now'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {offers.length === 0 ? (
        <Card className="p-12 bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-lg dark:shadow-gray-900/50">
          <div className="text-center">
            <Tag className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No offers yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first promotional offer to attract customers</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Offer
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const expired = isOfferExpired(offer.validUpto);
            const displayStatus = expired ? 'Expired' : offer.status;
            const showPriceSummary = (offer.originalPrice ?? 0) > 0;
            const finalOfferPrice = calculateFinalPrice({
              originalPrice: offer.originalPrice,
              discountValue: offer.discountValue,
              discountPercent: offer.discountPercent
            });
            const discountApplied = finalOfferPrice < (offer.originalPrice ?? 0);

            return (
              <Card key={offer._id} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-lg dark:shadow-gray-900/50 hover:dark:shadow-gray-900/70">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 text-gray-900 dark:text-gray-100">{offer.offerTitle}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={offer.status === 'Active' && !expired ? 'default' : 'secondary'}
                          className={
                            offer.status === 'Active' && !expired
                              ? 'bg-green-600'
                              : expired
                                ? 'bg-red-500'
                                : 'bg-gray-500'
                          }
                        >
                          {displayStatus}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {offer.category}
                        </Badge>
                      </div>
                    </div>
                    <div id="tour-offers-manage" className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(offer)}
                        disabled={!offer._id}
                        title={!offer._id ? 'This offer needs to be recreated to enable editing' : 'Edit offer'}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOffer(offer._id!)}
                        disabled={!offer._id}
                        title={!offer._id ? 'This offer needs to be recreated to enable deletion' : 'Delete offer'}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{offer.offerDescription}</p>
                  {showPriceSummary && (
                    <div className="mb-3 rounded-md border bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 px-3 py-2 space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Original</span>
                        <span className={discountApplied ? "line-through" : undefined}>{formatCurrency(offer.originalPrice || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Final Price</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-400">{formatCurrency(finalOfferPrice)}</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 text-sm">
                    {offer.discountPercent > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          Discount Percent:
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">{offer.discountPercent}%</span>
                      </div>
                    )}
                    {offer.discountValue > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Discount Value:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">₹{offer.discountValue}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Valid until:
                      </span>
                      <span className={`font-medium ${expired ? 'text-red-500 dark:text-red-400' : 'dark:text-gray-300'}`}>
                        {formatDateToDDMMYYYY(offer.validUpto)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          resetForm();
          setEditingOffer(null);
        }
      }}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-950 border dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Offer</DialogTitle>
          </DialogHeader>
          {renderOfferForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}