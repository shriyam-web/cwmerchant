import { ReactNode } from 'react';
import {
  Image as ImageIcon,
  Star,
  Info,
  Loader2,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ProductsFormContextType } from './StepsContext';
import { StepWrapper } from './StepLayouts';

export type StepRendererProps = {
  context: ProductsFormContextType;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};

export const StepMedia = ({ context, handleImageUpload }: StepRendererProps) => {
  const {
    form,
    uploadingImages,
    fieldArrays,
  } = context;
  const imagesFieldArray = fieldArrays.productImages;
  const highlightsFieldArray = fieldArrays.productHighlights;

  return (
    <div className="space-y-8">
      {/* Product Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Product Images
              <span className="text-red-600 ml-1">*</span>
            </FormLabel>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {imagesFieldArray.fields.length} of 5 images
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-upload-input')?.click()}
            disabled={uploadingImages || imagesFieldArray.fields.length >= 5}
            className="bg-white dark:bg-gray-900/50 border-purple-200 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-950/20"
          >
            {uploadingImages ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload Images
              </>
            )}
          </Button>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploadingImages || imagesFieldArray.fields.length >= 5}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Upload 1-5 images (max 5MB each). The first image becomes the cover photo.
        </p>
        <div className="space-y-3">
          {imagesFieldArray.fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="flex gap-2 items-start group">
              <FormField
                control={form.control}
                name={`productImages.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="flex gap-3 items-center bg-white dark:bg-gray-900/50 rounded-lg p-2 border border-purple-200 dark:border-purple-900">
                        {field.value && (
                          <div className="relative">
                            <img
                              src={field.value}
                              alt={`Product ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                Cover
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            {...field}
                            placeholder="Image URL"
                            disabled
                            className="bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => imagesFieldArray.remove(index)}
                disabled={imagesFieldArray.fields.length === 1}
                className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 mt-2 h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Highlights Section */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Product Highlights
              <span className="text-red-600 ml-1">*</span>
            </FormLabel>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {highlightsFieldArray.fields.length} of 10 highlights
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => highlightsFieldArray.append('')}
            disabled={highlightsFieldArray.fields.length >= 10}
            className="bg-white dark:bg-gray-900/50 border-purple-200 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-950/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Mention standout features or benefits customers should know.
        </p>
        <div className="space-y-2">
          {highlightsFieldArray.fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="flex gap-2 group">
              <div className="flex items-center justify-center w-8 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <FormField
                control={form.control}
                name={`productHighlights.${index}` as const}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E.g., 120Hz AMOLED display"
                        className="h-10 bg-white dark:bg-gray-900/50 border-purple-200 dark:border-purple-900 focus-visible:ring-purple-500"
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
                onClick={() => highlightsFieldArray.remove(index)}
                disabled={highlightsFieldArray.fields.length === 1}
                className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
