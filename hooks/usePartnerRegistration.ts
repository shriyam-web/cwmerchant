import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import debounce from "lodash.debounce";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
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

    const downloadPDF = async () => {
        const doc = new jsPDF({ compress: true });
        doc.setProperties({
            title: 'CityWitty Merchant Registration Preview',
            subject: 'Merchant application summary',
            author: 'CityWitty Merchant Hub',
            creator: 'CityWitty Merchant Hub'
        });
        let pageWidth = doc.internal.pageSize.getWidth();
        let pageHeight = doc.internal.pageSize.getHeight();
        const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const defaultTextColor: [number, number, number] = [33, 37, 41];
        const firstPageMarginTop = 48;
        const internalMarginTop = 24;
        const baseBottomMargin = 24;
        const footerHeight = 80;
        let y = 0;

        const formatValue = (value: any) => {
            if (Array.isArray(value)) {
                const filtered = value.filter(Boolean);
                return filtered.length ? filtered.join(', ') : 'Not provided';
            }
            if (typeof value === 'string') {
                return value.trim() || 'Not provided';
            }
            if (typeof value === 'boolean') {
                return value ? 'Yes' : 'No';
            }
            if (value === null || value === undefined || value === '') {
                return 'Not provided';
            }
            return String(value);
        };

        const applyWatermark = () => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(46);
            doc.setTextColor(227, 231, 236);
            const centerX = pageWidth / 2;
            const centerY = pageHeight / 2;
            [-70, 0, 70].forEach(offset => {
                doc.text('citywitty merchant hub', centerX, centerY + offset, { align: 'center', angle: 45 });
            });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...defaultTextColor);
        };

        const addHeader = async () => {
            doc.setFillColor(248, 250, 252);
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setDrawColor(222, 231, 240);
            doc.line(0, 40, pageWidth, 40);
            doc.addImage('https://partner.citywitty.com/logo2.png', 'PNG', 15, 10, 38, 18);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(25, 118, 210);
            doc.text('CityWitty Merchant Registration Preview', 60, 20);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(120, 128, 138);
            doc.text(`Generated ${currentDate}`, 60, 30);

            const qrSize = 28;
            const qrX = pageWidth - qrSize - 20;
            const qrY = 8;
            doc.text(`Reference ${formatValue(formData.merchantId)}`, qrX - 12, 30, { align: 'right' });

            if (formData.merchantId) {
                try {
                    const qrDataURL = await QRCode.toDataURL(`https://partner.citywitty.com/application/${formData.merchantId}`, {
                        width: 60,
                        margin: 1,
                        color: {
                            dark: '#1976D2',
                            light: '#FFFFFF'
                        }
                    });
                    doc.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(6);
                    doc.setTextColor(120, 128, 138);
                    doc.text('Scan to track application', qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' });
                } catch (error) {
                    console.error('Error generating QR code:', error);
                }
            }
        };

        const ensureSpace = async (spaceNeeded = 0) => {
            if (y + spaceNeeded > pageHeight - baseBottomMargin) {
                doc.addPage();
                pageWidth = doc.internal.pageSize.getWidth();
                pageHeight = doc.internal.pageSize.getHeight();
                applyWatermark();
                y = internalMarginTop;
            }
        };

        const prepareFooterPage = () => {
            const totalPages = doc.getNumberOfPages();
            doc.setPage(totalPages);
            pageWidth = doc.internal.pageSize.getWidth();
            pageHeight = doc.internal.pageSize.getHeight();
            if (y > pageHeight - footerHeight) {
                doc.addPage();
                pageWidth = doc.internal.pageSize.getWidth();
                pageHeight = doc.internal.pageSize.getHeight();
                applyWatermark();
                y = internalMarginTop;
            }
        };

        const addSectionHeader = async (title: string) => {
            await ensureSpace(22);
            doc.setFillColor(240, 245, 252);
            doc.roundedRect(15, y, pageWidth - 30, 16, 3, 3, 'F');
            doc.setDrawColor(207, 221, 235);
            doc.roundedRect(15, y, pageWidth - 30, 16, 3, 3);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(25, 118, 210);
            doc.text(title.toUpperCase(), 22, y + 11);
            y += 24;
        };

        type FieldConfig = { label: string; value: any; isImportant?: boolean };

        const addFieldRow = async (fields: FieldConfig[]) => {
            if (!fields.length) {
                return;
            }
            await ensureSpace(18);
            const columnWidth = (pageWidth - 60) / fields.length;
            let rowHeight = 0;
            fields.forEach((field, index) => {
                const columnX = 25 + index * columnWidth;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                doc.setTextColor(138, 152, 168);
                doc.text(field.label.toUpperCase(), columnX, y);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                const color = field.isImportant ? [25, 118, 210] : defaultTextColor;
                doc.setTextColor(color[0], color[1], color[2]);
                const text = formatValue(field.value);
                const lines = doc.splitTextToSize(text.replace(/[^\x00-\x7F]/g, ''), columnWidth - 6);
                lines.forEach((line: string, lineIndex: number) => {
                    doc.text(line, columnX, y + 6 + lineIndex * 5);
                });
                rowHeight = Math.max(rowHeight, 6 + lines.length * 5);
            });
            y += rowHeight + 6;
            doc.setTextColor(...defaultTextColor);
        };

        const addSummaryCard = async () => {
            await ensureSpace(30);
            doc.setFillColor(247, 249, 252);
            doc.roundedRect(15, y, pageWidth - 30, 26, 4, 4, 'F');
            doc.setDrawColor(222, 231, 240);
            doc.roundedRect(15, y, pageWidth - 30, 26, 4, 4);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(25, 118, 210);
            doc.text(formatValue(formData.displayName), 25, y + 11);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(90, 102, 121);
            doc.text(`Legal Name: ${formatValue(formData.legalName)}`, 25, y + 19);
            doc.text(`Application ID: ${formatValue(formData.merchantId)}`, pageWidth - 25, y + 11, { align: 'right' });
            doc.text(`Category: ${formatValue(formData.category)}`, pageWidth - 25, y + 19, { align: 'right' });
            y += 38;
        };

        const addFooter = () => {
            const totalPages = doc.getNumberOfPages();
            const lastPage = totalPages;
            doc.setPage(lastPage);
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();
            doc.setDrawColor(222, 231, 240);
            doc.line(15, height - 64, width - 15, height - 64);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(120, 128, 138);
            doc.text('This application will be reviewed and you will be informed via email about your activation status.', 15, height - 56);
            doc.text('CityWitty Partner Success Team', 15, height - 44);
            doc.text('support@citywitty.com | partner.citywitty.com', 15, height - 34);
            doc.text(`Page ${lastPage} of ${totalPages}`, width - 15, height - 34, { align: 'right' });
            doc.setFontSize(7);
            doc.text('This document is confidential and intended solely for the entity to whom it is issued. Unauthorized reproduction or distribution is prohibited.', 15, height - 24, { maxWidth: width - 30 });
            doc.text('CityWitty reserves the right to verify all submitted information and may request additional documentation to authenticate merchant credentials.', 15, height - 16, { maxWidth: width - 30 });
            doc.text('Acceptance into the CityWitty Merchant Program is subject to compliance with our Merchant Terms and Privacy Policy.', 15, height - 8, { maxWidth: width - 30 });
            doc.setPage(lastPage);
            doc.setTextColor(...defaultTextColor);
        };

        const socialFields: FieldConfig[] = [
            { label: 'LinkedIn', value: formData.socialLinks.linkedin },
            { label: 'X (Twitter)', value: formData.socialLinks.x },
            { label: 'YouTube', value: formData.socialLinks.youtube },
            { label: 'Instagram', value: formData.socialLinks.instagram },
            { label: 'Facebook', value: formData.socialLinks.facebook }
        ].filter(field => formatValue(field.value) !== 'Not provided');
        const socialRows: FieldConfig[][] = [];
        for (let index = 0; index < socialFields.length; index += 2) {
            socialRows.push(socialFields.slice(index, index + 2));
        }

        const sections: { title: string; rows: FieldConfig[][] }[] = [
            {
                title: 'Business Information',
                rows: [
                    [
                        { label: 'Legal Name', value: formData.legalName, isImportant: true },
                        { label: 'Display Name', value: formData.displayName, isImportant: true }
                    ],
                    [
                        { label: 'Merchant Slug', value: formData.merchantSlug, isImportant: true },
                        { label: 'Business Type', value: formData.businessType }
                    ],
                    [
                        { label: 'Profile URL (Post Verification)', value: `citywitty.com/merchants/${formData.merchantSlug}` }
                    ],
                    [
                        { label: 'Street Address', value: formData.streetAddress }
                    ],
                    [
                        { label: 'Locality', value: formData.locality },
                        { label: 'City', value: formData.city }
                    ],
                    [
                        { label: 'State', value: formData.state },
                        { label: 'Pincode', value: formData.pincode },
                        { label: 'Country', value: formData.country }
                    ]
                ]
            },
            {
                title: 'Contact Information',
                rows: [
                    [
                        { label: 'Email', value: formData.email, isImportant: true },
                        { label: 'Phone', value: formData.phone, isImportant: true }
                    ],
                    [
                        { label: 'WhatsApp', value: formData.whatsapp },
                        { label: 'Website', value: formData.website }
                    ]
                ]
            },
            ...(socialRows.length ? [{
                title: 'Social Media',
                rows: socialRows
            }] : []),
            {
                title: 'Compliance',
                rows: [
                    [
                        { label: 'GST Number', value: formData.gstNumber },
                        { label: 'PAN Number', value: formData.panNumber, isImportant: true }
                    ],
                    [
                        { label: 'Business License', value: formData.businessLicenseNumber }
                    ]
                ]
            },
            {
                title: 'Business Details',
                rows: [
                    [
                        { label: 'Years in Business', value: formData.yearsInBusiness },
                        { label: 'Average Monthly Revenue', value: formData.averageMonthlyRevenue }
                    ],
                    [
                        { label: 'Business Description', value: formData.description }
                    ]
                ]
            },
            {
                title: 'Operating Schedule',
                rows: [
                    [
                        { label: 'Opening Time', value: formData.businessHours.open },
                        { label: 'Closing Time', value: formData.businessHours.close }
                    ],
                    [
                        { label: 'Operating Days', value: formData.businessHours.days }
                    ]
                ]
            }
        ];

        applyWatermark();
        await addHeader();
        y = firstPageMarginTop;
        await addSummaryCard();
        for (const section of sections) {
            if (!section.rows.length) {
                continue;
            }
            await addSectionHeader(section.title);
            for (const row of section.rows) {
                await addFieldRow(row);
            }
        }
        prepareFooterPage();
        addFooter();
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
        ['panNumber', 'businessLicenseNumber'], // step 2
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
            if (field === 'businessLicenseNumber') {
                return !value;
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