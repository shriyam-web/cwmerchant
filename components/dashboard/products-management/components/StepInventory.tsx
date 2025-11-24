import { ReactNode } from 'react';
import {
  Package,
  Box,
  MapPin,
  TrendingUp,
  Truck,
  Info,
  Plus,
  Trash2,
  Shield,
  Clock,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import allCities from '@/data/allCities.json';
import { ProductsFormContextType } from './StepsContext';
import { StepWrapper } from './StepLayouts';

export const StepInventory = ({ context }: { context: ProductsFormContextType }) => {
  const {
    form,
    watchIsAvailableStock,
    watchIsReplacement,
    watchIsWarranty,
    fieldArrays: { whatsInsideTheBox: boxItemsFieldArray, deliverableLocations: locationsFieldArray },
  } = context;

  return (
    <div className="space-y-8">
      {/* Stock & Availability Section */}
      <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500">
            <Box className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Stock & Availability</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Manage inventory and store presence</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="instore"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-950 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  Available In-Store
                </FormLabel>
                <p className="text-sm text-muted-foreground">Indicate if customers can purchase directly at your outlet.</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-600" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAvailableStock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-emerald-300 dark:border-emerald-800 p-4 bg-white dark:bg-gray-950 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Product In Stock
                </FormLabel>
                <p className="text-sm text-muted-foreground">Disable this when the product is temporarily unavailable.</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-600" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availableStocks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Box className="h-4 w-4 text-gray-600" />
                Available Units {watchIsAvailableStock ? '*' : ''}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!watchIsAvailableStock}
                  inputMode="numeric"
                  placeholder="0"
                  className="border-l-4 border-l-emerald-500 bg-white dark:bg-gray-950 focus-visible:ring-emerald-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Product Dimensions Section */}
      <div className="rounded-xl border-2 border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/20 dark:to-cyan-900/20 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Product Dimensions</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Physical measurements of the product</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="productHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-600 rotate-90" />
                  Height (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="0"
                    className="border-l-4 border-l-cyan-500 bg-white dark:bg-gray-950 focus-visible:ring-cyan-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-600" />
                  Width (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="0"
                    className="border-l-4 border-l-cyan-500 bg-white dark:bg-gray-950 focus-visible:ring-cyan-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-cyan-600" />
                  Weight (g)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="0"
                    className="border-l-4 border-l-cyan-500 bg-white dark:bg-gray-950 focus-visible:ring-cyan-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Package Dimensions Section */}
      <div className="rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/20 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500">
            <Box className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Package Dimensions</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Shipping box measurements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="productPackageHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600 rotate-90" />
                  Height (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="0"
                    className="border-l-4 border-l-indigo-500 bg-white dark:bg-gray-950 focus-visible:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productPackageWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Width (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="0"
                    className="border-l-4 border-l-indigo-500 bg-white dark:bg-gray-950 focus-visible:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productPackageWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-indigo-600" />
                  Weight (g)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="decimal"
                    placeholder="0"
                    className="border-l-4 border-l-indigo-500 bg-white dark:bg-gray-950 focus-visible:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* What's Inside the Box Section */}
      <div className="rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500">
              <Box className="h-5 w-5 text-white" />
            </div>
            <div>
              <FormLabel className="text-base font-semibold text-gray-900 dark:text-gray-100">
                What's Inside the Box
              </FormLabel>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {boxItemsFieldArray.fields.length} items added
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => boxItemsFieldArray.append('')}
            className="bg-white dark:bg-gray-950 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
          >
            <Plus className="mr-2 h-4 w-4 text-orange-600" /> Add Item
          </Button>
        </div>
        {boxItemsFieldArray.fields.length === 0 && (
          <p className="text-sm text-gray-700 dark:text-gray-300 italic flex items-center gap-2">
            <Info className="h-4 w-4" />
            List all items included in the package.
          </p>
        )}
        <div className="space-y-3">
          {boxItemsFieldArray.fields.map((fieldItem: any, index: number) => (
            <div key={fieldItem.id} className="flex gap-2">
              <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-orange-500 text-white font-bold text-sm shadow-md">
                {index + 1}
              </div>
              <FormField
                control={form.control}
                name={`whatsInsideTheBox.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E.g. USB-C charge cable"
                        className="border-l-4 border-l-orange-500 bg-white dark:bg-gray-950 focus-visible:ring-orange-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-950"
                onClick={() => boxItemsFieldArray.remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Locations Section */}
      <div className="rounded-xl border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <FormLabel className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Deliverable Locations
              </FormLabel>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {locationsFieldArray.fields.length} locations added
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => locationsFieldArray.append('')}
            className="bg-white dark:bg-gray-950 border-rose-300 hover:bg-rose-50 hover:border-rose-400"
          >
            <Plus className="mr-2 h-4 w-4 text-rose-600" /> Add Location
          </Button>
        </div>
        {locationsFieldArray.fields.length === 0 && (
          <p className="text-sm text-gray-700 dark:text-gray-300 italic flex items-center gap-2">
            <Info className="h-4 w-4" />
            Mention cities or regions where delivery is available.
          </p>
        )}
        <div className="space-y-3">
          {locationsFieldArray.fields.map((fieldItem: any, index: number) => (
            <div key={fieldItem.id} className="flex gap-2">
              <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-rose-500 text-white font-bold text-sm shadow-md">
                {index + 1}
              </div>
              <FormField
                control={form.control}
                name={`deliverableLocations.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between border-l-4 border-l-rose-500 bg-white dark:bg-gray-950 focus-visible:ring-rose-500',
                              !field.value && 'text-muted-foreground'
                            )}
                            type="button"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-rose-600" />
                              {field.value || 'Select city...'}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search city..." />
                            <CommandList>
                              <CommandEmpty>No city found.</CommandEmpty>
                              <CommandGroup>
                                {allCities.map((city) => (
                                  <CommandItem
                                    key={city}
                                    value={city}
                                    onSelect={() => {
                                      form.setValue(`deliverableLocations.${index}`, city);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === city ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {city}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-950"
                onClick={() => locationsFieldArray.remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <FormField
          control={form.control}
          name="eta"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-600" />
                Estimated Delivery Time
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="E.g. 3-5 business days"
                  className="border-l-4 border-l-cyan-500 bg-white dark:bg-gray-950"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Warranty & Replacement Section */}
      <div className="border-2 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gray-500 shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-600">Warranty & Replacement</h3>
            <p className="text-sm text-muted-foreground">Protect your customers with guarantees</p>
          </div>
          <Shield className="h-5 w-5 text-gray-500" />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isWarranty"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-400">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold">Warranty Available</FormLabel>
                    <p className="text-sm text-muted-foreground">Provide warranty protection</p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warrantyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  Warranty Details {watchIsWarranty ? '*' : ''}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    disabled={!watchIsWarranty}
                    placeholder="E.g. 1 year on manufacturing defects"
                    className="border-l-4 border-l-gray-500 focus:border-l-gray-600 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="h-px bg-gray-300 my-4" />

          <FormField
            control={form.control}
            name="isReplacement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-400">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <FormLabel className="text-base font-semibold">Replacement Available</FormLabel>
                    <p className="text-sm text-muted-foreground">Offer product replacement</p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="replacementDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Replacement Days {watchIsReplacement ? '*' : ''}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={!watchIsReplacement}
                    inputMode="numeric"
                    placeholder="E.g. 7"
                    className="border-l-4 border-l-gray-500 focus:border-l-gray-600 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
