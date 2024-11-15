import { z } from "zod";

// Walidator dla parametrów GET request
export const StoreProductAttachmentsParams = z.object({
    product_id: z.string({
        required_error: "Product ID is required",
        invalid_type_error: "Product ID must be a string",
    }).nonempty("Product ID cannot be empty"),
});

// Typ dla parametrów
export type StoreProductAttachmentsParamsType = z.infer<typeof StoreProductAttachmentsParams>;