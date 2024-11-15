import { createSelectParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";


export type AdminGetDocumentParamsType = z.infer<typeof AdminGetDocumentParams>;
export const AdminGetDocumentParams = createSelectParams();

export type AdminCreateDocumentType = z.infer<typeof AdminCreateDocument>;
export const AdminCreateDocument = z
  .object({
    user_id: z.string().optional(),
    Document: z.boolean().optional(),
  })
  .strict();


