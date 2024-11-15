import { z } from "zod";

const DOCUMENT_TYPES = [
    "instruction",
    "certificate",
    "compliance_card",
    "other"
] as const;

export const AdminListAttachmentsParams = z.object({
    limit: z.number().default(10),
    offset: z.number().default(0),
    fields: z.string().optional(),
});

export const AdminGetAttachmentParams = z.object({
    id: z.string().optional(),
    fields: z.string().optional(),
});

export const AdminUploadAttachmentBody = z.object({
    files: z.array(z.any()).optional(),
});

export const AdminCreateAttachment = z.object({
    product_id: z.string().optional(),
    attachments: z.array(z.object({
        file_name: z.string().optional(),
        language: z.string().optional(),
        document_type: z.enum(DOCUMENT_TYPES).optional(),
    })),
});

export const AdminDeleteAttachment = z.object({
    id: z.union([z.string(), z.number()]).optional(),
});

export const AdminSaveAttachmentFile = z.object({
    file_name: z.string().optional(),
    language: z.string().optional(),
    document_type: z.enum(DOCUMENT_TYPES).optional(),
});

export type AdminListAttachmentsParamsType = z.infer<typeof AdminListAttachmentsParams>;
export type AdminGetAttachmentParamsType = z.infer<typeof AdminGetAttachmentParams>;
export type AdminUploadAttachmentBodyType = z.infer<typeof AdminUploadAttachmentBody>;
export type AdminCreateAttachmentType = z.infer<typeof AdminCreateAttachment>;
export type AdminDeleteAttachmentType = z.infer<typeof AdminDeleteAttachment>;
export type AdminSaveAttachmentFileType = z.infer<typeof AdminSaveAttachmentFile>;