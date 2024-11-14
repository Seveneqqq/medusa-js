import { z } from "zod"

// Dozwolone typy dokumentów jako stała
export const DOCUMENT_TYPES = [
    "instruction",
    "certificate",
    "compliance_card",
    "other"
] as const

// Schema dla body requestu
export const bodySchema = z.object({
    product_id: z.string({
        required_error: "product_id is required",
        invalid_type_error: "product_id must be a string"
    }),
    documents: z.array(
        z.object({
            file_name: z.string(),
            language: z.string(),
            document_type: z.enum(DOCUMENT_TYPES)
        })
    ).nonempty({
        message: "At least one document is required"
    })
})

// Typ wygenerowany ze schematu dla body
export type BodySchema = z.infer<typeof bodySchema>