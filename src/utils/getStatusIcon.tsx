import type { ProductStatus } from "@/types/product.type";
import { CheckCircle, FileText, Trash2 } from "lucide-react";

export default function getStatusIcon(status: ProductStatus) {
  switch (status) {
    case "draft":
      return <FileText className="h-3 w-3" />;
    case "active":
      return <CheckCircle className="h-3 w-3" />;
    case "deleted":
      return <Trash2 className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
}
