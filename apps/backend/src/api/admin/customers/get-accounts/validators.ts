import { createSelectParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

/* Company Validators */
export type AdminGetAccountsParamsType = z.infer<typeof AdminGetAccountsParams>;
export const AdminGetAccountsParams = createSelectParams();

export type AdminCreateAccountsType = z.infer<typeof AdminCreateAccounts>;
export const AdminCreateAccounts = z
  .object({
    id: z.string(),
    company_name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    phone: z.number().optional(),
    has_account: z.string().optional(),
    metadata: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    deleted_at: z.date().optional(),
    created_by: z.date().optional(),
    approved: z.any(),
  })
  .strict();


