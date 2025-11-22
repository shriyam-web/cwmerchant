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
      <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-500">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <FormLabel className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Product Images *
              </FormLabel>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {imagesFieldArray.fields.length} of 5 images
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('image-upload-input')?.click()}
              disabled={uploadingImages || imagesFieldArray.fields.length >= 5}
              className="bg-white dark:bg-gray-950 border-gray-300 hover:bg-gray-50 hover:border-gray-400 group"
            >
              {uploadingImages ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-600" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4 text-gray-600" /> Upload Images
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
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Upload between 1 to 5 images (max 5MB each). The first image becomes the cover photo.
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
                      <div className="flex gap-3 items-center bg-white dark:bg-gray-950 rounded-lg p-2 border-2 border-gray-200 dark:border-gray-800 group-hover:border-gray-400">
                        {field.value && (
                          <div className="relative">
                            <img
                              src={field.value}
                              alt={`Product ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                            />
                            {index === 0 && (
                              <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-lg">
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
                            className="border-l-4 border-l-purple-500 bg-gray-50 dark:bg-gray-900"
                          />
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 ml-1">
                            Image {index + 1} {index === 0 && '(Cover Photo)'}
                          </p>
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
                className="hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-950 mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Product Highlights Section */}
      <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-500">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <FormLabel className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Product Highlights *
              </FormLabel>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {highlightsFieldArray.fields.length} of 10 highlights
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => highlightsFieldArray.append('')}
            disabled={highlightsFieldArray.fields.length >= 10}
            className="bg-white dark:bg-gray-950 border-gray-300 hover:bg-gray-50 hover:border-gray-400 group"
          >
            <Plus className="mr-2 h-4 w-4 text-gray-600" /> Add Highlight
          </Button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Mention the standout features or benefits customers should know.
        </p>
        <div className="space-y-3">
          {highlightsFieldArray.fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="flex gap-2 group">
              <div className="flex items-center justifycenter w-8 h-10 rounded-lg bg-gray-400 text-white font-bold text-sm shadow-md">
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
                        placeholder="E.g. 120Hz AMOLED display"
                        className="border-l-4 border-l-gray-500 bg-white dark:bg-gray-950 focus:border-l-gray-600"
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
                className="hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-950"
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
