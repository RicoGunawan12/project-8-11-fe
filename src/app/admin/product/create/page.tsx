"use client";
import { CreateProductResponse, ProductVariant } from "@/app/model/product";
import Image from "next/image";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import AdminNavigation from "../../component/adminNavbar";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { useRouter } from "next/navigation";
import { Categories } from "@/app/model/category";

const CreateProduct: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategoryName, setProductCategoryName] = useState<string>("");
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      productSize: "",
      productColor: "",
      productPrice: "",
      productStock: "",
      productWeight: "",
      sku: "",
    },
  ]);
  const [images, setImages] = useState<Record<string, File>>({});
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<Categories[]>();

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getTokenCookie();

        if (!token) {
          throw new Error("You are not authorized");
        }

        const response = await fetch(`${process.env.CATEGORIES}?search=` + "", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
        setCategories(data);

        toastSuccess(data.message);
      } catch (error: any) {
        toastError(error.message || "Something went wrong");
      }
    };

    fetchCategories();
  }, []);

  const handleAddVariant = (): void => {
    setVariants([
      ...variants,
      {
        productSize: "",
        productColor: "",
        productPrice: "",
        productStock: "",
        productWeight: "",
        sku: "",
      },
    ]);
  };

  const handleRemoveVariant = (index: number): void => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);

    const imageName = `${productName} - ${variants[index].productSize} - ${variants[index].productColor}`;
    const newImages = { ...images };
    const newPreviews = { ...imagePreview };
    delete newImages[imageName];
    delete newPreviews[imageName];
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string
  ): void => {
    const newVariants = [...variants];
    const oldVariant = newVariants[index];
    newVariants[index][field] = value;
    setVariants(newVariants);

    if (field === "productSize" || field === "productColor") {
      const oldKey = `${productName} - ${oldVariant.productSize} - ${oldVariant.productColor}`;
      const newKey = `${productName} - ${
        field === "productSize" ? value : oldVariant.productSize
      } - ${field === "productColor" ? value : oldVariant.productColor}`;

      if (images[oldKey]) {
        const newImages = { ...images };
        const newPreviews = { ...imagePreview };
        newImages[newKey] = newImages[oldKey];
        newPreviews[newKey] = newPreviews[oldKey];
        delete newImages[oldKey];
        delete newPreviews[oldKey];
        setImages(newImages);
        setImagePreview(newPreviews);
      }
    }
  };

  const handleImageUpload = (index: number, file: File | undefined): void => {
    if (!file) return;

    const imageName = `${productName} - ${variants[index].productSize} - ${variants[index].productColor}`;

    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => ({
      ...prev,
      [imageName]: file,
    }));

    setImagePreview((prev) => ({
      ...prev,
      [imageName]: previewUrl,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getTokenCookie();

      if (!token) {
        throw new Error("You are not authorized");
      }

      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("productCategoryName", productCategoryName);
      formData.append("productVariants", JSON.stringify(variants));

      Object.entries(images).forEach(([key, file]) => {
        const [productName, productSize, productColor] = key.split(" - ");
        const extension = file.name.split(".").pop();
        const newFileName = `${productName} - ${productSize} - ${productColor}.${extension}`;
        const renamedFile = new File([file], newFileName, { type: file.type });

        formData.append("productImage", renamedFile);
      });

      formData.append("defaultImage", images[Object.keys(images)[0]]);

      console.log(formData);

      const response = await fetch(`${process.env.PRODUCTS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data: CreateProductResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }
      setProductName("");
      setProductDescription("");
      setProductCategoryName("");
      setVariants([
        {
          productSize: "",
          productColor: "",
          productPrice: "",
          productStock: "",
          productWeight: "",
          sku: "",
        },
      ]);
      setImages({});
      Object.values(imagePreview).forEach((url) => URL.revokeObjectURL(url));
      setImagePreview({});
      toastSuccess(data.message);
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(imagePreview).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  return (
    <div className="w-screen h-screen bg-white flex justify-around items-center p-6">
      <AdminNavigation />
      <div className="w-9/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 flex justify-between">
          Create New Product
          <div
            className="cursor-pointer"
            onClick={() => {
              router.push("/admin/product");
            }}
          >
            X
          </div>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setProductName(e.target.value)
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={productDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setProductDescription(e.target.value)
                }
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={productCategoryName}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setProductCategoryName(e.target.value)
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories?.map((category, index) => (
                  <option key={index} value={category.productCategoryName}>
                    {category.productCategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Product Variants</h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Variant
              </button>
            </div>

            {variants.map((variant, index) => (
              <div key={index} className="p-4 border rounded space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Variant {index + 1}</h3>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      -
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      value={variant.productSize}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "productSize",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={variant.productColor}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "productColor",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.productPrice}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "productPrice",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.productStock}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "productStock",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Weight
                    </label>
                    <input
                      type="number"
                      value={variant.productWeight}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "productWeight",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(index, "sku", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleImageUpload(index, e.target.files?.[0])
                      }
                      accept="image/*"
                      className="hidden"
                      id={`image-${index}`}
                      required
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                    >
                      {images[
                        `${productName} - ${variant.productSize} - ${variant.productColor}`
                      ]
                        ? "Change Image"
                        : "Upload Image"}
                    </label>
                    {images[
                      `${productName} - ${variant.productSize} - ${variant.productColor}`
                    ] && (
                      <span className="text-sm text-green-600">
                        Image selected
                      </span>
                    )}
                  </div>
                  {/* Image Preview */}
                  {imagePreview[
                    `${productName} - ${variant.productSize} - ${variant.productColor}`
                  ] && (
                    <div className="mt-2">
                      <Image
                        src={
                          imagePreview[
                            `${productName} - ${variant.productSize} - ${variant.productColor}`
                          ]
                        }
                        alt={`Preview for ${variant.productSize} - ${variant.productColor}`}
                        className="w-32 h-32 object-cover rounded border"
                        width={500}
                        height={200}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
