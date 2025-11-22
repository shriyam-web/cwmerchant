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
        <div className="mt-8 pt-6 border-t">
            {/* Step indicators - centered */}
            <div className="flex justify-center items-center gap-2 mb-4">
                {[0, 1, 2, 3, 4].map(step => (
                    <div
                        key={step}
                        onClick={() => handleStepClick(step)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${step === currentStep
                                ? 'bg-gray-600'
                                : completedSteps[step]
                                    ? 'bg-green-500'
                                    : incompleteSteps[step]
                                        ? 'bg-red-400'
                                        : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation buttons - responsive layout */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                    className="flex items-center justify-center gap-2 flex-1 sm:flex-initial min-h-[44px] text-sm sm:text-base"
                >
                    <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Back</span>
                </Button>

                {currentStep < 4 ? (
                    <Button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial min-h-[44px] text-sm sm:text-base"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Continue</span>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={isFormValid ? handleSubmit : showMissingFields}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial min-h-[44px] text-sm sm:text-base bg-green-600 hover:bg-green-700"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="hidden sm:inline">Submitting...</span>
                                <span className="sm:hidden">Submit</span>
                            </>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Submit Application</span>
                                <span className="sm:hidden">Submit</span>
                            </>
                        )}
                        <Send className="w-4 h-4 flex-shrink-0" />
                    </Button>
                )}
            </div>
        </div>
    );
}
