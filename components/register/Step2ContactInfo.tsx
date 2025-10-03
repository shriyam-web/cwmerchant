import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckIcon, Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState, useEffect } from 'react';

import CityAutocomplete from './CityAutocomplete';

interface Step2Props {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    fieldErrors: Record<string, string | undefined>;
    checkingField: Record<string, boolean | undefined>;
    checkedField: Record<string, boolean | undefined>;
    suggestedSlugs: string[];
    triggerRegenerateSuggestions: () => void;
    validateSocialMediaURL: (platform: string, url: string) => string | null;
    isValidURL: (url: string) => boolean;
}

export default function Step2ContactInfo({ formData, handleInputChange, fieldErrors, checkingField, checkedField, suggestedSlugs, triggerRegenerateSuggestions, validateSocialMediaURL, isValidURL }: Step2Props) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Step 2: Contact Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="merchantSlug">Profile Username <span className="text-red-500">*</span></Label>
                    <input
                        type="text"
                        id="merchantSlug"
                        value={formData.merchantSlug}
                        placeholder="Select a username from suggestions"
                        disabled={suggestedSlugs.length > 0}
                        onChange={(e) => handleInputChange('merchantSlug', e.target.value)}
                        className={`h-10 p-3 w-full border rounded placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm ${suggestedSlugs.length > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    {formData.merchantSlug && (
                        <button
                            type="button"
                            onClick={() => {
                                handleInputChange('merchantSlug', '');
                                triggerRegenerateSuggestions();
                            }}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Try other username
                        </button>
                    )}
                    {!formData.merchantSlug && (
                        <div className="mt-2 space-y-1">
                            <p className="text-sm font-semibold text-gray-700">Suggested usernames:</p>
                            {suggestedSlugs.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700 max-h-40 overflow-y-auto">
                                    {suggestedSlugs.map((slug: string) => (
                                        <li key={slug} className="cursor-pointer text-blue-600 hover:underline"
                                            onClick={() => handleInputChange('merchantSlug', slug)}>
                                            {slug}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No username suggestions available</p>
                            )}
                        </div>
                    )}
                    {formData.merchantSlug && (
                        <p className="text-sm text-blue-600 mt-1">
                            Your profile URL post-verification will be: https://www.citywitty.com/merchants/{formData.merchantSlug}
                        </p>
                    )}
                    {checkingField.merchantSlug ? (
                        <p className="text-sm text-gray-500 mt-1">Checking username…</p>
                    ) : fieldErrors.merchantSlug ? (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {fieldErrors.merchantSlug}
                        </p>
                    ) : checkedField.merchantSlug && formData.merchantSlug ? (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4" /> Username looks good
                        </p>
                    ) : null}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Business Email <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
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
                    ) : checkedField.email && !fieldErrors.email && /\S+@\S+\.\S+/.test(formData.email) ? (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4" /> Email looks good
                        </p>
                    ) : null}
                </div>
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
                        className="w-full border p-3 rounded-lg"
                        required
                    />
                    {checkingField.phone ? (
                        <p className="text-sm text-gray-500 mt-1">Checking phone…</p>
                    ) : fieldErrors.phone ? (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {fieldErrors.phone}
                        </p>
                    ) : checkedField.phone && !fieldErrors.phone ? (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4" /> Phone looks good
                        </p>
                    ) : null}
                </div>
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
                    <p className="text-red-500 text-sm mt-1">Invalid URL format</p>
                )}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h4>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                        </div>
                        <Input
                            id="linkedin"
                            value={formData.socialLinks.linkedin}
                            onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className={`${validateSocialMediaURL('linkedin', formData.socialLinks.linkedin) ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                        />
                        {validateSocialMediaURL('linkedin', formData.socialLinks.linkedin) && (
                            <p className="text-red-500 text-sm">{validateSocialMediaURL('linkedin', formData.socialLinks.linkedin)}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <Label htmlFor="x">X (Twitter) (Optional)</Label>
                        </div>
                        <Input
                            id="x"
                            value={formData.socialLinks.x}
                            onChange={(e) => handleInputChange('socialLinks.x', e.target.value)}
                            placeholder="https://x.com/yourhandle"
                            className={`${validateSocialMediaURL('x', formData.socialLinks.x) ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                        />
                        {validateSocialMediaURL('x', formData.socialLinks.x) && (
                            <p className="text-red-500 text-sm">{validateSocialMediaURL('x', formData.socialLinks.x)}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <Label htmlFor="youtube">YouTube (Optional)</Label>
                        </div>
                        <Input
                            id="youtube"
                            value={formData.socialLinks.youtube}
                            onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                            placeholder="https://youtube.com/channel/yourchannel"
                            className={`${validateSocialMediaURL('youtube', formData.socialLinks.youtube) ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                        />
                        {validateSocialMediaURL('youtube', formData.socialLinks.youtube) && (
                            <p className="text-red-500 text-sm">{validateSocialMediaURL('youtube', formData.socialLinks.youtube)}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            <Label htmlFor="instagram">Instagram (Optional)</Label>
                        </div>
                        <Input
                            id="instagram"
                            value={formData.socialLinks.instagram}
                            onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                            placeholder="https://instagram.com/yourhandle"
                            className={`${formData.socialLinks.instagram && !formData.socialLinks.instagram.includes('instagram.com') ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                        />
                        {formData.socialLinks.instagram && !formData.socialLinks.instagram.includes('instagram.com') && (
                            <p className="text-red-500 text-sm">Invalid Instagram URL. Expected domain: instagram.com</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <Label htmlFor="facebook">Facebook (Optional)</Label>
                        </div>
                        <Input
                            id="facebook"
                            value={formData.socialLinks.facebook}
                            onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                            placeholder="https://facebook.com/yourpage"
                            className={`${formData.socialLinks.facebook && !formData.socialLinks.facebook.includes('facebook.com') ? 'border-red-500' : ''} h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm`}
                        />
                        {formData.socialLinks.facebook && !formData.socialLinks.facebook.includes('facebook.com') && (
                            <p className="text-red-500 text-sm">Invalid Facebook URL. Expected domain: facebook.com</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
