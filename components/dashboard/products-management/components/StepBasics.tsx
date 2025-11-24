import { ReactNode } from 'react';
import {
  Package,
  Tag,
  Box,
  Sparkles,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductsFormContextType } from './StepsContext';
import { StepWrapper } from './StepLayouts';

export const StepBasics = ({ context }: { context: ProductsFormContextType }) => {
  const { form } = context;
  return (
    <div className="space-y-6">
        {/* Product ID */}
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Product ID
                <Badge variant="secondary" className="ml-2 text-xs font-normal">
                  Auto-generated
                </Badge>
              </FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <Input
                    {...field}
                    placeholder="Will be assigned automatically"
                    disabled
                    className="bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 h-10 text-gray-600"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Name */}
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Product Name
                <Badge variant="destructive" className="ml-2 text-xs font-normal">
                  Required
                </Badge>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., iPhone 15 Pro Max, Samsung Galaxy Watch"
                  className="mt-2 h-10 bg-white dark:bg-gray-900/50 border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500"
                />
              </FormControl>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                Enter a clear, descriptive name that customers will see
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <FormField
            control={form.control}
            name="productCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Category
                  <Badge variant="destructive" className="ml-2 text-xs font-normal">
                    Required
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Smartphones, Laptops"
                    className="mt-2 h-10 bg-white dark:bg-gray-900/50 border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500"
                  />
                </FormControl>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">Product classification</p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Brand
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Apple, Samsung"
                    className="mt-2 h-10 bg-white dark:bg-gray-900/50 border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500"
                  />
                </FormControl>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">Optional brand association</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="productDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Product Description
                <Badge variant="destructive" className="ml-2 text-xs font-normal">
                  Required
                </Badge>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Describe your product in detail. Include key features, specifications, benefits, and what makes it special."
                  className="mt-2 resize-none bg-white dark:bg-gray-900/50 border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500 leading-relaxed"
                />
              </FormControl>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                10-2000 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
};
