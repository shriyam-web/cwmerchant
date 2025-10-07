'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Save, Eye, ExternalLink, Loader2, AlertTriangle, X } from 'lucide-react';
import { useMerchantAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface ExtendedMerchant {
  id: string;
  email: string;
  businessName: string;
  role: "merchant";
  status: "active" | "pending" | "suspended" | "inactive";
  merchantId?: string;
  legalName?: string;
  displayName?: string;
  emailVerified?: boolean;
  phone?: string;
  category?: string;
  city?: string;
  streetAddress?: string;
  pincode?: string;
  locality?: string;
  state?: string;
  country?: string;
  whatsapp?: string;
  gstNumber?: string;
  panNumber?: string;
  businessType?: string;
  yearsInBusiness?: number;
  averageMonthlyRevenue?: number;
  description?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    x?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  businessHours?: {
    open?: string;
    close?: string;
    days?: string[];
  };
  agreeToTerms?: boolean;
  tags?: string[];
  purchasedPackage?: {
    variantName?: string;
  };
  paymentMethodAccepted?: string[];
  minimumOrderValue?: number;
  bankDetails?: {
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branchName?: string;
    upiId?: string;
  };
  logo?: string;
  storeImages?: string[];
  mapLocation?: string;
}

export function ProfileSettings() {
  const { merchant, setMerchant } = useMerchantAuth() as {
    merchant: ExtendedMerchant | null;
    setMerchant: ((merchant: ExtendedMerchant) => void) | null;
  };

  const [profile, setProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    locality: '',
    gst: '',
    description: '',
    mapLocation: '',
    logo: '',
    storeImages: [] as string[],
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    upiId: '',
    // Business Hours
    openTime: '',
    closeTime: '',
    days: [] as string[],
    isOpen247: false,
    // Social Media
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
    // Additional Information
    tags: '',
    paymentMethods: [] as string[],
    minOrderValue: 149
  });

  const [initialProfile, setInitialProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    locality: '',
    gst: '',
    description: '',
    mapLocation: '',
    logo: '',
    storeImages: [] as string[],
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    upiId: '',
    // Business Hours
    openTime: '',
    closeTime: '',
    days: [] as string[],
    isOpen247: false,
    // Social Media
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
    // Additional Information
    tags: '',
    paymentMethods: [] as string[],
    minOrderValue: 149
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeImagesInputRef = useRef<HTMLInputElement>(null);
  const [storeImagesLoading, setStoreImagesLoading] = useState(false);

  useEffect(() => {
    if (merchant) {
      const profileData = {
        businessName: merchant.businessName || '',
        ownerName: merchant.legalName || merchant.displayName || '',
        email: merchant.email || '',
        phone: merchant.phone || '',
        address: merchant.streetAddress || '',
        city: merchant.city || '',
        state: merchant.state || '',
        pincode: merchant.pincode || '',
        locality: merchant.locality || '',
        gst: merchant.gstNumber || '',
        description: merchant.description || '',
        mapLocation: merchant.mapLocation || '',
        logo: merchant.logo || '',
        storeImages: merchant.storeImages || [],
        accountHolderName: merchant.bankDetails?.accountHolderName || '',
        accountNumber: merchant.bankDetails?.accountNumber || '',
        ifscCode: merchant.bankDetails?.ifscCode || '',
        bankName: merchant.bankDetails?.bankName || '',
        branchName: merchant.bankDetails?.branchName || '',
        upiId: merchant.bankDetails?.upiId || '',
        openTime: merchant.businessHours?.open || '',
        closeTime: merchant.businessHours?.close || '',
        days: merchant.businessHours?.days || [],
        isOpen247: false,
        website: merchant.website || '',
        facebook: merchant.socialLinks?.facebook || '',
        instagram: merchant.socialLinks?.instagram || '',
        linkedin: merchant.socialLinks?.linkedin || '',
        x: merchant.socialLinks?.x || '',
        youtube: merchant.socialLinks?.youtube || '',
        tags: merchant.tags?.join(', ') || '',
        paymentMethods: merchant.paymentMethodAccepted || [],
        minOrderValue: merchant.minimumOrderValue || 149
      };
      setProfile(profileData);
      setInitialProfile(profileData);
    }
  }, [merchant]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfile({ ...profile, logo: data.url });
        toast.success('Logo uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (profile.storeImages.length + files.length > 3) {
      toast.error('You can upload a maximum of 3 store images');
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each file size must be less than 5MB');
        return;
      }
    }

    setStoreImagesLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/upload-store-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfile({ ...profile, storeImages: [...profile.storeImages, ...data.urls] });
        toast.success('Store images uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload store images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setStoreImagesLoading(false);
    }
  };

  const removeStoreImage = (index: number) => {
    const newImages = profile.storeImages.filter((_, i) => i !== index);
    setProfile({ ...profile, storeImages: newImages });
  };

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const confirmSave = async () => {
    if (!merchant?.id) {
      toast.error('Merchant ID not found');
      return;
    }

    setSaving(true);
    try {
      // Prepare the update data
      const updateData = {
        displayName: profile.businessName,
        legalName: profile.ownerName,
        phone: profile.phone,
        streetAddress: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        locality: profile.locality,
        gstNumber: profile.gst,
        description: profile.description,
        mapLocation: profile.mapLocation,
        logo: profile.logo,
        storeImages: profile.storeImages,
        bankDetails: {
          accountHolderName: profile.accountHolderName,
          accountNumber: profile.accountNumber,
          ifscCode: profile.ifscCode,
          bankName: profile.bankName,
          branchName: profile.branchName,
          upiId: profile.upiId,
        },
        businessHours: {
          open: profile.openTime,
          close: profile.closeTime,
          days: profile.days,
        },
        website: profile.website,
        socialLinks: {
          facebook: profile.facebook,
          instagram: profile.instagram,
          linkedin: profile.linkedin,
          x: profile.x,
          youtube: profile.youtube,
        },
        tags: profile.tags.split(',').map(t => t.trim()).filter(t => t),
        paymentMethodAccepted: profile.paymentMethods,
        minimumOrderValue: profile.minOrderValue,
      };

      const response = await fetch('/api/merchant/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: merchant.id,
          ...updateData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the merchant state with the new data
        if (setMerchant && data.merchant) {
          setMerchant(data.merchant);
        }
        setInitialProfile(profile);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600">Manage your business profile and settings</p>
        </div>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview Shop
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="store-images">Store Images</TabsTrigger>
          <TabsTrigger value="additional">Additional Information</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.logo} alt="Business Logo" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                    {profile.businessName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Uploading...' : 'Change Logo'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Display Name</Label>
                  <Input
                    id="businessName"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={profile.ownerName}
                    onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={profile.gst}
                  onChange={(e) => setProfile({ ...profile, gst: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={profile.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({ ...profile, pincode: value });
                    }}
                    className="mt-1"
                    maxLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="locality">Locality</Label>
                  <Input
                    id="locality"
                    value={profile.locality}
                    onChange={(e) => setProfile({ ...profile, locality: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapLocation">Business Location</Label>
                <Input
                  id="mapLocation"
                  value={profile.mapLocation}
                  onChange={(e) => setProfile({ ...profile, mapLocation: e.target.value })}
                  placeholder="Enter business location for Google Maps"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                    placeholder="https://facebook.com/"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    placeholder="https://instagram.com/"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="x">X</Label>
                  <Input
                    id="x"
                    value={profile.x}
                    onChange={(e) => setProfile({ ...profile, x: e.target.value })}
                    placeholder="https://x.com/"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={profile.youtube}
                    onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                    placeholder="https://youtube.com/"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={profile.accountHolderName}
                    onChange={(e) => setProfile({ ...profile, accountHolderName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={profile.bankName}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={profile.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({ ...profile, accountNumber: value });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={profile.ifscCode}
                    onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input
                    id="branchName"
                    value={profile.branchName}
                    onChange={(e) => setProfile({ ...profile, branchName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={profile.upiId}
                    onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., user@paytm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={profile.openTime}
                    onChange={(e) => setProfile({ ...profile, openTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={profile.closeTime}
                    onChange={(e) => setProfile({ ...profile, closeTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Days Open</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={profile.days.includes(day)}
                        onCheckedChange={(checked) => {
                          const newDays = checked ? [...profile.days, day] : profile.days.filter((d: string) => d !== day);
                          setProfile({ ...profile, days: newDays });
                        }}
                      />
                      <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={profile.tags}
                  onChange={(e) => setProfile({ ...profile, tags: e.target.value })}
                  placeholder="e.g., fast food, delivery, vegetarian"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Enter tags separated by commas</p>
              </div>

              <div>
                <Label>Accepted Payment Methods</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {['Cash', 'Credit/Debit Card', 'UPI', 'Net Banking', 'Digital Wallets'].map(method => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`payment-${method}`}
                        checked={profile.paymentMethods.includes(method)}
                        onCheckedChange={(checked) => {
                          const newMethods = checked ? [...profile.paymentMethods, method] : profile.paymentMethods.filter((m: string) => m !== method);
                          setProfile({ ...profile, paymentMethods: newMethods });
                        }}
                      />
                      <Label htmlFor={`payment-${method}`}>{method}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="minOrderValue">Minimum Order Value</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  value={profile.minOrderValue}
                  onChange={(e) => setProfile({ ...profile, minOrderValue: Number(e.target.value) })}
                  className="mt-1"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store-images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Images</CardTitle>
              <p className="text-sm text-gray-600">Upload up to 3 photos of your store</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display current images */}
              {profile.storeImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.storeImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Store ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => removeStoreImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload section */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => storeImagesInputRef.current?.click()}
                  disabled={storeImagesLoading || profile.storeImages.length >= 3}
                >
                  {storeImagesLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  {storeImagesLoading ? 'Uploading...' : 'Upload Store Images'}
                </Button>
                <input
                  ref={storeImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleStoreImagesUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">
                  JPG, PNG up to 5MB each. {profile.storeImages.length}/3 images uploaded.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Confirm Profile Update
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update your profile? This action will save all changes to your business information.
              Please review your changes carefully before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Confirm Update
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
