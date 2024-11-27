import { z } from "zod";

// Walidator dla zapytania o klienta
export const StoreCustomerParams = z.object({
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
});

// Walidator dla dodawania do approval
export const StoreCustomerApprovalBody = z.object({
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
});

// Walidator dla parametrów wyszukiwania
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