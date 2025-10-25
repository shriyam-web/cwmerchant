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

  return (
    <div className="flex items-center justify-between gap-1">
      {steps.map((step, index) => {
        const Icon = dynamicStepIcons[index] ?? Package;
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.title} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => goToStep(index)}
              className={cn(
                'relative flex h-14 w-14 items-center justify-center rounded-xl text-sm font-medium border-2 transition-colors',
                isActive
                  ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-xl border-transparent'
                  : isCompleted
                    ? 'bg-blue-100 text-blue-600 dark:from-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700 shadow-md'
                    : 'bg-muted text-muted-foreground border-gray-200 dark:border-gray-700'
              )}
              title={`${step.title} — ${step.description}`}
              disabled={loading}
            >
              {isCompleted ? <Check className="h-6 w-6 drop-shadow-sm" /> : <Icon className="h-6 w-6" />}
              <span
                className={cn(
                  'absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm',
                  isActive
                    ? 'bg-white text-primary'
                    : isCompleted
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                )}
              >
                {index + 1}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-1.5 flex-1 rounded-full relative overflow-hidden',
                  index < currentStep ? 'bg-blue-400 shadow-sm' : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </div>
        );
      })}
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
    <div className="flex justify-between pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep || loading}
      >
        Previous
      </Button>
      <Button
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? handleSubmit : handleNext}
        disabled={loading}
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
      <div className="text-center py-12 border-2 border-dashed rounded-2xl">
        <Sparkles className="h-10 w-10 mx-auto text-blue-400 mb-4" />
        <p className="text-lg font-semibold text-muted-foreground">No products added yet.</p>
        <p className="text-sm text-muted-foreground">Start by adding your first product.</p>
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
