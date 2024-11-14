import { NewVariant } from '../model/product';

export const validateVariant = (variant: NewVariant): string |  null => {
    if (!variant.productColor.trim()) return "Please fill in the product color.";
    if (!variant.productSize.trim()) return "Please fill in the product size.";
    if (!variant.sku.trim()) return "Please fill in the SKU.";
    if (variant.productPrice <= 0) return "Product price must be greater than 0.";
    if (variant.productWeight <= 0) return "Product weight must be greater than 0.";
    if (variant.productStock < 0) return "Product stock cannot be negative.";
    return null;
};