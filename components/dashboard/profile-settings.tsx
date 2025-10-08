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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Profile Settings</h2>
          <p className="text-gray-600 mt-1">Manage your business profile and settings</p>
        </div>
        <Button variant="outline" className="hover:shadow-md transition-all duration-200 border-blue-200 hover:border-blue-300">
          <Eye className="h-4 w-4 mr-2" />
          Preview Shop
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 overflow-x-auto">
          <TabsTrigger value="basic" className="text-xs sm:text-sm">Basic Info</TabsTrigger>
          <TabsTrigger value="business" className="text-xs sm:text-sm">Business</TabsTrigger>
          <TabsTrigger value="banking" className="text-xs sm:text-sm">Banking</TabsTrigger>
          <TabsTrigger value="hours" className="text-xs sm:text-sm">Hours</TabsTrigger>
          <TabsTrigger value="store-images" className="text-xs sm:text-sm">Images</TabsTrigger>
          <TabsTrigger value="additional" className="text-xs sm:text-sm">Additional</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-blue-200">
                    <AvatarImage src={profile.logo} alt="Business Logo" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-3xl font-bold">
                      {profile.businessName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full flex items-center justify-center">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
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
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="gst" className="text-sm font-medium">GST Number</Label>
                <Input
                  id="gst"
                  value={profile.gst}
                  onChange={(e) => setProfile({ ...profile, gst: e.target.value })}
                  className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="Enter GST number"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">Street Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  rows={3}
                  placeholder="Enter complete street address"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
                  <Input
                    id="pincode"
                    value={profile.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({ ...profile, pincode: value });
                    }}
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    maxLength={6}
                    placeholder="Pincode"
                  />
                </div>
                <div>
                  <Label htmlFor="locality" className="text-sm font-medium">Locality</Label>
                  <Input
                    id="locality"
                    value={profile.locality}
                    onChange={(e) => setProfile({ ...profile, locality: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    placeholder="Locality"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapLocation" className="text-sm font-medium">Business Location</Label>
                <Input
                  id="mapLocation"
                  value={profile.mapLocation}
                  onChange={(e) => setProfile({ ...profile, mapLocation: e.target.value })}
                  placeholder="Enter business location for Google Maps"
                  className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://"
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                    placeholder="https://facebook.com/"
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    placeholder="https://instagram.com/"
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/"
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="x" className="text-sm font-medium">X</Label>
                  <Input
                    id="x"
                    value={profile.x}
                    onChange={(e) => setProfile({ ...profile, x: e.target.value })}
                    placeholder="https://x.com/"
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube" className="text-sm font-medium">YouTube</Label>
                  <Input
                    id="youtube"
                    value={profile.youtube}
                    onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                    placeholder="https://youtube.com/"
                    className="mt-2 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="mt-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Banking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="accountHolderName" className="text-sm font-medium">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={profile.accountHolderName}
                    onChange={(e) => setProfile({ ...profile, accountHolderName: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="Account holder name"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName" className="text-sm font-medium">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={profile.bankName}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="Bank name"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="text-sm font-medium">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={profile.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({ ...profile, accountNumber: value });
                    }}
                    className="mt-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode" className="text-sm font-medium">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={profile.ifscCode}
                    onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="IFSC code"
                  />
                </div>
                <div>
                  <Label htmlFor="branchName" className="text-sm font-medium">Branch Name</Label>
                  <Input
                    id="branchName"
                    value={profile.branchName}
                    onChange={(e) => setProfile({ ...profile, branchName: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="Branch name"
                  />
                </div>
                <div>
                  <Label htmlFor="upiId" className="text-sm font-medium">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={profile.upiId}
                    onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="e.g., user@paytm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="openTime" className="text-sm font-medium">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={profile.openTime}
                    onChange={(e) => setProfile({ ...profile, openTime: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime" className="text-sm font-medium">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={profile.closeTime}
                    onChange={(e) => setProfile({ ...profile, closeTime: e.target.value })}
                    className="mt-2 focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Days Open</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-orange-50 transition-all duration-200">
                      <Checkbox
                        id={`day-${day}`}
                        checked={profile.days.includes(day)}
                        onCheckedChange={(checked) => {
                          const newDays = checked ? [...profile.days, day] : profile.days.filter((d: string) => d !== day);
                          setProfile({ ...profile, days: newDays });
                        }}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor={`day-${day}`} className="cursor-pointer text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional" className="mt-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-pink-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                <Input
                  id="tags"
                  value={profile.tags}
                  onChange={(e) => setProfile({ ...profile, tags: e.target.value })}
                  placeholder="e.g., fast food, delivery, vegetarian"
                  className="mt-2 focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-2">Enter tags separated by commas</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Accepted Payment Methods</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {['Cash', 'Credit/Debit Card', 'UPI', 'Net Banking', 'Digital Wallets'].map(method => (
                    <div key={method} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-pink-50 transition-all duration-200">
                      <Checkbox
                        id={`payment-${method}`}
                        checked={profile.paymentMethods.includes(method)}
                        onCheckedChange={(checked) => {
                          const newMethods = checked ? [...profile.paymentMethods, method] : profile.paymentMethods.filter((m: string) => m !== method);
                          setProfile({ ...profile, paymentMethods: newMethods });
                        }}
                        className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                      />
                      <Label htmlFor={`payment-${method}`} className="cursor-pointer text-sm">{method}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="minOrderValue" className="text-sm font-medium">Minimum Order Value</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  value={profile.minOrderValue}
                  onChange={(e) => setProfile({ ...profile, minOrderValue: Number(e.target.value) })}
                  className="mt-2 focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                  min="0"
                  placeholder="Minimum order value"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store-images" className="mt-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Store Images
              </CardTitle>
              <p className="text-sm text-gray-600">Upload up to 3 photos of your store</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display current images */}
              {profile.storeImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {profile.storeImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Store ${index + 1}`}
                        className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        onClick={() => removeStoreImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => storeImagesInputRef.current?.click()}
                  disabled={storeImagesLoading || profile.storeImages.length >= 3}
                  className="hover:bg-teal-50 hover:border-teal-300 transition-all duration-200"
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
                <div className="text-sm text-gray-600">
                  <p>JPG, PNG up to 5MB each</p>
                  <p className="font-medium text-teal-600">{profile.storeImages.length}/3 images uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 mt-8">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        {hasChanges && (
          <p className="text-sm text-gray-500 self-center sm:self-end">
            You have unsaved changes
          </p>
        )}
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
