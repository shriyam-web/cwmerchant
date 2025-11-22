'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Plus,
    Package,
    Store,
    TrendingUp,
    Pencil,
    Trash2,
    Layers,
    Upload,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMerchantAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";

const currencyFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

const offlineProductSchema = z
    .object({
        offlineProductId: z.string().optional(),
        productName: z.string().min(1, "Product name is required"),
        category: z.string().min(1, "Category is required"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        price: z
            .string()
            .min(1, "Price is required")
            .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, "Enter a valid price"),
        offerPrice: z
            .string()
            .optional()
            .refine(
                (value) => {
                    if (!value || value.trim().length === 0) {
                        return true;
                    }
                    return !Number.isNaN(Number(value)) && Number(value) >= 0;
                },
                { message: "Enter a valid offer price" }
            ),
        availableStock: z
            .string()
            .min(1, "Available stock is required")
            .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, "Enter a valid stock count"),
        unit: z.string().optional(),
        brand: z.string().optional(),
        tags: z.string().optional(),
        status: z.enum(["active", "inactive"]).default("active"),
    })
    .superRefine((values, ctx) => {
        if (!values.offerPrice || values.offerPrice.trim().length === 0) {
            return;
        }
        const priceValue = Number(values.price);
        const offerValue = Number(values.offerPrice);
        if (Number.isNaN(offerValue)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["offerPrice"], message: "Enter a valid offer price" });
            return;
        }
        if (offerValue > priceValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["offerPrice"], message: "Offer price cannot exceed price" });
        }
    });

type OfflineProductFormValues = z.infer<typeof offlineProductSchema>;

type OfflineProductRecord = {
    offlineProductId: string;
    merchantId: string;
    productName: string;
    category: string;
    description: string;
    price: number;
    offerPrice?: number;
    availableStock: number;
    unit?: string;
    brand?: string;
    tags?: string[];
    imageUrls?: string[];
    status: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
};

const getEmptyFormValues = (): OfflineProductFormValues => ({
    offlineProductId: "",
    productName: "",
    category: "",
    description: "",
    price: "",
    offerPrice: "",
    availableStock: "",
    unit: "",
    brand: "",
    tags: "",
    status: "active",
});

const parseListInput = (value?: string | null) => {
    if (!value) {
        return [] as string[];
    }
    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
};

export const OfflineProductsManagement = () => {
    const { merchant } = useMerchantAuth();
    const [products, setProducts] = useState<OfflineProductRecord[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<OfflineProductFormValues>({
        resolver: zodResolver(offlineProductSchema),
        defaultValues: useMemo(() => getEmptyFormValues(), []),
        mode: "onChange",
    });

    const totalProducts = products.length;
    const activeProducts = products.filter((product) => product.status === "active").length;
    const totalInventoryUnits = products.reduce((sum, product) => sum + (product.availableStock || 0), 0);
    const totalInventoryValue = products.reduce(
        (sum, product) => sum + (product.price || 0) * (product.availableStock || 0),
        0
    );

    const fetchProducts = async () => {
        if (!merchant?.merchantId) {
            return;
        }
        setLoadingProducts(true);
        try {
            const response = await fetch(`/api/merchant/offline-products?merchantId=${merchant.merchantId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch offline products");
            }
            const data = await response.json();
            setProducts(Array.isArray(data.products) ? data.products : []);
        } catch (error) {
            toast({ title: "Failed to load products", description: error instanceof Error ? error.message : "Try again later", variant: "destructive" });
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [merchant?.merchantId]);

    const resetForm = () => {
        form.reset(getEmptyFormValues());
        setEditingProductId(null);
        setImageUrls([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDialogChange = (open: boolean) => {
        setIsAddDialogOpen(open);
        if (!open) {
            resetForm();
        }
    };

    const handleEditProduct = (product: OfflineProductRecord) => {
        setEditingProductId(product.offlineProductId);
        setIsAddDialogOpen(true);
        setImageUrls(product.imageUrls || []);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        form.reset({
            offlineProductId: product.offlineProductId,
            productName: product.productName ?? "",
            category: product.category ?? "",
            description: product.description ?? "",
            price: product.price?.toString() ?? "",
            offerPrice: product.offerPrice?.toString() ?? "",
            availableStock: product.availableStock?.toString() ?? "",
            unit: product.unit ?? "",
            brand: product.brand ?? "",
            tags: (product.tags || []).join(", "),
            status: product.status ?? "active",
        });
    };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) {
            return;
        }

        const totalFiles = imageUrls.length + files.length;
        if (totalFiles > 5) {
            toast({ title: "Image limit reached", description: "You can upload up to 5 images", variant: "destructive" });
            return;
        }

        setUploadingImages(true);
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));
            const response = await fetch("/api/upload-product-images", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to upload images");
            }

            setImageUrls((prev) => [...prev, ...data.urls]);
            toast({ title: "Images uploaded", description: `${data.urls.length} image(s) added` });
        } catch (error) {
            toast({ title: "Image upload failed", description: error instanceof Error ? error.message : "Please try again later", variant: "destructive" });
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = form.handleSubmit(async (values) => {
        if (imageUrls.length === 0) {
            toast({ title: "Add at least one image", description: "Upload product images before saving", variant: "destructive" });
            return;
        }
        if (!merchant?.merchantId) {
            toast({ title: "Merchant information missing", description: "Please log in again", variant: "destructive" });
            return;
        }
        setSubmitting(true);
        try {
            const priceValue = Number(values.price);
            const stockValue = Number(values.availableStock);
            const offerValue = values.offerPrice && values.offerPrice.trim().length > 0 ? Number(values.offerPrice) : undefined;

            const payload = {
                productName: values.productName.trim(),
                category: values.category.trim(),
                description: values.description.trim(),
                price: priceValue,
                offerPrice: offerValue,
                availableStock: stockValue,
                unit: values.unit?.trim() ? values.unit.trim() : undefined,
                brand: values.brand?.trim() ? values.brand.trim() : undefined,
                tags: parseListInput(values.tags),
                imageUrls,
                status: values.status ?? "active",
            };

            const isEditing = Boolean(editingProductId);
            const response = await fetch("/api/merchant/offline-products", {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    isEditing
                        ? {
                            merchantId: merchant.merchantId,
                            offlineProductId: editingProductId,
                            productData: payload,
                        }
                        : {
                            merchantId: merchant.merchantId,
                            productData: payload,
                        }
                ),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || (isEditing ? "Failed to update product" : "Failed to add product"));
            }

            await fetchProducts();
            toast({
                title: isEditing ? "Offline product updated" : "Offline product added",
                description: isEditing ? "The product has been updated successfully" : "The product has been added successfully",
            });
            handleDialogChange(false);
            setImageUrls([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast({ title: "Something went wrong", description: error instanceof Error ? error.message : "Please try again later", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    });

    const handleDeleteProduct = async (productId: string) => {
        if (!merchant?.merchantId) {
            return;
        }
        setDeletingId(productId);
        try {
            const response = await fetch(`/api/merchant/offline-products?merchantId=${merchant.merchantId}&offlineProductId=${productId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to delete product");
            }
            await fetchProducts();
            toast({ title: "Product deleted", description: "The offline product has been removed" });
        } catch (error) {
            toast({ title: "Deletion failed", description: error instanceof Error ? error.message : "Please try again later", variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div id="tour-offline-products" className="space-y-8 overflow-x-hidden">
            {/* Your Offline Store Section */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 dark:from-orange-950/30 via-white dark:via-gray-950 to-red-50 dark:to-red-950/30 shadow-lg dark:shadow-gray-900/50 overflow-hidden w-full relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-300/20 dark:bg-orange-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-red-300/20 dark:bg-red-400/10 rounded-full blur-3xl" />
                </div>
                <CardHeader className="relative pb-6 overflow-hidden">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg flex-shrink-0">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Offline Store</h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
                                    Products you add here appear on your merchant profile page and are available for customers to view and order directly from your store.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={handleDialogChange}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex-shrink-0 whitespace-nowrap">
                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Add Product</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 dark:text-white">
                                        <Package className="h-5 w-5" />
                                        {editingProductId ? "Edit Offline Product" : "Add Offline Product"}
                                    </DialogTitle>
                                </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="productName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Product Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter product name" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Category</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Product category" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="brand"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Brand</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Brand name" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Unit</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Pieces, Kg, etc." className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="dark:text-white">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={4} placeholder="Describe the product" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="offerPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Offer Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optional" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="availableStock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Available Stock</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="tags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Tags</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={3} placeholder="Comma separated tags" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="dark:text-white">Status</FormLabel>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="rounded-lg border border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">Product Images</h4>
                                                    <p className="text-xs text-orange-600 dark:text-orange-400">Upload up to 5 images (max 5MB each)</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploadingImages || imageUrls.length >= 5}
                                                    className="gap-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                >
                                                    {uploadingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                    {uploadingImages ? "Uploading..." : "Upload Images"}
                                                </Button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                            {imageUrls.length === 0 ? (
                                                <p className="text-xs text-orange-700 dark:text-orange-400">No images uploaded yet.</p>
                                            ) : (
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {imageUrls.map((url, index) => (
                                                        <div key={url} className="flex items-center gap-3 rounded-md border border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-700 p-2 shadow-sm">
                                                            <img src={url} alt={`Product ${index + 1}`} className="h-16 w-16 rounded-md object-cover" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-800 dark:text-white">Image {index + 1}</p>
                                                                {index === 0 && <p className="text-xs text-orange-500 dark:text-orange-400">Cover Image</p>}
                                                            </div>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="text-red-500 dark:text-red-400 hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={submitting} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={submitting}>
                                                {submitting ? (editingProductId ? "Updating..." : "Saving...") : editingProductId ? "Update Product" : "Add Product"}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="relative space-y-6 overflow-x-hidden">
                    {/* How It Works - Process Flow */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            How Your Products Go Live
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { step: "1", title: "Add Product", desc: "Create detailed product listing with images, prices & stock" },
                                { step: "2", title: "Profile Display", desc: "Product appears on your merchant profile page instantly" },
                                { step: "3", title: "Customer Access", desc: "Customers can discover and view your products" },
                                { step: "4", title: "Order & Manage", desc: "Receive and manage orders directly from your dashboard" }
                            ].map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-800 bg-white/80 dark:bg-gray-800/50 backdrop-blur">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                                                {item.step}
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                    {idx < 3 && (
                                        <div className="hidden lg:flex absolute -right-1.5 top-6 translate-x-full items-center">
                                            <div className="w-3 h-0.5 bg-gradient-to-r from-orange-400 to-red-400" />
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Storage Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="group relative p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-orange-100/50 dark:from-orange-900/20 to-transparent rounded-xl transition-opacity" />
                            <div className="relative flex items-center gap-3 mb-1">
                                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                <p className="text-xs uppercase font-semibold text-orange-600 dark:text-orange-400">Total Products</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white ml-8">{totalProducts}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">In your catalog</p>
                        </div>
                        <div className="group relative p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-100/50 dark:from-green-900/20 to-transparent rounded-xl transition-opacity" />
                            <div className="relative flex items-center gap-3 mb-1">
                                <Store className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <p className="text-xs uppercase font-semibold text-green-600 dark:text-green-400">Active Listings</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white ml-8">{activeProducts}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">Live & selling</p>
                        </div>
                        <div className="group relative p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur hover:shadow-lg transition-all duration-200">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-100/50 dark:from-purple-900/20 to-transparent rounded-xl transition-opacity" />
                            <div className="relative flex items-center gap-3 mb-1">
                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                <p className="text-xs uppercase font-semibold text-purple-600 dark:text-purple-400">Inventory Value</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white ml-8">{currencyFormatter.format(totalInventoryValue)}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">{totalInventoryUnits} units</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products List Section */}
            <Card className="border-0 bg-white dark:bg-gray-950 shadow-lg dark:shadow-gray-900/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-orange-100 dark:from-orange-900/40 to-orange-50 dark:to-orange-900/20 rounded-lg">
                                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Product Inventory</CardTitle>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage all your offline store products</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 text-xs sm:text-sm">
                            {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingProducts ? (
                        <div className="py-12 text-center text-sm text-gray-600 dark:text-gray-400">Loading offline products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-2xl dark:border-gray-700">
                            <p className="text-lg font-semibold text-muted-foreground dark:text-gray-300">No offline products added yet.</p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">Use the button above to create your first offline product.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => {
                                const statusStyles = product.status === "active"
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600";
                                return (
                                    <div
                                        key={product.offlineProductId}
                                        className="rounded-xl border border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {product.productName}
                                                    </h3>
                                                    <Badge className={statusStyles}>{product.status}</Badge>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{product.category}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{product.description}</div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
                                                    <span>
                                                        Price: {currencyFormatter.format(product.price)}
                                                    </span>
                                                    {typeof product.offerPrice === "number" && (
                                                        <span>
                                                            Offer: {currencyFormatter.format(product.offerPrice)}
                                                        </span>
                                                    )}
                                                    <span>Stock: {product.availableStock}</span>
                                                    {product.unit && <span>Unit: {product.unit}</span>}
                                                    {product.brand && <span>Brand: {product.brand}</span>}
                                                </div>
                                                {product.tags && product.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteProduct(product.offlineProductId)}
                                                    disabled={deletingId === product.offlineProductId}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    {deletingId === product.offlineProductId ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
