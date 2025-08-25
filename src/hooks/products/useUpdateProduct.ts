import { updateProduct as updateProductApi } from "@/services/productService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: updateProductApi,
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(["product", updatedProduct.id], updatedProduct);
      toast.success("Product was successfully created!");
    },
    onError: () => {
      toast.error(
        "Something went wrong while updating a product! Try again later"
      );
    },
  });

  return { updateProduct, isUpdating };
};
