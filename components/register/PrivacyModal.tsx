import { X } from 'lucide-react';
import PrivacyPolicyPage from '@/app/privacy-policy/page';

interface PrivacyModalProps {
    open: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 mt-16 pt-20 pb-20" onClick={onClose}>
            <div className="bg-white rounded-lg w-11/12 max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-3 p-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <X className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
                <PrivacyPolicyPage />
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
                </div>
            </div>
        </div>
    );
}