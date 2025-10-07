import { X, AlertCircle } from 'lucide-react';

interface MissingFieldsModalProps {
    open: boolean;
    onClose: () => void;
    missingFields: string[];
    fieldLabel: (f: string) => string;
}

export default function MissingFieldsModal({ open, onClose, missingFields, fieldLabel }: MissingFieldsModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 mt-16 pt-20 pb-20" onClick={onClose}>
            <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-3 p-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <X className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    Missing Required Fields
                </h2>
                <p className="text-gray-600 mb-4">Please fill in the following required fields to submit your application:</p>
                <ul className="list-disc list-inside space-y-1">
                    {missingFields.map(field => (
                        <li key={field} className="text-sm text-gray-800">{fieldLabel(field)}</li>
                    ))}
                </ul>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
                </div>
            </div>
        </div>
    );
}