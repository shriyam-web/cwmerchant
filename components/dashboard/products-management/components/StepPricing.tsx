import { ReactNode } from 'react';
import {
  IndianRupee,
  Tag,
  TrendingUp,
  Gift,
  Sparkles,
  Truck,
  Wallet,
  Box,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ProductsFormContextType } from './StepsContext';
import { StepWrapper } from './StepLayouts';

export const StepPricing = ({ context }: { context: ProductsFormContextType }) => {
  const {
    form,
    fieldArrays,
  } = context;
  const variantsFieldArray = fieldArrays.productVariants;

  return (
    <div className="space-y-8">
      {/* Pricing Section */}
      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 p-6 border-2 border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="h-5 w-5 text-gray-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Pricing Details</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-600" />
                  MRP *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="₹"
                    className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Discounted Price
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="₹"
                    className="border-l-4 border-l-purple-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountOfferedOnProduct"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-gray-600" />
                  Discount (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="₹"
                    className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offerApplicable"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gray-600" />
                  Offer Applicable
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Festival Offer"
                    className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Fees Section */}
      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 p-6 border-2 border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-5 w-5 text-gray-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Delivery & Fees</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deliveryFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                  Delivery Fee (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="₹"
                    className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderHandlingFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                  Handling Fee (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="₹"
                    className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cashbackPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex itemscenter gap-2">
                  <Wallet className="h-4 w-4 text-gray-600" />
                  Cashback Points
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    placeholder="0"
                    className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isWalletCompatible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-950 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-gray-600" />
                    Wallet Compatible
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Enable if customers can pay via CityWitty wallet.
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-gray-600" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base font-semibold">Product Variants</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              variantsFieldArray.append({
                variantId: '',
                name: '',
                price: '',
                stock: '',
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Variant
          </Button>
        </div>
        {variantsFieldArray.fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No variants added yet. Add one if you sell multiple configurations.
          </p>
        )}
        <div className="space-y-4">
          {variantsFieldArray.fields.map((variantField, index) => (
            <div key={variantField.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium">Variant {index + 1}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => variantsFieldArray.remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`productVariants.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g. 128 GB | Blue" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`productVariants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="decimal" placeholder="₹" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`productVariants.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock *</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="numeric" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
