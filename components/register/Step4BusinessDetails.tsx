import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step4Props {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    fieldErrors: Record<string, string | undefined>;
}

export default function Step4BusinessDetails({ formData, handleInputChange, fieldErrors }: Step4Props) {
    return (
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
                        onChange={(e) => handleInputChange('businessHours', { ...formData.businessHours, open: e.target.value })}
                        className="h-10 p-3 placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                    />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="businessHoursClose">Close Time <span className="text-red-500">*</span></Label>
                        <Input
                            id="businessHoursClose"
                            type="time"
                            value={formData.businessHours.close}
                            onChange={(e) => handleInputChange('businessHours', { ...formData.businessHours, close: e.target.value })}
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
                                        const newDays = checked ? [...formData.businessHours.days, day] : formData.businessHours.days.filter((d: string) => d !== day);
                                        handleInputChange('businessHours', { ...formData.businessHours, days: newDays });
                                    }}
                                />
                                <Label htmlFor={`day-${day}`}>{day}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
