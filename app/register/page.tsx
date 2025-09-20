// app/register/page.tsx
'use client';
// import { useEffect } from "react";
import { useRef } from "react";
import debounce from "lodash.debounce"; // install: npm i lodash.debounce
import { AlertCircle, CheckCircle as CheckIcon } from "lucide-react";

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Rocket } from 'lucide-react'; // new icon
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMemo } from 'react';
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
          className="w-full border p-3 rounded-lg"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your city"
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
const isValidURL = (url: string) => {
  if (!url) return false;

  // Regex explanation:
  // ^(https?:\/\/)?       -> optional http:// or https://
  // ([\w-]+\.)+[\w-]{2,}  -> domain and TLD (sub.domain.com)
  // (:\d+)?               -> optional port number
  // (\/[^\s]*)?           -> optional path, query, or fragment
  const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(:\d+)?(\/[^\s]*)?$/i;

  return pattern.test(url);
};





export default function PartnerPage() {
  const [formData, setFormData] = useState({
    applicationId: '', // ✅ Add this
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    category: '',
    city: '',
    address: '',
    whatsapp: '',
    isWhatsappSame: false,
    password: '',
    confirmPassword: '',
    gstNumber: '',
    hasWebsite: false,
    panNumber: '',
    businessType: '',
    yearsInBusiness: '',
    averageMonthlyRevenue: '',
    discountOffered: '',
    description: '',
    website: '',
    instagram: '',
    facebook: '',
    agreeToTerms: false
  });

  // inline uniqueness errors


  // pending-check flags (to show loader if needed)

  const [showPwdTooltip, setShowPwdTooltip] = useState(false);
  const pwdTooltipTimer = useRef<number | null>(null);

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
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
    gstNumber?: string;
    panNumber?: string;
  }>({});

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
    doc.text("CityWitty Merchant Registration Form Preview", 10, 15);

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
    const addField = (label: string, value: string) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const text = `${label}: ${value || "-"}`;
      const splitText = doc.splitTextToSize(text, 186); // wrap text if too long
      splitText.forEach((line: string) => {
        doc.text(line, 12, y);
        y += 7;
      });
      y += 2;
    };


    // --- Business Information ---
    addSection("Business Information");
    addField("Application ID (auto-generated)", formData.applicationId);
    addField("Business Name", formData.businessName);
    addField("Owner/Manager Name", formData.ownerName);
    addField("Category", formData.category);
    addField("City", formData.city);
    addField("Address", formData.address);

    // --- Contact Information ---
    addSection("Contact Information");
    addField("Email", formData.email);
    addField("Phone", formData.phone);
    addField("WhatsApp", formData.whatsapp);
    addField("Website", formData.website);
    addField("Instagram", formData.instagram);
    addField("Facebook", formData.facebook);

    // --- Legal Information ---
    addSection("Legal Information");
    addField("GST Number", formData.gstNumber);
    addField("PAN Number", formData.panNumber);
    addField("Business Type", formData.businessType);

    // --- Business Details ---
    addSection("Business Details");
    addField("Years in Business", formData.yearsInBusiness);
    addField("Average Monthly Revenue", formData.averageMonthlyRevenue);
    addField("Discount Offered", formData.discountOffered);
    addField("Business Description", formData.description);

    // Save PDF
    doc.save(`${formData.businessName || 'CityWitty_Application'}.pdf`);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const requiredFields = [
      "businessName",
      "ownerName",
      "category",
      "city",
      "address",
      "email",
      "phone",
      "gstNumber",
      "panNumber",
      "businessType",
      "yearsInBusiness",
      "averageMonthlyRevenue",
      "discountOffered",
      "description",
      "agreeToTerms",
      "password",
      "confirmPassword",
    ];

    const missingFields = requiredFields.filter(f => !formData[f as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(
        `Please fill all required fields before submitting:\n${missingFields.join(", ")}`
      );
      return; // stop submission
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
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
        setFormData(prev => ({ ...prev, applicationId: resData.applicationId }));
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
    setFormData(prev => ({ ...prev, [field]: value }));

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
    if (field === "isWhatsappSame" && value === true) {
      setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
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
              <CardContent className="p-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Application Submitted Successfully!
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your interest in partnering with CityWitty. Our team will review your application and contact you within 2-3 business days.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 font-medium">Application ID: {formData.applicationId}</p>

                  <p className="text-blue-600 text-sm">Please save this ID for future reference</p>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={downloadPDF}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Download Application PDF
                  </Button>

                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-green-500 hover:bg-green-600"
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


              <CardHeader className="text-center py-10 flex flex-col items-center space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-500">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-semibold text-indigo-600 tracking-wide">
                    Merchant Application Form
                  </CardTitle>
                </div>

                <CardDescription className="text-md md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                  Start your journey to <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">getting more customers</span> for your business with CityWitty!
                </CardDescription>


                <div className="h-0.5 w-24 bg-indigo-200 rounded-full"></div>
              </CardHeader>





              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Business Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Business Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          placeholder="Enter your business name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner/Manager Name *</Label>
                        <Input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) => handleInputChange('ownerName', e.target.value)}
                          placeholder="Enter owner/manager name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="category">Business Category *</Label>
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
                        <Label htmlFor="city">City *</Label>
                        <CityAutocomplete
                          value={formData.city}
                          onChange={(val: string) => handleInputChange("city", val)}
                        />


                      </div>

                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter complete business address"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Contact Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Business Email  *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onBlur={() => formData.email && checkUniqueRemote("email", formData.email)}
                          placeholder="business@email.com"
                          required
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
                          <Label htmlFor="phone">Phone Number *</Label>
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
                              WhatsApp same as phone? *
                            </Label>
                          </div>
                          <PhoneInput
                            id="whatsapp"
                            placeholder="Enter WhatsApp number"
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

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            onFocus={() => setShowPwdTooltip(true)}
                            onBlur={() => {
                              // hide after small delay so clickable items (if any) not cut off
                              setTimeout(() => setShowPwdTooltip(false), 400);
                            }}
                            placeholder="Enter password"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>

                          {/* Password tooltip - temporary */}
                          {showPwdTooltip && (
                            <div className="absolute left-0 mt-2 w-80 p-3 bg-white border rounded shadow-lg z-50 text-sm">
                              <div className="flex items-center justify-between mb-2">
                                <strong>Password requirements</strong>
                                <span className="text-gray-500 text-xs">Strength</span>
                              </div>
                              <ul className="space-y-1">
                                <li className="flex items-center gap-2">
                                  {pwdChecks.length ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block" />}
                                  <span>At least 8 characters</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.uppercase ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block" />}
                                  <span>One uppercase letter (A–Z)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.lowercase ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block" />}
                                  <span>One lowercase letter (a–z)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.number ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block" />}
                                  <span>One number (0–9)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  {pwdChecks.special ? <CheckIcon className="w-4 h-4 text-green-600" /> : <span className="w-4 h-4 inline-block" />}
                                  <span>One special character (!@#$...)</span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>



                        <div className="space-y-2 relative">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            placeholder="Confirm password"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasWebsite"
                            checked={formData.hasWebsite}
                            onCheckedChange={(checked) => handleInputChange("hasWebsite", checked as boolean)}
                          />
                          <Label htmlFor="hasWebsite">Do you have a website?</Label>
                        </div>
                        {formData.hasWebsite && (
                          <>
                            <Input
                              id="website"
                              type="text"
                              value={formData.website}
                              onChange={(e) => handleInputChange("website", e.target.value)}
                              placeholder="https://yourbusiness.com"
                              className={
                                formData.website && !isValidURL(formData.website)
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formData.website && !isValidURL(formData.website) && (
                              <p className="text-red-500 text-sm mt-1">
                                Please enter a valid URL. Example formats:
                                <br />- example.com
                                <br />- www.example.com
                                <br />- https://example.com
                                <br />- https://example.com/path
                              </p>
                            )}
                          </>
                        )}

                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram (Optional)</Label>
                          <Input
                            id="instagram"
                            value={formData.instagram || ""}
                            onChange={(e) => handleInputChange("instagram", e.target.value)}
                            placeholder="https://instagram.com/yourhandle"
                            className={!isValidURL(formData.instagram) && formData.instagram ? 'border-red-500' : ''}
                          />
                          {!isValidURL(formData.instagram) && formData.instagram && (
                            <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook (Optional)</Label>
                          <Input
                            id="facebook"
                            value={formData.facebook || ""}
                            onChange={(e) => handleInputChange("facebook", e.target.value)}
                            placeholder="Facebook page link"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Legal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Legal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="gstNumber">GST Number *</Label>
                        <Input
                          id="gstNumber"
                          value={formData.gstNumber}
                          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                          onBlur={() => formData.gstNumber && checkUniqueRemote("gstNumber", formData.gstNumber)}
                          placeholder="Enter GST number"
                          required
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
                        <Label htmlFor="panNumber">PAN Number *</Label>
                        <Input
                          id="panNumber"
                          value={formData.panNumber}
                          onChange={(e) => handleInputChange('panNumber', e.target.value)}
                          onBlur={() => formData.panNumber && checkUniqueRemote("panNumber", formData.panNumber)}
                          placeholder="Enter PAN number"
                          required
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

                  {/* Business Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Business Details
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
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
                        <Label htmlFor="yearsInBusiness">Years in Business *</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="discountOffered">Discount Offered *</Label>
                        <Select value={formData.discountOffered} onValueChange={(value) => handleInputChange('discountOffered', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-15">10-15%</SelectItem>
                            <SelectItem value="15-20">15-20%</SelectItem>
                            <SelectItem value="20-30">20-30%</SelectItem>
                            <SelectItem value="30-40">30-40%</SelectItem>
                            <SelectItem value="40+">40%+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="averageMonthlyRevenue">Average Monthly Revenue *</Label>
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
                      <Label htmlFor="description">Business Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your business, services, and what makes you unique..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{' '}
                        <a href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 flex items-center justify-center"
                    disabled={
                      isSubmitting ||
                      !formData.agreeToTerms ||
                      Object.values(fieldErrors).some(Boolean)
                    }
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
    </main>
  );
}


