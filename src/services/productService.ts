import apiClient from "@/lib/apiClient";
import type {
  CreateProductInput,
  ListProductsParams,
  ListProductsResponse,
  Product,
  UpdateProductInput,
  UpdateProductStatusInput,
} from "@/types/product.type";

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
    console.error("Failed to update product:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const updateProductStatus = async (
  payload: UpdateProductStatusInput
) => {
  try {
    const response = await apiClient.post("/update-product-status", payload);
    return response.data.product as Product;
  } catch (error: any) {
    console.error("Failed to update product status:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const listProducts = async (params: ListProductsParams = {}) => {
  try {
    const response = await apiClient.get<ListProductsResponse>(
      "/list-products",
      {
        params,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch products:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};
