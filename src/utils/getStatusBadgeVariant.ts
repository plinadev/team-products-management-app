import type { ProductStatus } from "@/types/product.type";

export default function getStatusBadgeVariant(status: ProductStatus) {
  switch (status) {
    case "draft":
      return "secondary";
    case "active":
      return "default";
    case "deleted":
      return "destructive";
    default:
      return "secondary";
  }
}
