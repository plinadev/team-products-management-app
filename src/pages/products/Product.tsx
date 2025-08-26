import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Save,
  X,
  Calendar,
  User,
  CheckCircle,
  Trash2,
  AlertCircle,
  Camera,
  Upload,
} from "lucide-react";
import { useProduct } from "@/hooks/products/useProduct";
import ProductSkeleton from "@/components/ProductSkeleton";
import productPlaceholder from "@/assets/product-placeholder.svg";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import uploadImageToStore from "@/utils/uploadImageToStore";
import { deleteImageFromStore } from "@/utils/deleteImageFromStorage";
import { useUpdateProductStatus } from "@/hooks/products/useUpdateProductStatus";
import type { ProductStatus } from "@/types/product.type";
import getStatusBadgeVariant from "@/utils/getStatusBadgeVariant";
import getStatusIcon from "@/utils/getStatusIcon";

function Product() {
  const { product, isFetching, error } = useProduct();
  const { updateProduct, isUpdating } = useUpdateProduct();
  const { updateProductStatus, isUpdatingStatus } = useUpdateProductStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleEditStart = () => {
    if (!product) return;
    setEditData({
      title: product.title,
      description: product.description,
      image: null,
    });
    setImagePreview(null);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({ title: "", description: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setEditData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!product) return;

    let imageUrl: string | null = null;

    if (editData.image) {
      if (product.image_url) {
        await deleteImageFromStore(product.image_url);
      }

      imageUrl = await uploadImageToStore(editData.image);
      if (!imageUrl) return;
    }

    const updatedProduct = {
      id: product.id,
      title: editData.title,
      description: editData.description,
      image_url: imageUrl ?? product.image_url,
    };
    updateProduct(updatedProduct, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleStatusUpdate = (newStatus: "active" | "deleted") => {
    if (product) updateProductStatus({ id: product.id, status: newStatus });
  };

  if (isFetching) return <ProductSkeleton />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200">
          <CardContent>
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>
                Error loading product:{" "}
                {(error as any)?.response?.data?.error ||
                  "Something went wrong"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center">
            <p className="text-stone-500 text-xl">404 Product not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusTransitions = getAvailableStatusTransitions(product.status);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Badge
              variant={getStatusBadgeVariant(product.status)}
              className="flex items-center space-x-1 text-sm"
            >
              {getStatusIcon(product.status)}
              <span className="capitalize">{product.status}</span>
            </Badge>
            <span className="text-sm text-stone-500">ID: {product.id}</span>
          </div>
        </div>
        {product.status === "draft" && !isEditing && (
          <Button
            onClick={handleEditStart}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <Label>Product Image</Label>
                  <div className="relative">
                    <img
                      src={
                        imagePreview || product.image_url || productPlaceholder
                      }
                      alt={product.title}
                      className="w-full h-64 md:h-80 object-cover rounded-lg border"
                    />
                    {imagePreview && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          New Image
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <div className="relative flex-1">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center px-4 py-2 border border-stone-300 rounded-md cursor-pointer hover:bg-stone-50 transition-colors w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose New Image
                      </label>
                    </div>
                    {imagePreview && (
                      <Button
                        onClick={removeNewImage}
                        variant="outline"
                        className="self-center px-4 py-5"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  {editData.image && (
                    <p className="text-sm text-gray-600">
                      Selected: {editData.image.name}
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={product.image_url || productPlaceholder}
                    alt={product.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg border"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white border-0"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Product Image
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    name="title"
                    value={editData.title}
                    onChange={handleInputChange}
                    className="text-lg font-semibold"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {product.title}
                  </h1>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    name="description"
                    value={editData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={
                      isUpdating ||
                      !editData.title.trim() ||
                      !editData.description.trim()
                    }
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleEditCancel}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {statusTransitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {statusTransitions.map(({ status, label, icon: Icon }) => (
                <Button
                  key={status}
                  onClick={() =>
                    handleStatusUpdate(status as "active" | "deleted")
                  }
                  disabled={isUpdatingStatus}
                  variant={status === "deleted" ? "destructive" : "default"}
                  size="sm"
                  className="cursor-pointer"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-stone-500">Author</p>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {product.author.first_name} {product.author.last_name}
              </span>
              <Badge variant="outline" className="text-xs">
                {product.author.role}
              </Badge>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <DateItem label="Created" date={product.created_at} />
            <DateItem label="Last Updated" date={product.updated_at} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DateItem({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">{formatDate(date)}</p>
      </div>
    </div>
  );
}

const getAvailableStatusTransitions = (current: ProductStatus) => {
  switch (current) {
    case "draft":
      return [
        { status: "active", label: "Activate Product", icon: CheckCircle },
        { status: "deleted", label: "Delete Product", icon: Trash2 },
      ];
    case "active":
      return [{ status: "deleted", label: "Delete Product", icon: Trash2 }];
    default:
      return [];
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default Product;
