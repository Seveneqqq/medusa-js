import { z } from "zod";

export const AdminListCustomersParams = z.object({
    page: z.number().optional().default(0),
    limit: z.number().optional().default(20),
    fields: z.string().optional(),
});

export const AdminActivateCustomersBody = z.object({
    emails: z.array(
        z.string().email("Invalid email format")
    ).min(1, "At least one email must be provided"),
});

export const AdminCustomerSearchParams = z.object({
    q: z.string().optional(),
    approved: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type AdminListCustomersParamsType = z.infer<typeof AdminListCustomersParams>;
export type AdminActivateCustomersBodyType = z.infer<typeof AdminActivateCustomersBody>;
export type AdminCustomerSearchParamsType = z.infer<typeof AdminCustomerSearchParams>;