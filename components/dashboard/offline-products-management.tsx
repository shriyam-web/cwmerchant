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
        if (!merchant?.id) {
            return;
        }
        setLoadingProducts(true);
        try {
            const response = await fetch(`/api/merchant/offline-products?merchantId=${merchant.id}`);
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
    }, [merchant?.id]);

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
        if (!merchant?.id) {
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
                              merchantId: merchant.id,
                              offlineProductId: editingProductId,
                              productData: payload,
                          }
                        : {
                              merchantId: merchant.id,
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
        if (!merchant?.id) {
            return;
        }
        setDeletingId(productId);
        try {
            const response = await fetch(`/api/merchant/offline-products?merchantId=${merchant.id}&offlineProductId=${productId}`, {
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
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <Store className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Offline Store Products</h1>
                            <p className="text-orange-100 text-lg mt-1">Manage products available at your physical locations</p>
                        </div>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={handleDialogChange}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-orange-600 hover:bg-orange-50 gap-2 px-6 py-3 text-lg font-semibold shadow-lg">
                                <Plus className="h-5 w-5" />
                                {editingProductId ? "Update Offline Product" : "Add Offline Product"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
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
                                                    <FormLabel>Product Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter product name" {...field} />
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
                                                    <FormLabel>Category</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Product category" {...field} />
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
                                                    <FormLabel>Brand</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Brand name" {...field} />
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
                                                    <FormLabel>Unit</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Pieces, Kg, etc." {...field} />
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
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={4} placeholder="Describe the product" {...field} />
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
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" {...field} />
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
                                                    <FormLabel>Offer Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optional" {...field} />
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
                                                    <FormLabel>Available Stock</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" {...field} />
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
                                                    <FormLabel>Tags</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={3} placeholder="Comma separated tags" {...field} />
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
                                                    <FormLabel>Status</FormLabel>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
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
                                        <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50/40 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-orange-800">Product Images</h4>
                                                    <p className="text-xs text-orange-600">Upload up to 5 images (max 5MB each)</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploadingImages || imageUrls.length >= 5}
                                                    className="gap-2"
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
                                                <p className="text-xs text-orange-700">No images uploaded yet.</p>
                                            ) : (
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {imageUrls.map((url, index) => (
                                                        <div key={url} className="flex items-center gap-3 rounded-md border border-orange-200 bg-white p-2 shadow-sm">
                                                            <img src={url} alt={`Product ${index + 1}`} className="h-16 w-16 rounded-md object-cover" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-800">Image {index + 1}</p>
                                                                {index === 0 && <p className="text-xs text-orange-500">Cover Image</p>}
                                                            </div>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="text-red-500 hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={submitting}>
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
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-800">Total Offline Products</CardTitle>
                        <Package className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-900">{totalProducts}</div>
                        <p className="text-xs text-orange-600">Products in your offline catalog</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800">Active Listings</CardTitle>
                        <Store className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{activeProducts}</div>
                        <p className="text-xs text-blue-600">Currently available offline</p>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Inventory Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">{currencyFormatter.format(totalInventoryValue)}</div>
                        <p className="text-xs text-green-600">{totalInventoryUnits} total units</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 border-dashed border-orange-200 bg-orange-50/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Layers className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-gray-900">Offline Store Inventory</CardTitle>
                                <p className="text-sm text-gray-600">Manage products available at your physical locations</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                            {totalProducts} products
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingProducts ? (
                        <div className="py-12 text-center text-sm text-gray-600">Loading offline products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                            <p className="text-lg font-semibold text-muted-foreground">No offline products added yet.</p>
                            <p className="text-sm text-muted-foreground">Use the button above to create your first offline product.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => {
                                const statusStyles = product.status === "active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-200 text-gray-700 border-gray-300";
                                return (
                                    <div
                                        key={product.offlineProductId}
                                        className="rounded-xl border border-orange-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {product.productName}
                                                    </h3>
                                                    <Badge className={statusStyles}>{product.status}</Badge>
                                                </div>
                                                <div className="text-sm text-gray-600">{product.category}</div>
                                                <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
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
                                                            <Badge key={tag} variant="secondary" className="text-xs">
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
