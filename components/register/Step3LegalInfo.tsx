import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from "lucide-react";

interface Step3Props {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    fieldErrors: Record<string, string | undefined>;
    checkingField: Record<string, boolean | undefined>;
}

export default function Step3LegalInfo({ formData, handleInputChange, fieldErrors, checkingField }: Step3Props) {
    return (
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
                        onChange={(e) => {
                            if (e.target.value.length <= 15) {
                                handleInputChange('gstNumber', e.target.value);
                            }
                        }}
                        onBlur={() => formData.gstNumber && checkingField.gstNumber}
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
                    <Label htmlFor="panNumber">PAN Number (Business Owner) <span className="text-red-500">*</span></Label>
                    <Input
                        id="panNumber"
                        value={formData.panNumber}
                        onChange={(e) => {
                            if (e.target.value.length <= 10) {
                                handleInputChange('panNumber', e.target.value);
                            }
                        }}
                        onBlur={() => formData.panNumber && checkingField.panNumber}
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
    );
}
