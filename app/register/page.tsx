// app/register/page.tsx
'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import debounce from "lodash.debounce";
import { AlertCircle, CheckCircle as CheckIcon, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Rocket } from 'lucide-react'; // new icon
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from "@headlessui/react";
import allCities from '@/data/allCities.json';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Building2,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  Send,
  Handshake,
  Star,
  Globe
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import PrivacyPolicyPage from "../privacy-policy/page";
import TermsPage from "../terms/page";

const benefits = [
  {
    icon: Users,
    title: 'Increased Customer Base',
    description: 'Access to 50,000+ active CityWitty cardholders'
  },
  {
    icon: TrendingUp,
    title: 'Boost Revenue',
    description: 'Average 30% increase in sales for partner merchants'
  },
  {
    icon: Shield,
    title: 'Guaranteed Payments',
    description: 'Secure and timely payment processing'
  },
  {
    icon: Globe,
    title: 'Marketing Support',
    description: 'Featured placement on our platform and marketing materials'
  }
];

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 mt-16 pt-20 pb-20" onClick={onClose}>
      <div className="bg-white rounded-lg w-11/12 max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 p-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose} > ✕ </button>

        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    </div>
  );
}

const categories = [
  'Fashion & Clothing',
  'Footwear',
  'Salon & Spa',
  'Restaurants & Dining',
  'Hotels & Resorts',
  'Education & Careers',
  'Optical Stores',
  'Books & Stationery',
  'Household & Home Needs',
  'Watches & Accessories',
  'Hospital & Pharmacy',
  'Computers & IT',
  'Electronics & Appliances',
  'Mobile & Accessories',
  'Tattoo Studios',
  'Gifts & Flowers',
  'Sports & Fitness',
  'Automotive & Vehicles',
  'Travel & Tourism',
  'Real Estate & Property',
  'Jewellery & Ornaments',
  'Furniture & Home Décor',
  'Grocery & Supermarkets',
  'Entertainment & Gaming',
  'Pet Care & Supplies',
  'Healthcare & Clinics',
  'Logistics & Courier',
  'Event Management',
  'Agriculture & Farming',
  'Other Businesses'
];

const indianStatesAndUTs = [
  // States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',

  // Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

function SuccessScreen({ visible }: { visible: boolean }) {
  useEffect(() => {
    if (visible) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="success-screen">
      <h2>Form submitted successfully!</h2>
    </div>
  );
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

type CityAutocompleteProps = {
  value: string;
  onChange: (val: string) => void;
};
function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  // useMemo to filter cities efficiently
  const filteredCities = useMemo(() => {
    if (!value) return [];
    const lowerVal = value.toLowerCase();

    const startsWithMatches = allCities.filter(city =>
      city.toLowerCase().startsWith(lowerVal)
    );

    const includesMatches = allCities.filter(city =>
      !city.toLowerCase().startsWith(lowerVal) &&
      city.toLowerCase().includes(lowerVal)
    );

    return [...startsWithMatches, ...includesMatches];
  }, [value]);

  const handleSelect = (val: string) => {
    onChange(val); // update parent
  };

  return (
    <div className="relative w-full">
      <Combobox value={value} onChange={handleSelect}>
        <Combobox.Input
          className="w-full border p-3 rounded-lg h-10"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your business city"
        />
        {filteredCities.length > 0 && (
          <Combobox.Options className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
            {filteredCities.map(city => {
              const index = city.toLowerCase().indexOf(value.toLowerCase());
              return (
                <Combobox.Option
                  key={city}
                  value={city}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {index >= 0 ? (
                    <>
                      {city.slice(0, index)}
                      <span className="font-bold">{city.slice(index, index + value.length)}</span>
                      {city.slice(index + value.length)}
                    </>
                  ) : city}
                </Combobox.Option>
              );
            })}
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  );
}
type StateAutocompleteProps = {
  value: string;
  onChange: (val: string) => void;
};
function StateAutocomplete({ value, onChange }: StateAutocompleteProps) {
  const [query, setQuery] = useState(value || '');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const filteredStates = useMemo(() => {
    if (!query) return indianStatesAndUTs;
    const lowerVal = query.toLowerCase();

    const startsWithMatches = indianStatesAndUTs.filter((state: string) =>
      state.toLowerCase().startsWith(lowerVal)
    );

    const includesMatches = indianStatesAndUTs.filter((state: string) =>
      !state.toLowerCase().startsWith(lowerVal) &&
      state.toLowerCase().includes(lowerVal)
    );

    return [...startsWithMatches, ...includesMatches];
  }, [query]);

  const handleSelect = (val: string) => {
    onChange(val);
    setQuery(val);
  };

  return (
    <div className="relative w-full">
      <Combobox value={value} onChange={handleSelect}>
        <Combobox.Input
          className="w-full border p-3 rounded-lg h-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search and select state"
          required
        />
        {filteredStates.length > 0 && (
          <Combobox.Options className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
            {filteredStates.map(state => {
              const queryLower = query?.toLowerCase() || '';
              const index = state.toLowerCase().indexOf(queryLower);
              return (
                <Combobox.Option
                  key={state}
                  value={state}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {index >= 0 ? (
                    <>
                      {state.slice(0, index)}
                      <span className="font-bold">{state.slice(index, index + queryLower.length)}</span>
                      {state.slice(index + queryLower.length)}
                    </>
                  ) : state}
                </Combobox.Option>
              );
            })}
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  );
}
const isValidURL = (url: string) => {
  if (!url) return false;
  const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(:\d+)?(\/[^\s]*)?$/i;

  return pattern.test(url);
};

export default function PartnerPage() {

  const initialFormData = {
    merchantId: '',
    legalName: '',
    displayName: '',
    email: '',
    emailVerified: false,
    phone: '',
    phoneVerified: false,
    password: '',
    confirmPassword: '',
    category: '',
    city: '',
    streetAddress: '',
    pincode: '',
    locality: '',
    state: '',
    country: 'India',
    whatsapp: '',
    isWhatsappSame: false,
    gstNumber: '',
    panNumber: '',
    businessType: '',
    yearsInBusiness: '',
    averageMonthlyRevenue: '',

    description: '',
    website: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      youtube: '',
      instagram: '',
      facebook: '',
    },
    businessHours: {
      open: '',
      close: '',
      days: [] as string[],
      openHour: '',
      openMinute: '',
      openPeriod: '',
      closeHour: '',
      closeMinute: '',
      closePeriod: '',
    },
    agreeToTerms: false
  };

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

  const [formData, setFormData] = useState(initialFormData);

  const [showPwdTooltip, setShowPwdTooltip] = useState(false);
  const pwdTooltipTimer = useRef<number | null>(null);
  const [showCopyPasteTooltip, setShowCopyPasteTooltip] = useState({ password: false, confirmPassword: false });

  const [checkingField, setCheckingField] = useState<{
    email?: boolean;
    phone?: boolean;
    gstNumber?: boolean;
    panNumber?: boolean;
  }>({});

  // password health tooltip
  const [pwdChecks, setPwdChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    let newOpen = formData.businessHours.open;
    let newClose = formData.businessHours.close;

    if (formData.businessHours.openHour && formData.businessHours.openMinute && formData.businessHours.openPeriod) {
      newOpen = `${formData.businessHours.openHour.padStart(2, '0')}:${formData.businessHours.openMinute} ${formData.businessHours.openPeriod}`;
    }

    if (formData.businessHours.closeHour && formData.businessHours.closeMinute && formData.businessHours.closePeriod) {
      newClose = `${formData.businessHours.closeHour.padStart(2, '0')}:${formData.businessHours.closeMinute} ${formData.businessHours.closePeriod}`;
    }

    if (newOpen !== formData.businessHours.open || newClose !== formData.businessHours.close) {
      setFormData(prev => ({
        ...prev,
        businessHours: {
          ...prev.businessHours,
          open: newOpen,
          close: newClose
        }
      }));
    }
  }, [formData.businessHours.openHour, formData.businessHours.openMinute, formData.businessHours.openPeriod, formData.businessHours.closeHour, formData.businessHours.closeMinute, formData.businessHours.closePeriod]);

  const checkPasswordRules = (pwd: string) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>_\-\\[\];'`~+\/=]/.test(pwd)
    };
    setPwdChecks(checks);
    return checks;
  };

  const handlePreventCopyPaste = (field: 'password' | 'confirmPassword') => {
    const handler = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      setShowCopyPasteTooltip(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setShowCopyPasteTooltip(prev => ({ ...prev, [field]: false }));
      }, 3000);
    };
    return handler;
  };

  // Debounced API call to check field uniqueness
  const checkUniqueRemote = useRef(
    debounce(async (field: string, value: string) => {
      try {
        setCheckingField(prev => ({ ...prev, [field]: true }));
        const res = await fetch("/api/partnerApplication/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field, value })
        });
        const data = await res.json();
        if (res.ok) {
          setFieldErrors(prev => ({
            ...prev,
            [field]: data.exists ? `${fieldLabel(field)} already registered` : undefined
          }));
        } else {
          // server returned error
          setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
      } catch (err) {
        console.error("checkUnique error", err);
        // don't block submit for network flakiness; but show generic
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
      } finally {
        setCheckingField(prev => ({ ...prev, [field]: false }));
      }
    }, 600)
  ).current;

  const fieldLabel = (f: string) => {
    if (f === "email") return "Email ID";
    if (f === "phone") return "Phone Number";
    if (f === "gstNumber") return "GST Number";
    if (f === "panNumber") return "PAN Number";
    if (f === "businessHours.open") return "Open Time";
    if (f === "businessHours.close") return "Close Time";
    if (f === "businessHours.days") return "Days Open";
    return f;
  };


  const downloadPDF = () => {
    const doc = new jsPDF();

    // --- Watermark ---
    doc.setFontSize(50);
    doc.setTextColor(200, 200, 200);
    doc.text("CityWitty", 105, 150, { align: "center", angle: 45 });
    doc.setTextColor(0, 0, 0); // reset color

    // --- Title ---
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CityWitty Merchant Hub Registration Confirmation", 10, 15);

    let y = 25; // starting y position

    // Helper to add section heading
    const addSection = (title: string) => {
      doc.setFillColor(220, 235, 255); // light blue background
      doc.rect(10, y - 6, 190, 10, "F"); // filled rectangle
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, 12, y);
      y += 12;
    };

    // Helper to add field line
    const addField = (label: string, value: any) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      let displayValue = value || "-";
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      }
      const text = `${label}: ${displayValue}`;
      const splitText = doc.splitTextToSize(text, 186); // wrap text if too long
      splitText.forEach((line: string) => {
        if (y > 280) { // Near bottom of page (A4 ~297mm, margin 10mm)
          doc.addPage();
          y = 20;
        }
        doc.text(line, 12, y);
        y += 7;
      });
      y += 2;
    };


    // --- Business Information ---
    addSection("Business Information");
    addField("Merchant ID", formData.merchantId);
    addField("Legal Name", formData.legalName);
    addField("Display Name", formData.displayName);
    addField("Category", formData.category);
    addField("City", formData.city);
    addField("Street Address", formData.streetAddress);
    addField("Pincode", formData.pincode);
    addField("Locality", formData.locality);
    addField("State", formData.state);
    addField("Country", formData.country);

    // --- Contact Information ---
    addSection("Contact Information");
    addField("Email", formData.email);
    addField("Phone", formData.phone);
    addField("WhatsApp", formData.whatsapp);
    addField("Website", formData.website);
    addField("LinkedIn", formData.socialLinks.linkedin);
    addField("Twitter", formData.socialLinks.twitter);
    addField("YouTube", formData.socialLinks.youtube);
    addField("Instagram", formData.socialLinks.instagram);
    addField("Facebook", formData.socialLinks.facebook);

    // --- Legal Information ---
    addSection("Legal Information");
    addField("GST Number", formData.gstNumber);
    addField("PAN Number", formData.panNumber);
    addField("Business Type", formData.businessType);

    // --- Business Details ---
    addSection("Business Details");
    addField("Years in Business", formData.yearsInBusiness);
    addField("Average Monthly Revenue", formData.averageMonthlyRevenue);
    addField("Business Description", formData.description);
    addField("Business Hours Open", formData.businessHours.open);
    addField("Business Hours Close", formData.businessHours.close);
    addField("Business Days", formData.businessHours.days.join(', '));


    // Save PDF
    doc.save(`${formData.displayName || 'CityWitty_Application'}.pdf`);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
    setFieldErrors({});
    setCurrentStep(0);
    setIsSubmitted(false);
    setShowMissingFieldsModal(false);
  };

  const showMissingFields = () => {
    setShowMissingFieldsModal(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      // Check if form has any data filled
      const hasData = Object.values(formData).some(value => {
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(v =>
            v !== '' && v !== null && v !== undefined && (typeof v !== 'object' || Object.keys(v).length > 0)
          );
        }
        return value !== false && value !== null && value !== undefined;
      });

      if (hasData) {
        event.preventDefault();
        event.returnValue = 'On refresh, all the filled in information will be lost. Perform refresh?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData]);

  const stepFields = [
    ['legalName', 'displayName', 'category', 'city', 'streetAddress', 'pincode', 'locality', 'state'], // step 0
    ['email', 'phone', 'whatsapp'], // step 1
    ['gstNumber', 'panNumber'], // step 2
    ['businessType', 'yearsInBusiness', 'averageMonthlyRevenue', 'description', 'businessHours.open', 'businessHours.close', 'businessHours.days'], // step 3
    ['password', 'confirmPassword', 'agreeToTerms'] // step 4
  ];

  const requiredFields = [
    "legalName",
    "displayName",
    "category",
    "city",
    "streetAddress",
    "pincode",
    "locality",
    "state",
    "email",
    "phone",
    "whatsapp",
    "gstNumber",
    "panNumber",
    "businessType",
    "yearsInBusiness",
    "averageMonthlyRevenue",
    "description",
    "agreeToTerms",
    "password",
    "confirmPassword",
  ];

  // Compute form validity
  const isFormValid = useMemo(() => {
    return requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      if (field === 'confirmPassword') {
        return value && value === formData.password;
      }
      return !!value;
    }) && formData.agreeToTerms && formData.businessHours.open && formData.businessHours.close && formData.businessHours.days.length > 0;
  }, [formData, requiredFields]);

  // Compute missing fields for tooltip
  const missingFields = useMemo(() => {
    const missing = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      if (field === 'confirmPassword') {
        return !value || value !== formData.password;
      }
      return !value;
    });
    if (!formData.businessHours.open) missing.push('businessHours.open');
    if (!formData.businessHours.close) missing.push('businessHours.close');
    if (formData.businessHours.days.length === 0) missing.push('businessHours.days');
    return missing;
  }, [formData, requiredFields]);

  const [showTooltip, setShowTooltip] = useState(false);

  // Compute completed steps
  const completedSteps = useMemo(() => {
    return stepFields.map(stepFields => stepFields.every(field => {
      if (field === 'businessHours.days') {
        return formData.businessHours.days.length > 0;
      }
      if (field.includes('.')) {
        const parts = field.split('.');
        let val: any = formData;
        for (const part of parts) {
          val = val[part];
        }
        return !!val;
      }
      return !!(formData as any)[field];
    }));
  }, [formData, stepFields]);

  // Compute incomplete steps (visited but not completed)
  const incompleteSteps = useMemo(() => {
    return stepFields.map((_, index) => visitedSteps.has(index) && !completedSteps[index]);
  }, [visitedSteps, completedSteps]);

  const isCurrentStepValid = useMemo(() => {
    const currentStepFields = stepFields[currentStep];
    return currentStepFields.every(field => !!formData[field as keyof typeof formData]);
  }, [formData, currentStep, stepFields]);

  const validateCurrentStep = useCallback(() => {
    const currentStepFields = stepFields[currentStep];
    const newFieldErrors = { ...fieldErrors };
    let hasErrors = false;

    currentStepFields.forEach((field: string) => {
      if (field === 'businessHours.days') {
        if (formData.businessHours.days.length === 0) {
          newFieldErrors[field] = 'At least one day must be selected';
          hasErrors = true;
        } else {
          delete newFieldErrors[field];
        }
      } else if (field.includes('.')) {
        const parts = field.split('.');
        let val = formData;
        for (const part of parts) {
          val = (val as Record<string, any>)[part];
        }
        if (!val) {
          newFieldErrors[field] = 'This field is required';
          hasErrors = true;
        } else {
          delete newFieldErrors[field];
        }
      } else if (!formData[field as keyof typeof formData]) {
        newFieldErrors[field] = 'This field is required';
        hasErrors = true;
      } else {
        delete newFieldErrors[field];
      }
    });

    setFieldErrors(newFieldErrors);
  }, [currentStep, formData, fieldErrors, stepFields]);

  const handleNextStep = () => {
    if (currentStep === 4) return; // Step 4 is submit

    validateCurrentStep(); // Show errors for current step but don't block navigation

    setVisitedSteps(prev => new Set(prev).add(currentStep + 1));
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousStep = () => {
    setVisitedSteps(prev => new Set(prev).add(currentStep - 1));
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation for all steps
    const requiredFields = [
      "legalName",
      "displayName",
      "category",
      "city",
      "streetAddress",
      "email",
      "phone",
      "whatsapp",
      "gstNumber",
      "panNumber",
      "businessType",
      "yearsInBusiness",
      "averageMonthlyRevenue",
      "description",
      "agreeToTerms",
      "password",
      "confirmPassword",
    ];

    const stepFields = [
      ['legalName', 'displayName', 'category', 'city', 'streetAddress', 'pincode', 'locality', 'state'], // step 0
      ['email', 'phone', 'whatsapp'], // step 1
      ['gstNumber', 'panNumber'], // step 2
      ['businessType', 'yearsInBusiness', 'averageMonthlyRevenue', 'description', 'businessHours.open', 'businessHours.close', 'businessHours.days'], // step 3
      ['password', 'confirmPassword', 'agreeToTerms'] // step 4
    ];

    let hasErrors = false;
    const newFieldErrors: any = {};

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newFieldErrors[field] = 'This field is required';
        hasErrors = true;
      }
    });

    if (!formData.businessHours.open) {
      newFieldErrors['businessHours.open'] = 'This field is required';
      hasErrors = true;
    }

    if (!formData.businessHours.close) {
      newFieldErrors['businessHours.close'] = 'This field is required';
      hasErrors = true;
    }

    if (formData.businessHours.days.length === 0) {
      newFieldErrors['businessHours.days'] = 'At least one day must be selected';
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Import bcryptjs dynamically to avoid SSR issues in Next.js
      const bcrypt = (await import('bcryptjs')).default;

      // Hash the password
      const hashedPassword = await bcrypt.hash(formData.password, 10); // 10 salt rounds

      // Create payload without confirmPassword
      const { confirmPassword, ...payload } = {
        ...formData,
        password: hashedPassword,
      };

      // Submit to API
      const response = await fetch('/api/partnerApplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const resData = await response.json();
        console.log('Submitted:', resData);
        setFormData(prev => ({ ...prev, merchantId: resData.merchantId }));
        setIsSubmitted(true);

        // Scroll to top so success screen is visible
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errData = await response.json();
        console.error('Submission failed:', errData);
        alert("Submission failed. Please check all required fields.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      setFormData(prev => {
        const updateNested = (obj: any, keys: string[], val: any): any => {
          if (keys.length === 1) {
            return { ...obj, [keys[0]]: val };
          }
          return { ...obj, [keys[0]]: updateNested(obj[keys[0]], keys.slice(1), val) };
        };
        return updateNested(prev, parts, value);
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // if changing certain identity fields, run uniqueness check (debounced)
    if (["email", "phone", "gstNumber", "panNumber"].includes(field)) {
      if (!value) {
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        return;
      }
      // simple client-side format gating (optional)
      if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
        setFieldErrors(prev => ({ ...prev, [field]: "Invalid email format" }));
        return;
      }
      if (field === "gstNumber" && value.length !== 15) {
        setFieldErrors(prev => ({ ...prev, [field]: "GST Number must be 15 characters" }));
        return;
      }
      if (field === "panNumber" && value.length !== 10) {
        setFieldErrors(prev => ({ ...prev, [field]: "PAN Number must be 10 characters" }));
        return;
      }
      // trigger server uniqueness check
      checkUniqueRemote(field, value);
    }

    // password live checks + show tooltip while typing
    if (field === "password") {
      const checks = checkPasswordRules(value);
      // show tooltip while typing; hide after 2.5s of inactivity
      setShowPwdTooltip(true);
      if (pwdTooltipTimer.current) window.clearTimeout(pwdTooltipTimer.current);
      pwdTooltipTimer.current = window.setTimeout(() => setShowPwdTooltip(false), 2500);
    }

    // if user toggles isWhatsappSame and we updated phone previously, keep whatsapp in sync
    if (field === "isWhatsappSame" && value) {
      setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
    }

    // Clear required field errors when filled
    if (requiredFields.includes(field) && value) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear confirmPassword error if matches
    if (field === 'confirmPassword' && value && value === formData.password) {
      setFieldErrors(prev => ({ ...prev, 'confirmPassword': undefined }));
    }

    // Clear agreeToTerms error if checked
    if (field === 'agreeToTerms' && value) {
      setFieldErrors(prev => ({ ...prev, 'agreeToTerms': undefined }));
    }

    // If field is in current step, re-validate to clear errors
    const currentStepFields = stepFields[currentStep];
    if (currentStepFields.includes(field)) {
      // Small delay to allow state update
      setTimeout(validateCurrentStep, 0);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* <Header /> */}
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-0 shadow-xl bg-green-50">
              <CardContent className="p-6 sm:p-12"> {/* Responsive padding */}
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
                  Application Submitted Successfully!
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-6 text-center">
                  Thank you for your interest in partnering with CityWitty. Our team will review your application and contact you within 2-3 business days.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
                  <p className="text-blue-800 font-medium">Merchant ID: {formData.merchantId}</p>
                  <p className="text-blue-600 text-sm">Please save this ID for future reference</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 w-full">
                  <Button
                    onClick={downloadPDF}
                    className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto max-w-xs"
                  >
                    Download Application PDF
                  </Button>

                  <Button
                    onClick={resetForm}
                    className="bg-green-500 hover:bg-green-600 w-full sm:w-auto max-w-xs"
                  >
                    Submit Another Application
                  </Button>
                </div>

              </CardContent>
            </Card>

          </div>
        </div>
        <Footer />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* <Header /> */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold"> <br />
                Partner With CityWitty
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join 1000+ premium merchants and grow your business with our exclusive discount platform
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-blue-100">Partner Merchants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-100">Active Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">30%</div>
                <div className="text-blue-100">Avg. Sales Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            <Card className="border-0 ">

              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2">
                  {[0, 1, 2, 3, 4].map(step => (
                    <div key={step} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(step)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${completedSteps[step] ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer shadow-md' : incompleteSteps[step] ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-md' : currentStep === step ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer'}`}
                      >
                        {step + 1}
                      </button>
                      {step < 4 && <div className={`w-8 h-1 transition-all duration-200 ${completedSteps[step] ? 'bg-green-600' : incompleteSteps[step] ? 'bg-red-600' : 'bg-gray-200'}`}></div>}
                    </div>
                  ))}
                </div>
              </div>

              <CardHeader className="text-center py-10 flex flex-col items-center space-y-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                  Merchant Registration Form for CityWitty Mall
                </CardTitle>

                <CardDescription className="text-md md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                  Start your journey to getting more customers for your business with CityWitty!
                </CardDescription>

                <div className="h-0.5 w-24 bg-indigo-200 rounded-full"></div>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Basic Business Information */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                        Step 1: Basic Business Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="merchantId" className="text-sm font-medium text-gray-700">Merchant ID</Label>
                          <Input
                            id="merchantId"
                            value={formData.merchantId || "auto-generated"}
                            disabled
                            className="bg-gradient-to-r from-gray-100 to-gray-200 cursor-not-allowed border-gray-300 focus:border-blue-500 shadow-sm rounded-lg h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="legalName" className="text-sm font-medium text-gray-700">Legal Name <span className="text-red-500">*</span></Label>
                          <Input
                            id="legalName"
                            value={formData.legalName}
                            onChange={(e) => handleInputChange('legalName', e.target.value)}
                            placeholder="Enter legal name of the Business"
                            required
                            className={`transition-all duration-300 ease-in-out shadow-sm border rounded-lg h-10 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm ${fieldErrors.legalName ? 'animate-pulse border-red-500 ring-2 ring-red-200 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                          />
                          {fieldErrors.legalName && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> {fieldErrors.legalName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">Display Name <span className="text-red-500">*</span></Label>
                          <Input
                            id="displayName"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                            placeholder="Enter display name of the business"
                            required
                            className={`transition-all duration-300 ease-in-out shadow-sm border rounded-lg h-10 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm ${fieldErrors.displayName ? 'animate-pulse border-red-500 ring-2 ring-red-200 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                          />
                          {fieldErrors.displayName && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> {fieldErrors.displayName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category">Business Category <span className="text-red-500">*</span></Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                          <CityAutocomplete
                            value={formData.city}
                            onChange={(val: string) => handleInputChange("city", val)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="streetAddress">Street Address <span className="text-red-500">*</span></Label>
                          <Input
                            id="streetAddress"
                            value={formData.streetAddress}
                            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                            placeholder="Address line"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                          <Input
                            id="pincode"
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              handleInputChange('pincode', value);
                            }}
                            placeholder="Enter 6-digit pincode"
                            maxLength={6}
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="locality">Locality <span className="text-red-500">*</span></Label>
                          <Input
                            id="locality"
                            value={formData.locality}
                            onChange={(e) => handleInputChange('locality', e.target.value)}
                            placeholder="Enter locality"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                          <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {indianStatesAndUTs.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            disabled
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                        Step 2: Contact Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Business Email <span className="text-red-500">*</span></Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onBlur={() => formData.email && checkUniqueRemote("email", formData.email)}
                            placeholder="business@email.com"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                          {checkingField.email ? (
                            <p className="text-sm text-gray-500 mt-1">Checking email…</p>
                          ) : fieldErrors.email ? (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> {fieldErrors.email}
                            </p>
                          ) : formData.email && isValidEmail(formData.email) ? (
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                              <CheckIcon className="w-4 h-4" /> Email looks good
                            </p>
                          ) : null}

                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Phone Number */}
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                            <PhoneInput
                              id="phone"
                              placeholder="Enter your number"
                              defaultCountry="IN"
                              value={formData.phone}
                              onChange={(value) => {
                                handleInputChange('phone', value || '');
                                if (formData.isWhatsappSame) handleInputChange('whatsapp', value || '');
                              }}
                              onBlur={() => formData.phone && checkUniqueRemote("phone", formData.phone)}
                              className="w-full border p-3 rounded-lg"
                              required
                            />
                            {checkingField.phone ? (
                              <p className="text-sm text-gray-500 mt-1">Checking phone…</p>
                            ) : fieldErrors.phone ? (
                              <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {fieldErrors.phone}
                              </p>
                            ) : null}

                          </div>

                          {/* WhatsApp Number */}
                          <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Number <span className="text-red-500">*</span></Label>
                            <div className="flex items-center space-x-2 mb-2">
                              <Checkbox
                                id="isWhatsappSame"
                                checked={formData.isWhatsappSame}
                                onCheckedChange={(checked) => {
                                  handleInputChange('isWhatsappSame', checked as boolean);
                                  if (checked) handleInputChange('whatsapp', formData.phone);
                                }}
                              />
                              <Label htmlFor="isWhatsappSame" className="text-sm">
                                WhatsApp same as phone?
                              </Label>
                            </div>
                            <PhoneInput
                              id="whatsapp"
                              placeholder="WhatsApp number"
                              defaultCountry="IN"
                              value={formData.whatsapp}
                              onChange={(value) => handleInputChange('whatsapp', value || '')}
                              className="w-full border p-3 rounded-lg"
                              required
                              disabled={formData.isWhatsappSame}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Communications and promotions may be sent to this via Whatsapp.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://yourbusiness.com"
                          className={`${formData.website && !isValidURL(formData.website) ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                        />
                        {formData.website && !isValidURL(formData.website) && (
                          <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                          <Input
                            id="linkedin"
                            value={formData.socialLinks.linkedin}
                            onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter (Optional)</Label>
                          <Input
                            id="twitter"
                            value={formData.socialLinks.twitter}
                            onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                            placeholder="https://twitter.com/yourhandle"
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="youtube">YouTube (Optional)</Label>
                          <Input
                            id="youtube"
                            value={formData.socialLinks.youtube}
                            onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                            placeholder="https://youtube.com/channel/yourchannel"
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram (Optional)</Label>
                          <Input
                            id="instagram"
                            value={formData.socialLinks.instagram}
                            onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                            placeholder="https://instagram.com/yourhandle"
                            className={`${!isValidURL(formData.socialLinks.instagram) && formData.socialLinks.instagram ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                          />
                          {!isValidURL(formData.socialLinks.instagram) && formData.socialLinks.instagram && (
                            <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook (Optional)</Label>
                          <Input
                            id="facebook"
                            value={formData.socialLinks.facebook}
                            onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                            placeholder="https://facebook.com/yourpage"
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Legal Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                        Step 3: Legal Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="gstNumber">GST Number <span className="text-red-500">*</span></Label>
                          <Input
                            id="gstNumber"
                            value={formData.gstNumber}
                            onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                            onBlur={() => formData.gstNumber && checkUniqueRemote("gstNumber", formData.gstNumber)}
                            placeholder="Enter GST number"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                          {checkingField.gstNumber ? (
                            <p className="text-sm text-gray-500 mt-1">Checking GST…</p>
                          ) : fieldErrors.gstNumber ? (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> {fieldErrors.gstNumber}
                            </p>
                          ) : null}

                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="panNumber">PAN Number <span className="text-red-500">*</span></Label>
                          <Input
                            id="panNumber"
                            value={formData.panNumber}
                            onChange={(e) => handleInputChange('panNumber', e.target.value)}
                            onBlur={() => formData.panNumber && checkUniqueRemote("panNumber", formData.panNumber)}
                            placeholder="Enter PAN number of Business Owner"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                          {checkingField.panNumber ? (
                            <p className="text-sm text-gray-500 mt-1">Checking PAN…</p>
                          ) : fieldErrors.panNumber ? (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> {fieldErrors.panNumber}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Business Details */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                        Step 4: Business Details
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
                          <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="private-limited">Private Limited</SelectItem>
                              <SelectItem value="public-limited">Public Limited</SelectItem>
                              <SelectItem value="llp">LLP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsInBusiness">Years in Business <span className="text-red-500">*</span></Label>
                          <Select value={formData.yearsInBusiness} onValueChange={(value) => handleInputChange('yearsInBusiness', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select years" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="averageMonthlyRevenue">Average Monthly Revenue <span className="text-red-500">*</span></Label>
                        <Select value={formData.averageMonthlyRevenue} onValueChange={(value) => handleInputChange('averageMonthlyRevenue', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1L">₹0 - ₹1 Lakh</SelectItem>
                            <SelectItem value="1-5L">₹1 - ₹5 Lakh</SelectItem>
                            <SelectItem value="5-10L">₹5 - ₹10 Lakh</SelectItem>
                            <SelectItem value="10-25L">₹10 - ₹25 Lakh</SelectItem>
                            <SelectItem value="25L+">₹25 Lakh+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Business Description <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Describe your business, services, and what makes you unique..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Business Hours</Label>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="businessHoursOpen">Open Time <span className="text-red-500">*</span></Label>
                            <Input
                              id="businessHoursOpen"
                              type="time"
                              value={formData.businessHours.open}
                              onChange={(e) => handleInputChange('businessHours.open', e.target.value)}
                              className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessHoursClose">Close Time <span className="text-red-500">*</span></Label>
                            <Input
                              id="businessHoursClose"
                              type="time"
                              value={formData.businessHours.close}
                              onChange={(e) => handleInputChange('businessHours.close', e.target.value)}
                              className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Days Open <span className="text-red-500">*</span></Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`day-${day}`}
                                  checked={formData.businessHours.days.includes(day)}
                                  onCheckedChange={(checked) => {
                                    const newDays = checked
                                      ? [...formData.businessHours.days, day]
                                      : formData.businessHours.days.filter(d => d !== day);
                                    handleInputChange('businessHours.days', newDays);
                                  }}
                                />
                                <Label htmlFor={`day-${day}`}>{day}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Account Setup & Summary */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                        Step 5: Account Setup & Review
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            onFocus={() => setShowPwdTooltip(true)}
                            onBlur={() => {
                              setTimeout(() => setShowPwdTooltip(false), 400);
                            }}
                            onCopy={handlePreventCopyPaste('password')}
                            onPaste={handlePreventCopyPaste('password')}
                            onCut={handlePreventCopyPaste('password')}
                            placeholder="Enter password"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          {showPwdTooltip && (
                            <div className="absolute left-0 mt-2 w-80 p-3 bg-white border rounded shadow-lg z-50 text-sm">
                              <div className="flex items-center justify-between mb-2">
                                <strong>Password requirements</strong>
                                {(() => {
                                  const passedCount = Object.values(pwdChecks).filter(Boolean).length;
                                  const strengthLevel = passedCount === 0 ? 'No password' : passedCount === 1 ? 'Weak' : passedCount <= 3 ? 'Medium' : passedCount === 4 ? 'Strong' : 'Very Strong';
                                  const strengthColor = passedCount === 0 ? 'text-gray-500' : passedCount === 1 ? 'text-red-600' : passedCount <= 3 ? 'text-yellow-600' : passedCount === 4 ? 'text-blue-600' : 'text-green-600';
                                  return (
                                    <span className="text-gray-500 text-xs">
                                      <span className={`${strengthColor} font-medium`}>{strengthLevel} password</span> Strength
                                    </span>
                                  );
                                })()}
                              </div>
                              <ul className="space-y-1">
                                <li className="flex items-center gap-2">
                                  {pwdChecks.length ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block">•</span>}
                                  <span>At least 8 characters</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.uppercase ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block">•</span>}
                                  <span>One uppercase letter (A–Z)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.lowercase ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block">•</span>}
                                  <span>One lowercase letter (a–z)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.number ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block">•</span>}
                                  <span>One number (0–9)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.special ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block">•</span>}
                                  <span>One special character (!@#$...)</span>
                                </li>
                              </ul>
                            </div>
                          )}
                          {showCopyPasteTooltip.password && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Copy-paste is not allowed for security reasons.
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 relative">
                          <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            onCopy={handlePreventCopyPaste('confirmPassword')}
                            onPaste={handlePreventCopyPaste('confirmPassword')}
                            onCut={handlePreventCopyPaste('confirmPassword')}
                            placeholder="Confirm password"
                            required
                            className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          {showCopyPasteTooltip.confirmPassword && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Copy-paste is not allowed for security reasons.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                        <div className="flex items-center mb-6">
                          <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900">Review Your Information</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Merchant ID:</span>
                            <span className="text-gray-900">Will be auto generated Upon Submission</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Legal Name:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.legalName}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Display Name:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.displayName}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Category:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">City:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.city}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Street Address:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.streetAddress}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Pincode:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.pincode}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Locality:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.locality}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">State:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.state}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Country:</span>
                            <span className="text-gray-900">{formData.country}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Email:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.email}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Phone:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.phone}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">WhatsApp:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.whatsapp}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Website:</span>
                            <span className="text-gray-900">{formData.website}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">LinkedIn:</span>
                            <span className="text-gray-900">{formData.socialLinks.linkedin}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Twitter:</span>
                            <span className="text-gray-900">{formData.socialLinks.twitter}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">YouTube:</span>
                            <span className="text-gray-900">{formData.socialLinks.youtube}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Instagram:</span>
                            <span className="text-gray-900">{formData.socialLinks.instagram}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Facebook:</span>
                            <span className="text-gray-900">{formData.socialLinks.facebook}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">GST Number:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.gstNumber}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">PAN Number:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.panNumber}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Business Type:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.businessType}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Years in Business:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.yearsInBusiness}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Average Monthly Revenue:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.averageMonthlyRevenue}</span>
                          </div>

                          <div className="col-span-2 flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Description:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.description}</span>
                          </div>
                          <div className="col-span-2 flex justify-between py-2">
                            <span className="font-medium text-gray-700">Business Hours:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900">{formData.businessHours.open} - {formData.businessHours.close}, {formData.businessHours.days.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                            required
                          />
                          <Label htmlFor="terms" className="text-sm">
                            I confirm that all the information provided above is true and correct to the best of my knowledge <span className="text-red-500">*</span>.
                            I have read and agree to the {' '}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                              onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                            >
                              Terms & Conditions
                            </a>{' '}and{' '}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                              onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
                            >
                              Privacy Policy
                            </a>{' '}
                            of the CityWitty Merchant Hub.
                          </Label>

                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    {currentStep > 0 && (
                      <Button type="button" variant="outline" onClick={handlePreviousStep}>
                        Previous
                      </Button>
                    )}
                    <div></div>
                    {currentStep < 4 ? (
                      <Button type="button" onClick={handleNextStep}>
                        Next
                      </Button>
                    ) : (
                      <div className="relative inline-block" onClick={(e) => {
                        if (!isFormValid && !isSubmitting) {
                          e.preventDefault();
                          showMissingFields();
                          setShowTooltip(false);
                        }
                      }}>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-lg py-3 flex items-center justify-center disabled:opacity-50"
                          disabled={isSubmitting || !isFormValid}
                          onMouseEnter={() => !isFormValid && setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Submit Partnership Application
                            </>
                          )}
                        </Button>

                        {showTooltip && missingFields.length > 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-w-xs text-sm text-gray-700 whitespace-nowrap">
                            <div className="flex items-center gap-1 mb-1">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span>Missing required fields:</span>
                            </div>
                            <ul className="list-disc list-inside space-y-0.5">
                              {missingFields.map(field => (
                                <li key={field}>{fieldLabel(field) || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</li>
                              ))}
                            </ul>
                            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-300 absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of joining India's fastest-growing discount platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />

      <Modal open={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms & Conditions" >
        <TermsPage />
      </Modal>

      <Modal open={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy">
        <PrivacyPolicyPage />
      </Modal>

      <Modal open={showMissingFieldsModal} onClose={() => setShowMissingFieldsModal(false)} title="Missing Required Fields">
        <div className="space-y-4">
          <p className="text-gray-700">Please fill in the following required fields before submitting:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {missingFields.map((field) => (
              <li key={field} className="text-gray-800">{fieldLabel(field) || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</li>
            ))}
          </ul>
        </div>
      </Modal>
    </main>
  );
}