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
        {/* Product ID Card */}
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20 p-5">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <div className="p-1.5 rounded-md bg-gray-500">
                    <Tag className="h-3.5 w-3.5 text-white" />
                  </div>
                  Product ID
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Auto-generated
                  </Badge>
                </FormLabel>
                <FormControl>
                  <div className="relative mt-2">
                    <Input
                      {...field}
                      placeholder="Will be assigned automatically"
                      disabled
                      className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 h-11 pl-4 pr-10"
                    />
                    <Info className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Unique identifier assigned upon product creation
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product Name Card */}
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20 p-5">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <div className="p-1.5 rounded-md bg-gray-500">
                    <Package className="h-3.5 w-3.5 text-white" />
                  </div>
                  Product Name
                  <Badge variant="destructive" className="ml-auto text-xs">
                    Required
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., iPhone 15 Pro Max, Samsung Galaxy Watch"
                    className="mt-2 border-l-4 border-l-gray-500 focus:border-l-gray-600 h-11 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Enter a clear, descriptive name that customers will see
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Card */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20 p-5">
            <FormField
              control={form.control}
              name="productCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                    <div className="p-1.5 rounded-md bg-gray-500">
                      <Box className="h-3.5 w-3.5 text-white" />
                    </div>
                    Category
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Required
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Smartphones, Laptops"
                      className="mt-2 border-l-4 border-l-gray-500 focus:border-l-gray-600 h-11 bg-white dark:bg-gray-950"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1.5">Product classification</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Brand Card */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20 p-5">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                    <div className="p-1.5 rounded-md bg-gray-500">
                      <Tag className="h-3.5 w-3.5 text-white" />
                    </div>
                    Brand
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Apple, Samsung"
                      className="mt-2 border-l-4 border-l-gray-500 focus:border-l-gray-600 h-11 bg-white dark:bg-gray-950"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1.5">Optional brand association</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description Card */}
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20 p-5">
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <div className="p-1.5 rounded-md bg-gray-500">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  Product Description
                  <Badge variant="destructive" className="ml-auto text-xs">
                    Required
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={6}
                    placeholder="Describe your product in detail. Include key features, specifications, benefits, and what makes it special. Help customers understand why they should choose this product."
                    className="mt-2 border-l-4 border-l-gray-500 focus:border-l-gray-600 resize-none bg-white dark:bg-gray-950 leading-relaxed"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Write a compelling description (10-2000 characters) that highlights key features and benefits
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
    </div>
  );
};
