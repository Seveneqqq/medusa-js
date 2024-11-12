import { createSelectParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

/* Company Validators */
export type AdminGetAccountsParamsType = z.infer<typeof AdminGetAccountsParams>;
export const AdminGetAccountsParams = createSelectParams();

export type AdminCreateAccountsType = z.infer<typeof AdminCreateAccounts>;
export const AdminCreateAccounts = z
  .object({
    email: z.string().optional(),
    approved: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().optional()
  })
  .strict();


