import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import Image from "next/image";
import { getTokenCookie } from "@/app/utilities/token";

export interface Product {
  categoryName: string;
  productName: string;
  productDescription: string;
  variants: {
    productVariantName: string;
    productPrice: number;
    productStock: number;
    sku: string;
  }[]; // Updated to match new structure
  productImage: File[]; // Updated to match new structure
}

const CreateProductModal = ({
  isOpen,
  onClose,
  reload,
}: {
  isOpen: boolean;
  onClose: () => void;
  reload: () => void;
}) => {
  const [product, setProduct] = useState<Product>({
    categoryName: "",
    productName: "",
    productDescription: "",
    variants: [],
    productImage: [],
  });

  const [newVariant, setNewVariant] = useState({
    productVariantName: "",
    productPrice: 0,
    productStock: 0,
    sku: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        productImage: [...prevProduct.productImage, ...Array.from(files)],
      }));
    }
  };

  const handleAddVariant = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: [...prevProduct.variants, newVariant],
    }));
    setNewVariant({
      productVariantName: "",
      productPrice: 0,
      productStock: 0,
      sku: "",
    });
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVariant((prevVariant) => ({
      ...prevVariant,
      [name]:
        name === "productPrice" || name === "productStock"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateProduct = async () => {
    try {

      const token = getTokenCookie();

      if (!token) {
        throw new Error("You are not authorized");
      }

      const formData = new FormData();

      formData.append("productCategoryName", product.categoryName);
      formData.append("productName", product.productName);
      formData.append("productDescription", product.productDescription);

      formData.append("productVariants", JSON.stringify(product.variants));

      product.productImage.forEach((file) =>
        formData.append("productImage", file)
      );

      const response = await fetch(`${process.env.PRODUCTS}`, {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toastSuccess("Product updated successfully!");
      reload();
      onClose();
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-black">
          Create New Product
        </ModalHeader>
        <ModalBody className="text-black">
          <Input
            label="Category Name"
            size="lg"
            placeholder="Enter category name"
            name="categoryName"
            value={product.categoryName}
            onChange={handleInputChange}
            className="mt-4 w-full"
          />
          <Input
            label="Product Name"
            size="lg"
            placeholder="Enter product name"
            name="productName"
            value={product.productName}
            onChange={handleInputChange}
            className="mt-4 w-full"
          />
          <Textarea
            label="Product Description"
            size="lg"
            placeholder="Enter product description"
            name="productDescription"
            value={product.productDescription}
            onChange={handleInputChange}
            className="mt-4 w-full"
          />

          <h3 className="mt-6 text-black">Product Variants</h3>
          <div className="flex gap-3 mt-4">
            <Input
              label="Variant Name"
              size="lg"
              placeholder="Variant Name"
              name="productVariantName"
              value={newVariant.productVariantName}
              onChange={handleVariantChange}
              className="w-full"
            />
            <Input
              label="Price"
              size="lg"
              type="number"
              placeholder="Price"
              name="productPrice"
              onChange={handleVariantChange}
              className="w-full"
            />
            <Input
              label="Stock"
              size="lg"
              type="number"
              placeholder="Stock"
              name="productStock"
              onChange={handleVariantChange}
              className="w-full"
            />
            <Input
              label="SKU"
              size="lg"
              placeholder="SKU"
              name="sku"
              value={newVariant.sku}
              onChange={handleVariantChange}
              className="w-full"
            />
            <Button color="primary" onPress={handleAddVariant}>
              Add Variant
            </Button>
          </div>

          <div className="mt-6">
            <h4 className="text-black">Added Variants:</h4>
            {product.variants.length > 0 ? (
              <ul className="mt-2">
                {product.variants.map((variant, index) => (
                  <li key={index} className="text-black">
                    <strong>Variant Name:</strong> {variant.productVariantName}{" "}
                    | <strong>Price:</strong> ${variant.productPrice} |{" "}
                    <strong>Stock:</strong> {variant.productStock} |{" "}
                    <strong>SKU:</strong> {variant.sku}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No variants added yet.</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-black mb-2">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-6">
            <h4 className="text-black">Uploaded Images:</h4>
            {product.productImage.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-2">
                {product.productImage.map((file, index) => (
                  <div key={index} className="text-black">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Product ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md shadow-md"
                      width={100}
                      height={100}
                    />
                    <p className="text-sm">{file.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black">No images uploaded yet.</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleCreateProduct}>
            Create Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;
