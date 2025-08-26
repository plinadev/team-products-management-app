import type { Member } from "./team.type";

export type Product = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: "draft" | "active" | "deleted";
  created_at: string;
  updated_at: string;
  author: Member;
};

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
export interface UpdateProductStatusInput {
  id: string;
  status: "active" | "deleted";
}

export interface ListProductsParams {
  page?: number;
  pageSize?: number;
  status?: "active" | "deleted";
  created_by?: string;
  created_from?: string;
  created_to?: string;
  search?: string;
}

export interface ListProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}
