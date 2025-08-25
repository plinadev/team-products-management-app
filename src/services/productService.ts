import apiClient from "@/lib/apiClient";

export interface CreateProductInput {
  title: string;
  description?: string | null;
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
