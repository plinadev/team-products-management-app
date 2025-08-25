import { updateProductStatus as updateProductStatusApi } from "@/services/productService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  const { mutate: updateProductStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: updateProductStatusApi,
      onSuccess: (updatedProduct) => {
        queryClient.setQueryData(
          ["product", updatedProduct.id],
          updatedProduct
        );
        toast.success("Status was successfully updated!");
      },
      onError: () => {
        toast.error(
          "Something went wrong while updating status! Try again later"
        );
      },
    });

  return { updateProductStatus, isUpdatingStatus };
};
