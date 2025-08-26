import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/services/productService";
import type { ListProductsResponse } from "@/types/product.type";

export const useProducts = () => {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 5;
  const status =
    (searchParams.get("status") as "active" | "deleted" | null) || undefined;
  const created_by = searchParams.get("created_by") ?? undefined;
  const created_from = searchParams.get("created_from") || undefined;
  const created_to = searchParams.get("created_to") || undefined;

  const query = useQuery<ListProductsResponse>({
    queryKey: [
      "products",
      search,
      page,
      pageSize,
      status,
      created_by,
      created_from,
      created_to,
    ],
    queryFn: () =>
      listProducts({
        search,
        page,
        pageSize,
        status,
        created_by,
        created_from,
        created_to,
      }),
  });

  return {
    products: query.data?.products ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pageSize: query.data?.pageSize ?? pageSize,
    isFetching: query.isFetching,
    error: query.error,
  };
};
