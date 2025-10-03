import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface FormNavigationProps {
    currentStep: number;
    completedSteps: boolean[];
    incompleteSteps: boolean[];
    isFormValid: boolean;
    isSubmitting: boolean;
    handlePreviousStep: () => void;
    handleNextStep: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    showMissingFields: () => void;
    handleStepClick: (step: number) => void;
}

export default function FormNavigation({
    currentStep,
    completedSteps,
    incompleteSteps,
    isFormValid,
    isSubmitting,
    handlePreviousStep,
    handleNextStep,
    handleSubmit,
    showMissingFields,
    handleStepClick
}: FormNavigationProps) {
    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </Button>

            <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map(step => (
                    <div
                        key={step}
                        onClick={() => handleStepClick(step)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${step === currentStep
                                ? 'bg-blue-600'
                                : completedSteps[step]
                                    ? 'bg-green-500'
                                    : incompleteSteps[step]
                                        ? 'bg-red-400'
                                        : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            {currentStep < 4 ? (
                <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={isFormValid ? handleSubmit : showMissingFields}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <Send className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
