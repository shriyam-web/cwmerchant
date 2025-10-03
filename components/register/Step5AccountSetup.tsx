import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckIcon, Eye, EyeOff } from "lucide-react";

interface Step5Props {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    fieldErrors: Record<string, string | undefined>;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    showPwdTooltip: boolean;
    pwdChecks: Record<string, boolean>;
    showCopyPasteTooltip: Record<string, boolean>;
    handlePreventCopyPaste: (field: 'password' | 'confirmPassword') => (e: React.ClipboardEvent<HTMLInputElement>) => void;
    setShowTermsModal: (show: boolean) => void;
    setShowPrivacyModal: (show: boolean) => void;
}

export default function Step5AccountSetup({
    formData,
    handleInputChange,
    fieldErrors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showPwdTooltip,
    pwdChecks,
    showCopyPasteTooltip,
    handlePreventCopyPaste,
    setShowTermsModal,
    setShowPrivacyModal
}: Step5Props) {
    return (
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
                        onFocus={() => { }}
                        onBlur={() => { }}
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

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-yellow-100 rounded-full">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-yellow-800 mb-1">Important: Remember Your Login Credentials</h4>
                        <p className="text-sm text-yellow-700">
                            Please remember your email (from Step 2) and password as they will be required to log in to your merchant dashboard after registration approval.
                        </p>
                    </div>
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
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Merchant ID:</span>
                            <span className="text-gray-900 break-words">Will be auto generated Upon Submission</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Profile Username:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.merchantSlug}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Legal Name:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.legalName}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Display Name:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.displayName}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Category:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.category}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">City:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.city}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Street Address:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.streetAddress}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Pincode:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.pincode}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Locality:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.locality}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">State:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.state}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Country:</span>
                            <span className="text-gray-900 break-words">{formData.country}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Email:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.email}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Phone:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.phone}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">WhatsApp:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.whatsapp}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Website:</span>
                            <span className="text-gray-900 break-words">{formData.website}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">LinkedIn:</span>
                            <span className="text-gray-900 break-words">{formData.socialLinks.linkedin}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">X:</span>
                            <span className="text-gray-900 break-words">{formData.socialLinks.x}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">YouTube:</span>
                            <span className="text-gray-900 break-words">{formData.socialLinks.youtube}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Instagram:</span>
                            <span className="text-gray-900 break-words">{formData.socialLinks.instagram}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Facebook:</span>
                            <span className="text-gray-900 break-words">{formData.socialLinks.facebook}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">GST Number:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.gstNumber}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">PAN Number:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.panNumber}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Business Type:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.businessType}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Years in Business:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.yearsInBusiness}</span>
                        </div>
                    </div>
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Average Monthly Revenue:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.averageMonthlyRevenue}</span>
                        </div>
                    </div>

                    <div className="col-span-2 py-2 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Description:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.description}</span>
                        </div>
                    </div>
                    <div className="col-span-2 py-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">Business Hours:<span className="text-red-500">*</span></span>
                            <span className="text-gray-900 break-words">{formData.businessHours.open} - {formData.businessHours.close}, {formData.businessHours.days.join(', ')}</span>
                        </div>
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
    );
}
