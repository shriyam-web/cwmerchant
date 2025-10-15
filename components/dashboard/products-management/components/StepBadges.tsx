import { ReactNode } from 'react';
import {
  Award,
  Sparkles,
  Info,
  HelpCircle,
  Plus,
  Trash2,
  Shield,
  Star,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ProductsFormContextType } from './StepsContext';
import { StepWrapper } from './StepLayouts';

export const StepBadges = ({ context }: { context: ProductsFormContextType }) => {
  const {
    form,
    fieldArrays,
  } = context;
  const faqFieldArray = fieldArrays.faq;

  return (
    <div className="space-y-8">
      {/* Badges & Features Section */}
      <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500 shadow-lg">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-600">Badges & Features</h3>
            <p className="text-sm text-muted-foreground">Highlight your product with special badges</p>
          </div>
          <Sparkles className="h-5 w-5 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cityWittyAssured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-400">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold">CityWitty Assured</FormLabel>
                    <p className="text-sm text-muted-foreground">Verified by CityWitty</p>
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-500" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPriority"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-400">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold">Priority Listing</FormLabel>
                    <p className="text-sm text-muted-foreground">Get highlighted in listings</p>
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-purple-500" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sponsored"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-400">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold">Sponsored</FormLabel>
                    <p className="text-sm text-muted-foreground">Boosted visibility</p>
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-500" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bestsellerBadge"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-400">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold">Bestseller Badge</FormLabel>
                    <p className="text-sm text-muted-foreground">Mark as a top-selling product</p>
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-orange-500" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                Additional Information
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Any extra details customers should know..."
                  className="border-l-4 border-l-blue-500 focus:border-l-blue-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* FAQs Section */}
      <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500 shadow-lg">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600">Frequently Asked Questions</h3>
              <p className="text-sm text-muted-foreground">
                {faqFieldArray.fields.length} FAQ{faqFieldArray.fields.length !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              faqFieldArray.append({
                question: '',
                answer: '',
              })
            }
            className="border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <Plus className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
        </div>

        {faqFieldArray.fields.length === 0 && (
          <div className="text-center py-8 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-900/50">
            <HelpCircle className="h-12 w-12 text-blue-300 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No FAQs added yet. Add common questions and answers.</p>
          </div>
        )}

        <div className="space-y-4">
          {faqFieldArray.fields.map((faqField, index) => (
            <div key={faqField.id} className="space-y-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-5 bg-white/50 dark:bg-gray-900/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white shadow-md">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">FAQ {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => faqFieldArray.remove(index)}
                  className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`faq.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-500" />
                      Question *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E.g. What is the return policy?"
                        className="border-l-4 border-l-blue-500 focus:border-l-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`faq.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Answer *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Provide a clear answer..."
                        className="border-l-4 border-l-blue-500 focus:border-l-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
