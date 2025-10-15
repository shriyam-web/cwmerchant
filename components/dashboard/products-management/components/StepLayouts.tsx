import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { steps } from '../types';

type StepWrapperProps = {
  stepIndex: number;
  children: ReactNode;
};

export const StepWrapper = ({ stepIndex, children }: StepWrapperProps) => {
  const step = steps[stepIndex];
  if (!step) return null;

  return (
    <div className="space-y-6">
      <div className={cn(
        'rounded-2xl p-6 bg-gradient-to-br relative overflow-hidden border-2 border-white/20 text-white shadow-2xl',
        step.color,
      )}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Step {stepIndex + 1}/{steps.length}
                </Badge>
              </div>
            </div>
            <Sparkles className="h-6 w-6 drop-shadow-lg" />
          </div>
          <p className="text-white/95 text-sm leading-relaxed pl-14">{step.description}</p>
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
};