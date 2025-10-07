'use client';

import { useState, useEffect } from 'react';
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
import { Camera, Save, Eye, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
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
