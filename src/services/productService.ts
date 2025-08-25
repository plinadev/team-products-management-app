import apiClient from "@/lib/apiClient";
import type { Product } from "@/types/product.type";

export interface CreateProductInput {
  title: string;
  description?: string | null;
  image_url?: string | null;
}
export interface UpdateProductInput {
  id: string;
  title?: string;
  description?: string;
  image_url?: string | null;
}
export const createProduct = async (payload: CreateProductInput) => {
  try {
    const response = await apiClient.post("/create-product", payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await apiClient.post("/get-product", { id });
    return response.data.product as Product;
  } catch (error: any) {
    console.error("Failed to get product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const updateProduct = async (payload: UpdateProductInput) => {
  try {
    const response = await apiClient.post("/update-product", payload);
    return response.data.product as Product;
  } catch (error: any) {
    console.error("Failed to create product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};
