import { createSelectParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";


export type AdminGetApprovedParamsType = z.infer<typeof AdminGetApprovedParams>;
export const AdminGetApprovedParams = createSelectParams();

export type AdminCreateApprovedType = z.infer<typeof AdminCreateApproved>;
export const AdminCreateApproved = z
  .object({
    user_id: z.string().optional(),
    approved: z.boolean().optional(),
  })
  .strict();


