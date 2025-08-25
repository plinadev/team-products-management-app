import { createProduct as createProductApi } from "@/services/productService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreateProduct = () => {
  const navigate = useNavigate();

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: createProductApi,
    onSuccess: (response) => {
      const createdProductId = response.product.id;
      toast.success("Product was successfully created!");
      navigate(`/products/${createdProductId}`);
    },
    onError: () => {
      toast.error(
        "Something went wrong while creating a product! Try again later"
      );
    },
  });

  return { createProduct, isCreating };
};
