import { z } from "zod";

export const StoreCustomerParams = z.object({
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
});

export const StoreCustomerApprovalBody = z.object({
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
});

export const StoreCustomerSearchParams = z.object({
    email: z.string()
        .email("Invalid email format")
        .optional(),
    approved: z.boolean().optional(),
});

export const addToApprovalValidator = z.object({
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
    customer_id: z.string()
        .min(1, "Customer ID is required")
 });

export type StoreCustomerParamsType = z.infer<typeof StoreCustomerParams>;
export type StoreCustomerApprovalBodyType = z.infer<typeof StoreCustomerApprovalBody>;
export type StoreCustomerSearchParamsType = z.infer<typeof StoreCustomerSearchParams>;