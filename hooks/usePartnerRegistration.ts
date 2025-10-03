import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import debounce from "lodash.debounce";
import jsPDF from 'jspdf';
import { benefits, categories, indianStatesAndUTs } from '@/constants/registerConstants';

const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const isValidURL = (url: string) => {
    if (!url || url.trim() === '') return true; // Allow empty URLs

    try {
        // If no protocol is provided, prepend https://
        const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        new URL(urlWithProtocol);
        return true;
    } catch {
        return false;
    }
};

const isValidPAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

const isValidGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9A-Z]{1}$/.test(gst);

const validateSocialMediaURL = (platform: string, url: string) => {
    if (!url || url.trim() === '') return null;
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
    }
    try {
        const parsedUrl = new URL(fullUrl);
        const hostname = parsedUrl.hostname.toLowerCase();
        const pathname = parsedUrl.pathname.toLowerCase();
        const fullUrlString = hostname + pathname;

        // Simple check: just verify the platform name is present in the URL
        if (platform === 'linkedin' && fullUrlString.includes('linkedin')) {
            return null;
        } else if ((platform === 'twitter' || platform === 'x') && (fullUrlString.includes('x') || fullUrlString.includes('twitter'))) {
            return null;
        } else if (platform === 'youtube' && fullUrlString.includes('youtube')) {
            return null;
        } else if (platform === 'instagram' && fullUrlString.includes('instagram')) {
            return null;
        } else if (platform === 'facebook' && fullUrlString.includes('facebook')) {
            return null;
        }
        return `Invalid ${platform} URL. URL must contain "${platform}"`;
    } catch (e) {
        return `Invalid URL format`;
    }
};



export const usePartnerRegistration = () => {
    const initialFormData = {
        merchantId: '',
        legalName: '',
        displayName: '',
        merchantSlug: '',
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
        businessLicenseNumber: '',
        businessType: '',
        yearsInBusiness: '',
        averageMonthlyRevenue: '',

        description: '',
        website: '',
        socialLinks: {
            linkedin: '',
            x: '',
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
        merchantSlug?: boolean;
    }>({});

    const [checkedField, setCheckedField] = useState<{
        email?: boolean;
        phone?: boolean;
        gstNumber?: boolean;
        panNumber?: boolean;
        merchantSlug?: boolean;
    }>({});

    const [suggestedSlugs, setSuggestedSlugs] = useState<string[]>([]);
    const [regenerateTrigger, setRegenerateTrigger] = useState(0);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

    // Generate suggested slugs based on displayName, city, locality, category, and state
    const generateSuggestedSlugs = useCallback((displayName: string, city: string, locality: string, category: string, state: string) => {
        const suggestions: string[] = [];
        const sanitizeSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        if (displayName) {
            const baseName = sanitizeSlug(displayName);

            // Add category-based suggestions
            if (category) {
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${categorySlug}`);
            }

            // Add city-based suggestions
            if (city) {
                const citySlug = sanitizeSlug(city);
                suggestions.push(`${baseName}-${citySlug}`);
                suggestions.push(`${citySlug}-${baseName}`);
            }

            // Add locality-based suggestions
            if (locality) {
                const localitySlug = sanitizeSlug(locality);
                suggestions.push(`${baseName}-${localitySlug}`);
                suggestions.push(`${localitySlug}-${baseName}`);
            }

            // Add state-based suggestions
            if (state) {
                const stateSlug = sanitizeSlug(state);
                suggestions.push(`${baseName}-${stateSlug}`);
            }

            // Add combinations
            if (city && locality) {
                const citySlug = sanitizeSlug(city);
                const localitySlug = sanitizeSlug(locality);
                suggestions.push(`${baseName}-${citySlug}-${localitySlug}`);
                suggestions.push(`${citySlug}-${localitySlug}-${baseName}`);
            }

            if (city && category) {
                const citySlug = sanitizeSlug(city);
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${citySlug}-${categorySlug}`);
                suggestions.push(`${citySlug}-${baseName}-${categorySlug}`);
            }

            if (locality && category) {
                const localitySlug = sanitizeSlug(locality);
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${localitySlug}-${categorySlug}`);
                suggestions.push(`${localitySlug}-${baseName}-${categorySlug}`);
            }

            if (city && locality && category) {
                const citySlug = sanitizeSlug(city);
                const localitySlug = sanitizeSlug(locality);
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${citySlug}-${localitySlug}-${categorySlug}`);
                suggestions.push(`${citySlug}-${localitySlug}-${baseName}-${categorySlug}`);
            }

            // Add state combinations if available
            if (state && city) {
                const stateSlug = sanitizeSlug(state);
                const citySlug = sanitizeSlug(city);
                suggestions.push(`${baseName}-${citySlug}-${stateSlug}`);
                suggestions.push(`${citySlug}-${baseName}-${stateSlug}`);
            }

            if (state && locality) {
                const stateSlug = sanitizeSlug(state);
                const localitySlug = sanitizeSlug(locality);
                suggestions.push(`${baseName}-${localitySlug}-${stateSlug}`);
                suggestions.push(`${localitySlug}-${baseName}-${stateSlug}`);
            }

            if (state && category) {
                const stateSlug = sanitizeSlug(state);
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${categorySlug}-${stateSlug}`);
                suggestions.push(`${categorySlug}-${baseName}-${stateSlug}`);
            }

            if (state && city && locality) {
                const stateSlug = sanitizeSlug(state);
                const citySlug = sanitizeSlug(city);
                const localitySlug = sanitizeSlug(locality);
                suggestions.push(`${baseName}-${citySlug}-${localitySlug}-${stateSlug}`);
            }

            if (state && city && category) {
                const stateSlug = sanitizeSlug(state);
                const citySlug = sanitizeSlug(city);
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${citySlug}-${categorySlug}-${stateSlug}`);
            }

            if (state && locality && category) {
                const stateSlug = sanitizeSlug(state);
                const localitySlug = sanitizeSlug(locality);
                const categorySlug = sanitizeSlug(category);
                suggestions.push(`${baseName}-${localitySlug}-${categorySlug}-${stateSlug}`);
            }
        }

        // Remove duplicates and ensure valid format, randomize order, limit to 10 suggestions
        return Array.from(new Set(suggestions)).filter(slug => slug.length > 0 && /^[a-z0-9_-]+$/.test(slug)).sort(() => Math.random() - 0.5).slice(0, 10);
    }, []);

    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Generate suggested slugs whenever displayName, city, locality, category, or state changes, or when step changes
    useEffect(() => {
        const suggestions = generateSuggestedSlugs(formData.displayName, formData.city, formData.locality, formData.category, formData.state);
        setSuggestedSlugs(suggestions);

        // Show warning if not all step 1 fields are filled for better username suggestions
        const step1Fields = [formData.displayName, formData.city, formData.locality, formData.category, formData.state];
        const allStep1Filled = step1Fields.every(field => field && field.trim() !== '');
        if (!allStep1Filled && currentStep === 2) {
            setFieldErrors(prev => ({ ...prev, merchantSlug: "Fill Up all the fields in step 1 to get better username suggestions" }));
        } else {
            setFieldErrors(prev => {
                if (prev.merchantSlug === "Fill Up all the fields in step 1 to get better username suggestions") {
                    const newErrors = { ...prev };
                    delete newErrors.merchantSlug;
                    return newErrors;
                }
                return prev;
            });
        }
    }, [formData.displayName, formData.city, formData.locality, formData.category, formData.state, regenerateTrigger, currentStep, generateSuggestedSlugs]);

    // Handle pre-filled data validation and auto-capitalization
    useEffect(() => {
        const newFieldErrors = { ...fieldErrors };
        let hasChanges = false;

        // Auto-capitalize GST and PAN if they're pre-filled in lowercase
        if (formData.gstNumber && formData.gstNumber !== formData.gstNumber.toUpperCase()) {
            setFormData(prev => ({ ...prev, gstNumber: prev.gstNumber.toUpperCase() }));
            hasChanges = true;
        }

        if (formData.panNumber && formData.panNumber !== formData.panNumber.toUpperCase()) {
            setFormData(prev => ({ ...prev, panNumber: prev.panNumber.toUpperCase() }));
            hasChanges = true;
        }

        // Validate pre-filled GST number
        if (formData.gstNumber) {
            if (formData.gstNumber.length > 0 && formData.gstNumber.length < 15) {
                newFieldErrors.gstNumber = "GST Number must be exactly 15 characters";
            } else if (formData.gstNumber.length === 15 && !isValidGST(formData.gstNumber)) {
                newFieldErrors.gstNumber = "Invalid GST format. Should be: 2 digits + 5 letters + 4 digits + 1 letter + 1 digit + 1 letter + 1 digit (e.g., 22AAAAA0000A1Z5)";
            } else if (formData.gstNumber.length === 15 && isValidGST(formData.gstNumber)) {
                delete newFieldErrors.gstNumber;
            } else if (formData.gstNumber.length > 15) {
                newFieldErrors.gstNumber = "GST Number cannot exceed 15 characters";
            }
        }

        // Validate pre-filled PAN number
        if (formData.panNumber) {
            if (formData.panNumber.length > 0 && formData.panNumber.length < 10) {
                newFieldErrors.panNumber = "PAN Number must be exactly 10 characters";
            } else if (formData.panNumber.length === 10 && !isValidPAN(formData.panNumber)) {
                newFieldErrors.panNumber = "Invalid PAN format. Should be: 5 letters + 4 digits + 1 letter (e.g., AAAAA0000A)";
            } else if (formData.panNumber.length === 10 && isValidPAN(formData.panNumber)) {
                delete newFieldErrors.panNumber;
            } else if (formData.panNumber.length > 10) {
                newFieldErrors.panNumber = "PAN Number cannot exceed 10 characters";
            }
        }

        // Only update fieldErrors if there are actual changes
        if (JSON.stringify(newFieldErrors) !== JSON.stringify(fieldErrors)) {
            setFieldErrors(newFieldErrors);
        }

        // Prevent infinite re-renders by only running when formData changes for these specific fields
    }, [formData.gstNumber, formData.panNumber]);

    // Handle pre-filled email validation immediately (without debounce delay)
    useEffect(() => {
        const checkEmailUniqueness = async (email: string) => {
            if (!email || !isValidEmail(email)) return;

            try {
                setCheckingField(prev => ({ ...prev, email: true }));
                setCheckedField(prev => ({ ...prev, email: false }));

                const res = await fetch("/api/partnerApplication/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field: "email", value: email })
                });

                const data = await res.json();
                if (res.ok) {
                    setFieldErrors(prev => {
                        const currentError = prev.email;
                        if (data.exists) {
                            return { ...prev, email: `Email ID already registered` };
                        } else {
                            // if there is a current error (like format error), keep it
                            if (currentError && currentError !== `Email ID already registered`) {
                                return prev;
                            } else {
                                return { ...prev, email: undefined };
                            }
                        }
                    });
                } else {
                    setFieldErrors(prev => {
                        const currentError = prev.email;
                        if (currentError && currentError !== `Email ID already registered`) {
                            return prev;
                        } else {
                            return { ...prev, email: undefined };
                        }
                    });
                }
            } catch (err) {
                console.error("checkEmail error", err);
                setFieldErrors(prev => {
                    const currentError = prev.email;
                    if (currentError && currentError !== `Email ID already registered`) {
                        return prev;
                    } else {
                        return { ...prev, email: undefined };
                    }
                });
            } finally {
                setCheckingField(prev => ({ ...prev, email: false }));
                setCheckedField(prev => ({ ...prev, email: true }));
            }
        };

        // Only check if email is pre-filled and valid format
        if (formData.email && isValidEmail(formData.email)) {
            checkEmailUniqueness(formData.email);
        }
    }, [formData.email]);

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
                setCheckedField(prev => ({ ...prev, [field]: false }));
                const res = await fetch("/api/partnerApplication/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field, value })
                });
                const data = await res.json();
                if (res.ok) {
                    setFieldErrors(prev => {
                        const currentError = prev[field];
                        if (data.exists) {
                            if (field !== "email") {
                                setSuggestedSlugs(data.suggestions || []);
                            }
                            return { ...prev, [field]: `${fieldLabel(field)} already registered` };
                        } else {
                            if (field !== "email") {
                                setSuggestedSlugs([]);
                            }
                            // if there is a current error (like format error), keep it
                            if (currentError && currentError !== `${fieldLabel(field)} already registered`) {
                                return prev;
                            } else {
                                return { ...prev, [field]: undefined };
                            }
                        }
                    });
                } else {
                    // server returned error
                    if (field !== "email") {
                        setSuggestedSlugs([]);
                    }
                    setFieldErrors(prev => {
                        const currentError = prev[field];
                        if (currentError && currentError !== `${fieldLabel(field)} already registered`) {
                            return prev;
                        } else {
                            return { ...prev, [field]: undefined };
                        }
                    });
                }
            } catch (err) {
                console.error("checkUnique error", err);
                // don't block submit for network flakiness; but show generic
                setFieldErrors(prev => {
                    const currentError = prev[field];
                    if (currentError && currentError !== `${fieldLabel(field)} already registered`) {
                        return prev;
                    } else {
                        return { ...prev, [field]: undefined };
                    }
                });
            } finally {
                setCheckingField(prev => ({ ...prev, [field]: false }));
                setCheckedField(prev => ({ ...prev, [field]: true }));
            }
        }, 600)
    ).current;

    const fieldLabel = (f: string) => {
        if (f === "email") return "Email ID";
        if (f === "phone") return "Phone Number";
        if (f === "gstNumber") return "GST Number";
        if (f === "panNumber") return "PAN Number";
        if (f === "merchantSlug") return "Profile Slug";
        if (f === "businessHours.open") return "Open Time";
        if (f === "businessHours.close") return "Close Time";
        if (f === "businessHours.days") return "Days Open";
        return f;
    };


    const downloadPDF = () => {
        const doc = new jsPDF() as any;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = 10;

        // --- Header with branding ---
        // Header background - simple solid color
        doc.setFillColor(187, 222, 251); // Light blue solid background
        doc.rect(0, 0, pageWidth, 40);

        // Header border
        doc.setDrawColor(25, 118, 210);
        doc.setLineWidth(1);
        doc.rect(0, 0, pageWidth, 40);

        // Logo
        doc.addImage('https://partner.citywitty.com/logo2.png', 'PNG', 10, 5, 60, 20);

        // Subtitle
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Merchant Registration Confirmation Preview", 20, 35);

        // Date
        doc.setFontSize(8);
        doc.text(`Generated on: ${new Date().toISOString().split('T')[0]}`, pageWidth - 60, 20);

        // Add a decorative line below header
        doc.setDrawColor(25, 118, 210);
        doc.setLineWidth(0.5);
        doc.line(0, 42, pageWidth, 42);

        // Reset text color
        doc.setTextColor(0, 0, 0);
        y = 50;

        // --- Merchant ID Badge ---
        // Green gradient background using horizontal stripes
        for (let i = 0; i < 15; i++) {
            const ratio = i / 15;
            const r = Math.round(129 + (56 - 129) * ratio);
            const g = Math.round(199 + (142 - 199) * ratio);
            const b = Math.round(132 + (60 - 132) * ratio);
            doc.setFillColor(r, g, b);
            doc.rect(15, y - 5 + i, 60, 1);
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(`ID: ${formData.merchantId || 'Pending'}`, 25, y + 3);
        doc.setTextColor(0, 0, 0);
        y += 25;

        // Helper functions
        const addSectionHeader = (title: string, icon?: string) => {
            // Section background
            doc.setFillColor(248, 249, 250);
            doc.rect(15, y - 3, pageWidth - 30, 12);

            // Section border
            doc.setDrawColor(25, 118, 210);
            doc.setLineWidth(0.5);
            doc.rect(15, y - 3, pageWidth - 30, 12);

            // Section title
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(25, 118, 210);
            doc.text(title, 20, y + 4);
            y += 18;
        };

        const addField = (label: string, value: any, isImportant = false) => {
            if (y > pageHeight - 30) {
                doc.addPage();
                y = 20;
            }

            // Label
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(69, 90, 100);
            doc.text(`${label}:`, 20, y);

            // Value
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...(isImportant ? [25, 118, 210] : [33, 33, 33]));

            let displayValue = value || "-";
            if (Array.isArray(value)) {
                displayValue = value.join(', ');
            }

            const safeValue = displayValue.replace(/[^\x00-\x7F]/g, '');
            const maxWidth = pageWidth - 80;
            const splitText = doc.splitTextToSize(safeValue, maxWidth);

            splitText.forEach((line: string, index: number) => {
                if (index === 0) {
                    doc.text(line, 80, y);
                } else {
                    doc.text(line, 80, y + (index * 6));
                }
            });

            y += Math.max(8, splitText.length * 6);
        };

        const addDivider = () => {
            doc.setDrawColor(224, 224, 224);
            doc.setLineWidth(0.3);
            doc.line(20, y, pageWidth - 20, y);
            y += 8;
        };

        // --- Business Information ---
        addSectionHeader("Business Information");
        addField("Legal Name", formData.legalName, true);
        addField("Display Name", formData.displayName, true);
        addField("Merchant Slug", formData.merchantSlug, true);
        addField("Category", formData.category);
        addField("Business Type", formData.businessType);
        addDivider();

        addField("Street Address", formData.streetAddress);
        addField("Locality", formData.locality);
        addField("City", formData.city);
        addField("State", formData.state);
        addField("Pincode", formData.pincode);
        addField("Country", formData.country);
        y += 10;

        // --- Contact Information ---
        addSectionHeader("Contact Information");
        addField("Email", formData.email, true);
        addField("Phone", formData.phone, true);
        addField("WhatsApp", formData.whatsapp);
        addField("Website", formData.website);
        y += 10;

        // Social Links
        if (Object.values(formData.socialLinks).some(link => link)) {
            addSectionHeader("Social Media Links");
            if (formData.socialLinks.linkedin) addField("LinkedIn", formData.socialLinks.linkedin);
            if (formData.socialLinks.x) addField("X (Twitter)", formData.socialLinks.x);
            if (formData.socialLinks.youtube) addField("YouTube", formData.socialLinks.youtube);
            if (formData.socialLinks.instagram) addField("Instagram", formData.socialLinks.instagram);
            if (formData.socialLinks.facebook) addField("Facebook", formData.socialLinks.facebook);
            y += 10;
        }

        // --- Legal Information ---
        addSectionHeader("Legal Information");
        addField("GST Number", formData.gstNumber, true);
        addField("PAN Number", formData.panNumber, true);
        addField("Business License", formData.businessLicenseNumber);
        y += 10;

        // --- Business Details ---
        addSectionHeader("Business Details");
        addField("Years in Business", formData.yearsInBusiness);
        addField("Monthly Revenue", formData.averageMonthlyRevenue);
        addField("Business Description", formData.description);
        y += 10;

        // Business Hours
        addSectionHeader("Business Hours");
        addField("Opening Time", formData.businessHours.open);
        addField("Closing Time", formData.businessHours.close);
        addField("Operating Days", formData.businessHours.days.join(', '));
        y += 15;

        // --- Footer ---
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }

        // Footer background
        doc.setFillColor(248, 249, 250);
        doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

        // Footer text
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(117, 117, 117);
        doc.text("This document confirms your registration with CityWitty Merchant Hub.", 20, pageHeight - 18);
        doc.text("This is a digitally generated preview and hence doesn't require to be signed.", 20, pageHeight - 12);
        doc.text("For support, contact us at support@citywitty.com", 20, pageHeight - 6);

        // Page number
        doc.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 8);

        // Save PDF
        doc.save(`${formData.displayName || 'CityWitty_Application'}_Registration.pdf`);
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

    // Validate current step when step changes
    useEffect(() => {
        validateCurrentStep();
    }, [currentStep]);

    const stepFields = [
        ['legalName', 'displayName', 'category', 'city', 'streetAddress', 'pincode', 'locality', 'state'], // step 0
        ['merchantSlug', 'email', 'phone', 'whatsapp'], // step 1
        ['gstNumber', 'panNumber', 'businessLicenseNumber'], // step 2
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
        "merchantSlug",
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

    // Compute completed steps - only check required fields for each step
    const completedSteps = useMemo(() => {
        return stepFields.map((fields, stepIndex) => {
            // Get required fields for this step
            const stepRequiredFields = fields.filter(field => requiredFields.includes(field));
            return stepRequiredFields.every(field => {
                if (field === 'businessHours.days') {
                    return formData.businessHours.days.length > 0;
                }
                if (field.includes('.')) {
                    const parts = field.split('.');
                    let val: any = formData;
                    for (const part of parts) {
                        val = val[part];
                    }
                    // Treat empty string as incomplete
                    if (typeof val === 'string') {
                        return val.trim().length > 0;
                    }
                    return !!val;
                }
                const value = (formData as any)[field];
                if (typeof value === 'string') {
                    return value.trim().length > 0;
                }
                return !!value;
            });
        });
    }, [formData, stepFields, requiredFields]);

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
                    if (newFieldErrors[field] === 'At least one day must be selected') {
                        delete newFieldErrors[field];
                    }
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
                    if (newFieldErrors[field] === 'This field is required') {
                        delete newFieldErrors[field];
                    }
                }
            } else if (!formData[field as keyof typeof formData]) {
                newFieldErrors[field] = 'This field is required';
                hasErrors = true;
            } else {
                if (newFieldErrors[field] === 'This field is required') {
                    delete newFieldErrors[field];
                }
            }
        });

        setFieldErrors(newFieldErrors);
    }, [currentStep, formData, fieldErrors, stepFields]);

    const handleNextStep = () => {
        if (currentStep === 4) return; // Step 4 is submit

        validateCurrentStep(); // Show errors for current step but don't block navigation

        setVisitedSteps(prev => new Set(prev).add(currentStep + 1));
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setVisitedSteps(prev => new Set(prev).add(currentStep - 1));
        setCurrentStep(currentStep - 1);
    };

    const handleStepClick = (step: number) => {
        // Mark all steps from 0 to the clicked step as visited
        setVisitedSteps(prev => new Set(Array.from(prev).concat(Array.from({ length: step + 1 }, (_, i) => i))));
        setCurrentStep(step);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation for all steps
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
            // Maps for converting string values to numbers
            const yearsInBusinessMap: Record<string, number> = {
                "0-1": 0.5,
                "1-3": 2,
                "3-5": 4,
                "5-10": 7.5,
                "10+": 10
            };

            const revenueMap: Record<string, number> = {
                "0-1L": 0.5,
                "1-5L": 3,
                "5-10L": 7.5,
                "10-25L": 17.5,
                "25L+": 25
            };

            // Create payload without confirmPassword and convert values
            const { confirmPassword, ...tempPayload } = {
                ...formData,
                yearsInBusiness: yearsInBusinessMap[formData.yearsInBusiness] || 0,
                averageMonthlyRevenue: revenueMap[formData.averageMonthlyRevenue] || 0,
            };

            // Submit to API
            const response = await fetch('/api/partnerApplication', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tempPayload),
            });

            if (response.ok) {
                const resData = await response.json();
                console.log('Submitted:', resData);
                setFormData(prev => ({ ...prev, merchantId: resData.merchantId }));
                setIsSubmitted(true);
            } else {
                const errData = await response.json();
                console.error('Submission failed:', errData);
                alert(`Submission failed: ${errData.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerRegenerateSuggestions = useCallback(() => {
        setRegenerateTrigger(prev => prev + 1);
    }, []);

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
        if (["email", "phone", "gstNumber", "panNumber", "merchantSlug"].includes(field)) {
            setCheckedField(prev => ({ ...prev, [field]: false }));
            if (!value) {
                setFieldErrors(prev => ({ ...prev, [field]: undefined }));
                setCheckingField(prev => ({ ...prev, [field]: false }));
                return;
            }
            setCheckingField(prev => ({ ...prev, [field]: true }));
            // simple client-side format gating (optional)
            if (field === "email") {
                if (!isValidEmail(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: "Invalid email format" }));
                } else {
                    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
                }
            }
            if (field === "gstNumber") {
                if (value.length > 0 && value.length < 15) {
                    setFieldErrors(prev => ({ ...prev, [field]: "GST Number must be exactly 15 characters" }));
                } else if (value.length === 15 && !isValidGST(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: "Invalid GST format. Should be: 2 digits + 5 letters + 4 digits + 1 letter + 1 digit + 1 letter + 1 digit (e.g., 22AAAAA0000A1Z5)" }));
                } else if (value.length === 15 && isValidGST(value)) {
                    setFieldErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[field];
                        return newErrors;
                    });
                } else if (value.length > 15) {
                    setFieldErrors(prev => ({ ...prev, [field]: "GST Number cannot exceed 15 characters" }));
                }
            }
            if (field === "panNumber") {
                if (value.length > 0 && value.length < 10) {
                    setFieldErrors(prev => ({ ...prev, [field]: "PAN Number must be exactly 10 characters" }));
                } else if (value.length === 10 && !isValidPAN(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: "Invalid PAN format. Should be: 5 letters + 4 digits + 1 letter (e.g., AAAAA0000A)" }));
                } else if (value.length === 10 && isValidPAN(value)) {
                    setFieldErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[field];
                        return newErrors;
                    });
                } else if (value.length > 10) {
                    setFieldErrors(prev => ({ ...prev, [field]: "PAN Number cannot exceed 10 characters" }));
                }
            }
            if (field === "phone" || field === "whatsapp") {
                // For phone numbers, check if it's a valid international format
                // The react-phone-number-input component handles validation internally
                // We just need to ensure a value is provided
                if (value && value.trim() !== '') {
                    // Extract digits only to count them
                    const digitsOnly = value.replace(/\D/g, '');
                    // Allow 10 digits (Indian mobile) or 12-13 digits (with country code)
                    const isValidLength = digitsOnly.length === 10 || digitsOnly.length === 12 || digitsOnly.length === 13;
                    if (!isValidLength) {
                        setFieldErrors(prev => ({ ...prev, [field]: "Please enter a valid phone number" }));
                    } else {
                        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
                    }
                } else {
                    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
                }
            }
            if (field === "merchantSlug") {
                if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: "Profile Slug can only contain letters, numbers, underscores, and hyphens" }));
                } else {
                    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
                }
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
            setFieldErrors(prev => {
                const currentError = prev[field];
                if (currentError === 'This field is required') {
                    return { ...prev, [field]: undefined };
                }
                return prev;
            });
        }

        // Clear confirmPassword error if matches
        if (field === 'confirmPassword' && value && value === formData.password) {
            setFieldErrors(prev => ({ ...prev, 'confirmPassword': undefined }));
        }

        // Clear agreeToTerms error if checked
        if (field === 'agreeToTerms' && value) {
            setFieldErrors(prev => ({ ...prev, 'agreeToTerms': undefined }));
        }

        // Validation is handled on next/submit, not on every change
    };

    return {
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
        visitedSteps,
        setVisitedSteps,
        fieldErrors,
        setFieldErrors,
        checkingField,
        checkedField,
        suggestedSlugs,
        triggerRegenerateSuggestions,
        showPwdTooltip,
        setShowPwdTooltip,
        pwdChecks,
        showCopyPasteTooltip,
        handlePreventCopyPaste,
        checkUniqueRemote,
        downloadPDF,
        isSubmitting,
        isSubmitted,
        setIsSubmitted,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        resetForm,
        showMissingFields,
        isFormValid,
        missingFields,
        showTooltip,
        setShowTooltip,
        completedSteps,
        incompleteSteps,
        isCurrentStepValid,
        validateCurrentStep,
        handleNextStep,
        handlePreviousStep,
        handleStepClick,
        handleSubmit,
        handleInputChange,
        showTermsModal,
        setShowTermsModal,
        showPrivacyModal,
        setShowPrivacyModal,
        showMissingFieldsModal,
        setShowMissingFieldsModal,
        validateSocialMediaURL,
        isValidURL,
        fieldLabel,
        stepFields,
        requiredFields,
        benefits,
        categories,
        indianStatesAndUTs
    };
};
