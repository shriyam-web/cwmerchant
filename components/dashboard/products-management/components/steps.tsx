import { ReactNode } from 'react';
import {
  Package,
  Image as ImageIcon,
  IndianRupee,
  Truck,
  Award,
  Check,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductsFormContext, useProductsFormContext } from './StepsContext';
import { StepWrapper } from './StepLayouts';
import { ProductCard } from './ProductCard';
import { ProductsFormContextType } from './StepsContext';
import { ProductRecord, steps } from '../types';
import { StepBasics } from './StepBasics';
import { StepMedia } from './StepMedia';
import { StepPricing } from './StepPricing';
import { StepInventory } from './StepInventory';
import { StepBadges } from './StepBadges';

const dynamicStepIcons = [Package, ImageIcon, IndianRupee, Truck, Award] as const;

export type StepRendererProps = {
  context: ProductsFormContextType;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const renderStepContent = (props: StepRendererProps) => {
  const { context } = props;
  const stepIndex = context.currentStep;

  switch (stepIndex) {
    case 0:
      return <StepWrapper stepIndex={0}><StepBasics context={context} /></StepWrapper>;
    case 1:
      return <StepWrapper stepIndex={1}><StepMedia {...props} /></StepWrapper>;
    case 2:
      return <StepWrapper stepIndex={2}><StepPricing context={context} /></StepWrapper>;
    case 3:
      return <StepWrapper stepIndex={3}><StepInventory context={context} /></StepWrapper>;
    case 4:
      return <StepWrapper stepIndex={4}><StepBadges context={context} /></StepWrapper>;
    default:
      return null;
  }
};

export const StepNavigation = ({ context }: { context: ProductsFormContextType }) => {
  const { currentStep, goToStep, loading } = context;

  const stepColors = [
    { light: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', indicator: 'bg-blue-500' },
    { light: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', indicator: 'bg-purple-500' },
    { light: 'bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800', indicator: 'bg-pink-500' },
    { light: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', indicator: 'bg-emerald-500' },
    { light: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', indicator: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, index) => {
          const Icon = dynamicStepIcons[index] ?? Package;
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const colors = stepColors[index];

          return (
            <div key={step.title} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => goToStep(index)}
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold border-2 transition-all',
                  isActive
                    ? `${colors.light} border-current`
                    : isCompleted
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                title={`${step.title} — ${step.description}`}
                disabled={loading}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-1 flex-1 rounded-full transition-colors',
                    index < currentStep ? colors.indicator : 'bg-gray-200 dark:bg-gray-800'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 px-1">
        {steps.map((step, index) => (
          <div key={step.title} className="flex-1 text-center">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{step.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RenderStep = (props: StepRendererProps) => {
  return <div className="space-y-6">{renderStepContent(props)}</div>;
};

export const BottomNavigation = ({ context, form }: { context: ProductsFormContextType; form: any }) => {
  const { currentStep, goToNextStep, goToPreviousStep, onSubmit, loading, validateStep } = context;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isEditing = !!form.getValues('productId');

  console.log('BottomNavigation: currentStep=', currentStep, 'steps.length=', steps.length, 'isLastStep=', isLastStep);

  const handleNext = async () => {
    if (loading) return;

    if (!isLastStep) {
      console.log('handleNext: not last step, calling goToNextStep');
      await goToNextStep();
    } else {
      console.log('handleNext: is last step, should submit');
    }
    // If it's the last step, the form submit will be triggered by the submit button
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    if (loading) return;

    const valid = await validateStep(currentStep);
    if (!valid) {
      e.preventDefault();
      return;
    }
    // Let the form's onSubmit handle the actual submission
  };

  return (
    <div className="flex justify-between gap-3 pt-8 border-t border-gray-200 dark:border-gray-700/50">
      <Button
        type="button"
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep || loading}
        className="px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/50"
      >
        Previous
      </Button>
      <Button
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? handleSubmit : handleNext}
        disabled={loading}
        className="px-8 py-2.5 font-bold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isLastStep ? 'Saving...' : 'Checking...'}
          </>
        ) : (
          isLastStep ? (isEditing ? 'Update Product' : 'Submit Product') : 'Next'
        )}
      </Button>
    </div>
  );
};

export const ProductsList = ({
  products,
  onDelete,
  onEdit
}: {
  products: ProductRecord[];
  onDelete: (productId: string) => void;
  onEdit?: (product: ProductRecord) => void;
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-2xl border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/30">
        <Sparkles className="h-10 w-10 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-semibold text-muted-foreground dark:text-gray-400">No products added yet.</p>
        <p className="text-sm text-muted-foreground dark:text-gray-500">Start by adding your first product.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
};
