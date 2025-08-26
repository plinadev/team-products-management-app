import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  X,
} from "lucide-react";
import { useProducts } from "@/hooks/products/useProducts";
import ProductsSkeleton from "@/components/ProductsSkeleton";
import productPlaceholder from "@/assets/product-placeholder.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Product } from "@/types/product.type";
import { useTeam } from "@/hooks/team/useTeam";
import getStatusBadgeVariant from "@/utils/getStatusBadgeVariant";
import getStatusIcon from "@/utils/getStatusIcon";

function Products() {
  const { products, total, page, pageSize, isFetching } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;

  const { team } = useTeam();
  const uniqueAuthors = useMemo(() => {
    if (!team?.members) return [];
    const authorMap = new Map();
    team?.members.forEach((member) => {
      const key = member.id;
      if (!authorMap.has(key)) {
        authorMap.set(key, {
          id: member.id,
          name: `${member.first_name} ${member.last_name}`,
          role: member.role,
        });
      }
    });
    return Array.from(authorMap.values());
  }, [team?.members]);

  const handleFilterChange = (key: string) => (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAuthorFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);

    const params = new URLSearchParams();
    params.set("page", "1");
    setSearchParams(params);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    authorFilter !== "all" ||
    dateFromFilter ||
    dateToFilter;

  return (
    <div className="lg:w-[60%] w-[90%] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all your products ({total}{" "}
            {total === 1 ? "product" : "products"})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  handleFilterChange("search")(searchTerm);
                }
              }}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  handleFilterChange("status")(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Created By</Label>
              <Select
                value={authorFilter}
                onValueChange={(value) => {
                  setAuthorFilter(value);
                  handleFilterChange("created_by")(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name} ({author.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Created From</Label>
              <Input
                type="date"
                value={dateFromFilter}
                onChange={(e) => {
                  setDateFromFilter(e.target.value);
                  handleFilterChange("created_from")(e.target.value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Created To</Label>
              <Input
                type="date"
                value={dateToFilter}
                onChange={(e) => {
                  setDateToFilter(e.target.value);
                  handleFilterChange("created_to")(e.target.value);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {isFetching ? (
        <ProductsSkeleton />
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {total === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No products found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      products.map((product: Product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <img
                              src={product.image_url || productPlaceholder}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-md border"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {product.title}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                                {product.description}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {product.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant={getStatusBadgeVariant(product.status)}
                              className="flex items-center space-x-1 w-fit"
                            >
                              {getStatusIcon(product.status)}
                              <span className="capitalize">
                                {product.status}
                              </span>
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <div>
                                <p className="text-sm font-medium">
                                  {product.author.first_name}{" "}
                                  {product.author.last_name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {product.author.role}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(product.created_at)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(product.updated_at)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProduct(product.id)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + pageSize, total)} of {total} products
              </div>
              <div className="flex items-center space-x-2">
                {/* Previous */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = Math.max(currentPage - 1, 1);
                    setCurrentPage(newPage);
                    handlePageChange(newPage);
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          handlePageChange(pageNum);
                        }}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                {/* Next */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = Math.min(currentPage + 1, totalPages);
                    setCurrentPage(newPage);
                    handlePageChange(newPage);
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
