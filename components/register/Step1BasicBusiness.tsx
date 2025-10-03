import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from "lucide-react";
import CityAutocomplete from './CityAutocomplete.tsx';
import StateAutocomplete from './StateAutocomplete.tsx';

interface Step1Props {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    fieldErrors: Record<string, string | undefined>;
}

export default function Step1BasicBusiness({ formData, handleInputChange, fieldErrors }: Step1Props) {
    return (
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
                            {[
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
                            ].map(category => (
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
                    <StateAutocomplete
                        value={formData.state}
                        onChange={(val: string) => handleInputChange('state', val)}
                    />
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
    );
}
