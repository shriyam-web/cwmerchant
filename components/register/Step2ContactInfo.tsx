import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckIcon, Linkedin, Twitter, Youtube, Instagram, Facebook, Loader2 } from 'lucide-react';
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
                        disabled
                        className="h-10 p-3 w-full border rounded placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm bg-gray-100 cursor-not-allowed"
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
                            <Linkedin className="w-5 h-5 text-blue-600" />
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
                            <Twitter className="w-5 h-5 text-blue-400" />
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
                            <Youtube className="w-5 h-5 text-red-600" />
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
                            <Instagram className="w-5 h-5 text-pink-600" />
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
                            <Facebook className="w-5 h-5 text-blue-700" />
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
