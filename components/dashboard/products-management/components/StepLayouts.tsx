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
        'rounded-2xl p-6 bg-gradient-to-br relative overflow-hidden border border-white/30 text-white shadow-lg dark:shadow-xl dark:shadow-gray-900/30',
        step.color,
      )}
      >
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-white/25 backdrop-blur-md border border-white/20">
              <Sparkles className="h-5 w-5 drop-shadow" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                <Badge className="bg-white/30 text-white border border-white/40 backdrop-blur-sm font-semibold">
                  {stepIndex + 1}/{steps.length}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed font-medium">{step.description}</p>
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
};