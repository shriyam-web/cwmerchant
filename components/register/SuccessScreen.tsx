import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessScreenProps {
    visible: boolean;
    formData: any;
    downloadPDF: () => void;
}

export default function SuccessScreen({ visible, formData, downloadPDF }: SuccessScreenProps) {
    if (!visible) return null;

    return (
        <div className="success-screen bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted Successfully!</h2>
            <p className="text-green-700 mb-4">
                Thank you for registering with CityWitty. Your application has been submitted and is under review.
            </p>
            <p className="text-sm text-green-600 mb-6">
                Your Merchant ID: <strong>{formData.merchantId}</strong>
            </p>
            <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Confirmation PDF
            </Button>
        </div>
    );
}
