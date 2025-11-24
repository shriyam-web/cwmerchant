'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Save, Eye, ExternalLink, Loader2, AlertTriangle, X, Plus, Trash2, HelpCircle, Building2, Banknote, Clock, Images, Package, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useMerchantAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface ExtendedMerchant {
  id: string;
  email: string;
  businessName: string;
  role: "merchant";
  status: "active" | "pending" | "suspended" | "inactive";
  merchantId?: string;
  merchantSlug?: string;
  legalName?: string;
  displayName?: string;
  emailVerified?: boolean;
  phone?: string;
  username?: string;
  whatsapp?: string;
  agentId?: string;
  agentName?: string;
  category?: string;
  city?: string;
  streetAddress?: string;
  pincode?: string;
  locality?: string;
  state?: string;
  country?: string;
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

interface ProfileSettingsProps {
  tourIndex?: number;
  tourTarget?: string;
}

export function ProfileSettings({ tourIndex, tourTarget }: ProfileSettingsProps) {
  const { merchant, setMerchant } = useMerchantAuth() as {
    merchant: ExtendedMerchant | null;
    setMerchant: ((merchant: ExtendedMerchant) => void) | null;
  };

  const [activeTab, setActiveTab] = useState<string>("basic");

  // Update active tab based on tour target ID
  useEffect(() => {
    if (tourTarget) {
      const targetTabMapping: Record<string, string> = {
        "#tour-profile-basic": "basic",
        "#tour-profile-business": "business",
        "#tour-profile-banking": "banking",
        "#tour-profile-hours": "hours",
        "#tour-profile-images": "store-images",
        "#tour-profile-additional": "additional",
      };
      const newTab = targetTabMapping[tourTarget];
      if (newTab) {
        setActiveTab(newTab);
      }
    }
  }, [tourTarget]);

  const [profile, setProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    username: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    locality: '',
    gst: '',
    pan: '',
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
    minOrderValue: 149,
    agentId: '',
    agentName: '',
    // FAQ
    faq: [] as Array<{ question: string; answer: string; certifiedBuyer?: boolean; isLike?: boolean }>
  });

  const [initialProfile, setInitialProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    username: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    locality: '',
    gst: '',
    pan: '',
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
    minOrderValue: 149,
    agentId: '',
    agentName: '',
    // FAQ
    faq: [] as Array<{ question: string; answer: string; certifiedBuyer?: boolean; isLike?: boolean }>
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeImagesInputRef = useRef<HTMLInputElement>(null);
  const [storeImagesLoading, setStoreImagesLoading] = useState(false);

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);

  // Username availability states
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameMessage, setUsernameMessage] = useState<string>('');

  // Debounced username check function
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.trim() === '') {
      setUsernameAvailable(null);
      setUsernameMessage('');
      return;
    }

    setUsernameChecking(true);
    try {
      const response = await fetch('/api/merchant/profile/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          merchantId: merchant?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsernameAvailable(data.available);
        setUsernameMessage(data.message);
      } else {
        setUsernameAvailable(false);
        setUsernameMessage(data.message || 'Failed to check username');
      }
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailable(false);
      setUsernameMessage('Failed to check username availability');
    } finally {
      setUsernameChecking(false);
    }
  }, [merchant?.id]);

  // Debounced username check with timeout
  const debouncedUsernameCheck = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (username: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => checkUsernameAvailability(username), 500);
      };
    })(),
    [checkUsernameAvailability]
  );

  // Check initial username availability when merchant data loads
  useEffect(() => {
    if (merchant?.username && profile.username === merchant.username) {
      checkUsernameAvailability(merchant.username);
    }
  }, [merchant?.username, checkUsernameAvailability, profile.username]);

  useEffect(() => {
    console.log('Profile useEffect triggered, merchant:', merchant?.username);
    if (merchant) {
      const profileData = {
        businessName: merchant.businessName || '',
        ownerName: merchant.legalName || merchant.displayName || '',
        email: merchant.email || '',
        phone: merchant.phone || '',
        username: merchant.username || '',
        whatsapp: merchant.whatsapp || '',
        address: merchant.streetAddress || '',
        city: merchant.city || '',
        state: merchant.state || '',
        pincode: merchant.pincode || '',
        locality: merchant.locality || '',
        gst: merchant.gstNumber || '',
        pan: merchant.panNumber || '',
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
        minOrderValue: merchant.minimumOrderValue || 149,
        agentId: merchant.agentId || '',
        agentName: merchant.agentName || '',
        faq: (merchant as any).faq || []
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

    // Convert file to base64 for cropping
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedAreaPercent: any, croppedAreaPixels: any) => {
    console.log('Crop completed:', { croppedAreaPercent, croppedAreaPixels });
    setCroppedArea(croppedAreaPercent);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async (): Promise<Blob | null> => {
    if (!cropImage || !croppedArea || !croppedAreaPixels) {
      console.error('Missing cropImage, croppedArea, or croppedAreaPixels');
      return null;
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        try {
          console.log('Original image dimensions:', image.naturalWidth, 'x', image.naturalHeight);
          console.log('Cropped area (percent):', croppedArea);
          console.log('Cropped area pixels:', croppedAreaPixels);

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Unable to get canvas context'));
            return;
          }

          // Calculate the correct coordinates based on the original image dimensions
          // The croppedArea gives percentages, so we convert to actual pixel coordinates
          const x = Math.round((croppedArea.x / 100) * image.naturalWidth);
          const y = Math.round((croppedArea.y / 100) * image.naturalHeight);
          const width = Math.round((croppedArea.width / 100) * image.naturalWidth);
          const height = Math.round((croppedArea.height / 100) * image.naturalHeight);

          console.log('Calculated coordinates:', { x, y, width, height });

          // Set canvas size to the cropped area size
          canvas.width = width;
          canvas.height = height;

          // Draw the cropped portion of the image onto the canvas
          ctx.drawImage(
            image,
            x,
            y,
            width,
            height,
            0,
            0,
            width,
            height
          );

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log('Successfully created cropped blob, size:', blob.size);
                resolve(blob);
              } else {
                reject(new Error('Failed to generate cropped image blob'));
              }
            },
            'image/png',
            0.95
          );
        } catch (error) {
          console.error('Error creating cropped image:', error);
          reject(error);
        }
      };

      image.onerror = (error) => {
        console.error('Error loading image for cropping:', error);
        reject(new Error('Failed to load image for cropping'));
      };

      image.src = cropImage;
    });
  };

  const handleCropConfirm = async () => {
    console.log('Starting crop confirmation, croppedAreaPixels:', croppedAreaPixels);
    setLoading(true);

    try {
      const croppedBlob = await createCroppedImage();
      if (!croppedBlob) {
        console.error('createCroppedImage returned null');
        toast.error('Failed to process cropped image');
        return;
      }

      console.log('Cropped blob created, size:', croppedBlob.size);
      setShowCropModal(false);

      const file = new File([croppedBlob], 'cropped-logo.png', { type: 'image/png' });
      console.log('Created file for upload, size:', file.size);

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadResponse.json();
      console.log('Upload response:', uploadResponse.status, data);

      if (uploadResponse.ok) {
        setProfile((prevProfile) => ({ ...prevProfile, logo: data.url }));
        toast.success('Logo uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Crop/Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setCropImage('');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCroppedArea(null);
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
        setProfile((prevProfile) => ({
          ...prevProfile,
          storeImages: [...prevProfile.storeImages, ...data.urls]
        }));
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

  const removeStoreImage = async (index: number) => {
    const imageUrl = profile.storeImages[index];

    try {
      // Delete from Cloudinary
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove from state after successful deletion from Cloudinary
        setProfile((prevProfile) => ({
          ...prevProfile,
          storeImages: prevProfile.storeImages.filter((_, i) => i !== index),
        }));
        toast.success('Image deleted successfully!');
      } else {
        toast.error(data.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  const removeLogo = async () => {
    if (!profile.logo) {
      toast.error('No logo to remove');
      return;
    }

    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: profile.logo }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          logo: '',
        }));
        toast.success('Logo removed successfully!');
      } else {
        toast.error(data.error || 'Failed to remove logo');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove logo. Please try again.');
    }
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
      console.log('Sending username:', profile.username);
      const updateData = {
        displayName: profile.businessName,
        legalName: profile.ownerName,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        username: profile.username,
        agentId: profile.agentId,
        agentName: profile.agentName,
        streetAddress: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        locality: profile.locality,
        gstNumber: profile.gst,
        panNumber: profile.pan,
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
        faq: profile.faq,
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

      console.log('Profile update response:', response.status, data);

      if (response.ok) {
        // Update the merchant state with the new data
        if (setMerchant && data.merchant) {
          console.log('Updating merchant with:', data.merchant.username);
          console.log('Merchant FAQ:', data.merchant.faq);
          setMerchant(data.merchant);
        }
        
        // Update profile state with returned merchant data to ensure FAQ and all data persists
        const updatedProfileData = {
          ...profile,
          faq: data.merchant?.faq || profile.faq,
        };
        
        setProfile(updatedProfileData);
        setInitialProfile(updatedProfileData);
        toast.success('Profile updated successfully!');
      } else {
        console.error('Profile update failed:', data.error);
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
    <>
      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden dark:bg-slate-800 dark:text-white dark:border-blue-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <Crop className="h-5 w-5" />
              Crop Your Logo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={true}
                restrictPosition={true}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCropModal(false);
                  setCropImage('');
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                  setCroppedArea(null);
                }}
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                Cancel
              </Button>
              <Button onClick={handleCropConfirm} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Apply Crop
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen">
      {/* Premium Header */}
      <div className="border-b border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your complete business profile and information</p>
            </div>
            <Button
              onClick={() => merchant?.merchantSlug && window.open(`https://www.citywitty.com/merchants/${merchant.merchantSlug}`, '_blank')}
              disabled={!merchant?.merchantSlug}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Store
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900 h-auto mb-8">
            <TabsTrigger value="basic" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=inactive]:bg-orange-100 dark:data-[state=inactive]:bg-slate-700 data-[state=inactive]:text-orange-700 dark:data-[state=inactive]:text-slate-300 transition-all duration-200 font-medium">
              <span className="hidden sm:inline">Basic</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:bg-emerald-100 dark:data-[state=inactive]:bg-slate-700 data-[state=inactive]:text-emerald-700 dark:data-[state=inactive]:text-slate-300 transition-all duration-200 font-medium">Business</TabsTrigger>
            <TabsTrigger value="banking" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-purple-100 dark:data-[state=inactive]:bg-slate-700 data-[state=inactive]:text-purple-700 dark:data-[state=inactive]:text-slate-300 transition-all duration-200 font-medium">
              <span className="hidden sm:inline">Banking</span>
              <span className="sm:hidden">Bank</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=inactive]:bg-orange-100 dark:data-[state=inactive]:bg-slate-700 data-[state=inactive]:text-orange-700 dark:data-[state=inactive]:text-slate-300 transition-all duration-200 font-medium">
              <span className="hidden sm:inline">Hours</span>
              <span className="sm:hidden">Hrs</span>
            </TabsTrigger>
            <TabsTrigger value="store-images" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-blue-100 dark:data-[state=inactive]:bg-slate-700 data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-slate-300 transition-all duration-200 font-medium">
              <span className="hidden sm:inline">Images</span>
              <span className="sm:hidden">Imgs</span>
            </TabsTrigger>
            <TabsTrigger value="additional" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=inactive]:bg-pink-100 dark:data-[state=inactive]:bg-slate-700 data-[state=inactive]:text-pink-700 dark:data-[state=inactive]:text-slate-300 transition-all duration-200 font-medium">
              <span className="hidden sm:inline">More</span>
              <span className="sm:hidden">+</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card id="tour-profile-basic" className="shadow-md border border-orange-200 dark:border-orange-900 rounded-xl overflow-hidden bg-white dark:bg-orange-950/20 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-700 border-b border-orange-800 dark:border-red-900">
              <CardHeader className="py-6 px-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Basic Information</CardTitle>
                    <CardDescription className="text-orange-50 dark:text-orange-100 mt-1">Update your business name, contact details, and description</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 ring-4 ring-gray-100 dark:ring-gray-900 transition-all duration-300 group-hover:ring-gray-200 dark:group-hover:ring-gray-800">
                    <AvatarImage src={profile.logo} alt="Business Logo" />
                    <AvatarFallback className="bg-gradient-to-br from-gray-100 dark:from-gray-900 to-gray-100 dark:to-gray-900 text-gray-600 dark:text-gray-400 text-3xl font-bold">
                      {profile.businessName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full flex items-center justify-center">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="text-center sm:text-left space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 mr-2" />
                      )}
                      {loading ? 'Uploading...' : 'Change Logo'}
                    </Button>
                    {profile.logo && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removeLogo}
                        disabled={loading}
                        className="transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Logo
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName" className="text-sm font-semibold text-gray-900 dark:text-white">Display Name</Label>
                  <Input
                    id="businessName"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName" className="text-sm font-semibold text-gray-900 dark:text-white">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={profile.ownerName}
                    onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-900 dark:text-white">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => {
                      const newUsername = e.target.value;
                      setProfile({ ...profile, username: newUsername });
                      debouncedUsernameCheck(newUsername);
                    }}
                    className={`mt-2 transition-all duration-200 dark:bg-gray-700 dark:text-white ${
                      usernameAvailable === false ? 'border-red-500 focus:ring-red-200 focus:border-red-500 dark:border-red-600 dark:focus:ring-red-500' :
                      usernameAvailable === true ? 'border-green-500 focus:ring-green-200 focus:border-green-500 dark:border-green-600 dark:focus:ring-green-500' : 'border-gray-300 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-500 focus:border-gray-500'
                    }`}
                  />
                  {profile.username && (
                    <div className="mt-2 space-y-2">
                      {usernameChecking ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Checking availability...
                        </div>
                      ) : usernameMessage && (
                        <div className={`text-sm ${
                          usernameAvailable === true ? 'text-green-600 dark:text-green-400' :
                          usernameAvailable === false ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {usernameMessage}
                        </div>
                      )}
                      {usernameAvailable === true && profile.username && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🎉</span>
                            <span className="font-medium">Exciting!</span>
                          </div>
                          <p className="mt-1">
                            You'll be able to access your profile at{' '}
                            <span className="font-mono bg-white dark:bg-gray-600 px-2 py-1 rounded border text-gray-700 dark:text-gray-400">
                              citywitty.com/{profile.username.toLowerCase()}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-900 dark:text-white">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-sm font-semibold text-gray-900 dark:text-white">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={profile.whatsapp}
                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500 transition-all duration-200"
                    placeholder="+91"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-gray-900 dark:text-white">Business Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500 transition-all duration-200"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card id="tour-profile-business" className="shadow-md border border-emerald-200 dark:border-emerald-900 rounded-xl overflow-hidden bg-white dark:bg-emerald-950/20 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 border-b border-emerald-800 dark:border-emerald-900">
              <CardHeader className="py-6 px-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Business Details</CardTitle>
                    <CardDescription className="text-emerald-100 dark:text-emerald-200 mt-1">Business information, tax details, and location</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="gst" className="text-sm font-medium dark:text-white">GST Number</Label>
                  <Input
                    id="gst"
                    value={profile.gst}
                    onChange={(e) => setProfile({ ...profile, gst: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                    placeholder="Enter GST number"
                  />
                </div>
                <div>
                  <Label htmlFor="pan" className="text-sm font-medium dark:text-white">PAN Number</Label>
                  <Input
                    id="pan"
                    value={profile.pan}
                    onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase() })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium dark:text-white">Street Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  rows={3}
                  placeholder="Enter complete street address"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium dark:text-white">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium dark:text-white">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode" className="text-sm font-medium dark:text-white">Pincode</Label>
                  <Input
                    id="pincode"
                    value={profile.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({ ...profile, pincode: value });
                    }}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                    maxLength={6}
                    placeholder="Pincode"
                  />
                </div>
                <div>
                  <Label htmlFor="locality" className="text-sm font-medium dark:text-white">Locality</Label>
                  <Input
                    id="locality"
                    value={profile.locality}
                    onChange={(e) => setProfile({ ...profile, locality: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                    placeholder="Locality"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapLocation" className="text-sm font-medium dark:text-white">Google Map Location</Label>
                <Input
                  id="mapLocation"
                  value={profile.mapLocation}
                  onChange={(e) => setProfile({ ...profile, mapLocation: e.target.value })}
                  placeholder="Enter business location for Google Maps"
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website" className="text-sm font-medium dark:text-white">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://"
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook" className="text-sm font-medium dark:text-white">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                    placeholder="https://facebook.com/"
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-sm font-medium dark:text-white">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    placeholder="https://instagram.com/"
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-medium dark:text-white">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/"
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="x" className="text-sm font-medium dark:text-white">X</Label>
                  <Input
                    id="x"
                    value={profile.x}
                    onChange={(e) => setProfile({ ...profile, x: e.target.value })}
                    placeholder="https://x.com/"
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube" className="text-sm font-medium dark:text-white">YouTube</Label>
                  <Input
                    id="youtube"
                    value={profile.youtube}
                    onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                    placeholder="https://youtube.com/"
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-6">
          <Card id="tour-profile-banking" className="shadow-md border border-purple-200 dark:border-purple-900 rounded-xl overflow-hidden bg-white dark:bg-purple-950/20 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 border-b border-purple-800 dark:border-purple-900">
              <CardHeader className="py-6 px-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-lg">
                    <Banknote className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Banking Information</CardTitle>
                    <CardDescription className="text-purple-100 dark:text-purple-200 mt-1">Bank account and payment details for settlements</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="accountHolderName" className="text-sm font-medium dark:text-white">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={profile.accountHolderName}
                    onChange={(e) => setProfile({ ...profile, accountHolderName: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 transition-all duration-200"
                    placeholder="Account holder name"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName" className="text-sm font-medium dark:text-white">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={profile.bankName}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 transition-all duration-200"
                    placeholder="Bank name"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="text-sm font-medium dark:text-white">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={profile.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfile({ ...profile, accountNumber: value });
                    }}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 transition-all duration-200"
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode" className="text-sm font-medium dark:text-white">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={profile.ifscCode}
                    onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 transition-all duration-200"
                    placeholder="IFSC code"
                  />
                </div>
                <div>
                  <Label htmlFor="branchName" className="text-sm font-medium dark:text-white">Branch Name</Label>
                  <Input
                    id="branchName"
                    value={profile.branchName}
                    onChange={(e) => setProfile({ ...profile, branchName: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 transition-all duration-200"
                    placeholder="Branch name"
                  />
                </div>
                <div>
                  <Label htmlFor="upiId" className="text-sm font-medium dark:text-white">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={profile.upiId}
                    onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 transition-all duration-200"
                    placeholder="e.g., user@paytm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card id="tour-profile-hours" className="shadow-md border border-orange-200 dark:border-orange-900 rounded-xl overflow-hidden bg-white dark:bg-orange-950/20 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 border-b border-orange-800 dark:border-orange-900">
              <CardHeader className="py-6 px-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Business Hours</CardTitle>
                    <CardDescription className="text-orange-100 dark:text-orange-200 mt-1">Set your operating hours and days</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="openTime" className="text-sm font-medium dark:text-white">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={profile.openTime}
                    onChange={(e) => setProfile({ ...profile, openTime: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime" className="text-sm font-medium dark:text-white">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={profile.closeTime}
                    onChange={(e) => setProfile({ ...profile, closeTime: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium dark:text-white">Days Open</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-200">
                      <Checkbox
                        id={`day-${day}`}
                        checked={profile.days.includes(day)}
                        onCheckedChange={(checked) => {
                          const newDays = checked ? [...profile.days, day] : profile.days.filter((d: string) => d !== day);
                          setProfile({ ...profile, days: newDays });
                        }}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor={`day-${day}`} className="cursor-pointer text-sm dark:text-white">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional" className="space-y-6">
          <Card id="tour-profile-additional" className="shadow-md border border-pink-200 dark:border-pink-900 rounded-xl overflow-hidden bg-white dark:bg-pink-950/20 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 dark:from-pink-700 dark:to-pink-800 border-b border-pink-800 dark:border-pink-900">
              <CardHeader className="py-6 px-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Additional Information</CardTitle>
                    <CardDescription className="text-pink-100 dark:text-pink-200 mt-1">Tags, payment methods, minimum order, and FAQs</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              <div>
                <Label htmlFor="tags" className="text-sm font-medium dark:text-white">Tags</Label>
                <Input
                  id="tags"
                  value={profile.tags}
                  onChange={(e) => setProfile({ ...profile, tags: e.target.value })}
                  placeholder="e.g., fast food, delivery, vegetarian"
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500 transition-all duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter tags separated by commas</p>
              </div>

              <div>
                <Label className="text-sm font-medium dark:text-white">Accepted Payment Methods</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {['Cash', 'Credit/Debit Card', 'UPI', 'Net Banking', 'Digital Wallets'].map(method => (
                    <div key={method} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-pink-50 dark:hover:bg-gray-700 transition-all duration-200">
                      <Checkbox
                        id={`payment-${method}`}
                        checked={profile.paymentMethods.includes(method)}
                        onCheckedChange={(checked) => {
                          const newMethods = checked ? [...profile.paymentMethods, method] : profile.paymentMethods.filter((m: string) => m !== method);
                          setProfile({ ...profile, paymentMethods: newMethods });
                        }}
                        className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                      />
                      <Label htmlFor={`payment-${method}`} className="cursor-pointer text-sm dark:text-white">{method}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="minOrderValue" className="text-sm font-medium dark:text-white">Minimum Order Value</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  value={profile.minOrderValue}
                  onChange={(e) => setProfile({ ...profile, minOrderValue: Number(e.target.value) })}
                  className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500 transition-all duration-200"
                  min="0"
                  placeholder="Minimum order value"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="agentId" className="text-sm font-medium dark:text-white">Agent ID</Label>
                  <Input
                    id="agentId"
                    value={profile.agentId}
                    onChange={(e) => setProfile({ ...profile, agentId: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500 transition-all duration-200"
                    placeholder="Enter agent ID"
                  />
                </div>
                <div>
                  <Label htmlFor="agentName" className="text-sm font-medium dark:text-white">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={profile.agentName}
                    onChange={(e) => setProfile({ ...profile, agentName: e.target.value })}
                    className="mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500 transition-all duration-200"
                    placeholder="Enter agent name"
                  />
                </div>
              </div>

              <div className="border-t-2 border-pink-200 dark:border-pink-900 pt-8">
                <Card className="border border-pink-200 dark:border-pink-900 bg-white dark:bg-pink-950/20 rounded-lg shadow-sm">
                  <CardHeader className="py-6 px-6">
                    <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                      <HelpCircle className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                      Frequently Asked Questions (FAQs)
                    </CardTitle>
                    <CardDescription className="mt-2 dark:text-gray-300">Help customers by answering common questions about your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {profile.faq.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your FAQs ({profile.faq.length})</h4>
                        <div className="grid gap-3">
                          {profile.faq.map((item, index) => (
                            <div key={index} className="group relative p-4 rounded-lg border border-pink-200 dark:border-pink-700 bg-gradient-to-r from-pink-50 dark:from-pink-950/40 to-pink-50 dark:to-pink-950/30 hover:shadow-md transition-all duration-200">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 pr-8">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.question}</p>
                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">Q{index + 1}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setProfile({
                                      ...profile,
                                      faq: profile.faq.filter((_, i) => i !== index)
                                    });
                                    toast.success('FAQ removed');
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t-2 border-pink-200 dark:border-pink-700 pt-6">
                      <h4 className="text-sm font-semibold text-pink-700 dark:text-pink-300 mb-4">Add New FAQ</h4>
                      <div className="space-y-4 p-5 rounded-lg border-2 border-dashed border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-950/20">
                        <div>
                          <Label htmlFor="faq-question-new" className="text-sm font-medium text-gray-700 dark:text-gray-300">Question <span className="text-red-500">*</span></Label>
                          <Input
                            id="faq-question-new"
                            placeholder="e.g., What is your delivery time?"
                            className="mt-2 border-gray-200 dark:border-gray-700 dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 transition-all duration-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="faq-answer-new" className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer <span className="text-red-500">*</span></Label>
                          <Textarea
                            id="faq-answer-new"
                            placeholder="Provide a helpful answer..."
                            className="mt-2 border-gray-200 dark:border-gray-700 dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 transition-all duration-200"
                            rows={4}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            const questionInput = document.getElementById('faq-question-new') as HTMLInputElement;
                            const answerInput = document.getElementById('faq-answer-new') as HTMLTextAreaElement;
                            
                            if (questionInput?.value.trim() && answerInput?.value.trim()) {
                              setProfile({
                                ...profile,
                                faq: [
                                  ...profile.faq,
                                  {
                                    question: questionInput.value.trim(),
                                    answer: answerInput.value.trim(),
                                    certifiedBuyer: false,
                                    isLike: false
                                  }
                                ]
                              });
                              questionInput.value = '';
                              answerInput.value = '';
                              toast.success('FAQ added successfully!');
                            } else {
                              toast.error('Please fill in both question and answer');
                            }
                          }}
                          className="w-full bg-pink-600 dark:bg-pink-700 hover:bg-pink-700 dark:hover:bg-pink-800 text-white font-medium transition-all"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add FAQ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store-images" className="space-y-6">
          <Card id="tour-profile-images" className="shadow-md border border-blue-200 dark:border-blue-900 rounded-xl overflow-hidden bg-white dark:bg-blue-950/20 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 border-b border-blue-800 dark:border-blue-900">
              <CardHeader className="py-6 px-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-lg">
                    <Images className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Store Images</CardTitle>
                    <CardDescription className="text-blue-100 dark:text-blue-200 mt-1">Upload up to 3 photos of your store (JPG, PNG up to 5MB each)</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              {/* Display current images */}
              {profile.storeImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {profile.storeImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Store ${index + 1}`}
                        className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl pointer-events-none"></div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 h-8 w-8 p-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        onClick={() => removeStoreImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>JPG, PNG up to 5MB each</p>
                  <p className="font-medium text-blue-600 dark:text-blue-400">{profile.storeImages.length}/3 images uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>

      {/* Floating Save Changes Button */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-80 flex flex-col sm:flex-row items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-amber-200 dark:border-amber-700 shadow-lg text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p className="font-medium">Unsaved changes</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => {
                setProfile(initialProfile);
              }}
              disabled={saving}
              variant="outline"
              className="flex-1 sm:flex-none border-blue-300 dark:border-blue-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl text-white font-semibold py-2.5"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      )}

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
    </>
  );
}
