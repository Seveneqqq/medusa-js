import { MedusaRequest } from "@medusajs/framework";
import { 
    AdminListAttachmentsParamsType, 
    AdminGetAttachmentParamsType 
} from "./validators";

export const listAttachmentsConfig = {
    deserialize(req: MedusaRequest<AdminListAttachmentsParamsType>) {
        const { validatedQuery } = req;
        const { limit, offset } = validatedQuery;

        return {
            skip: offset,
            take: limit,
            include_attachments: true,
        };
    },
    serialize(data) {
        if (!data) {
            return;
        }

        const { attachments, count } = data;

        return {
            attachments,
            count,
            offset: data.skip,
            limit: data.take,
        };
    },
};

export const retrieveAttachmentConfig = {
    deserialize(req: MedusaRequest<AdminGetAttachmentParamsType>) {
        const { validatedQuery } = req;
        return {
            include_attachments: true,
        };
    },
    serialize(data) {
        if (!data) {
            return;
        }

        return {
            attachment: data,
        };
    },
};

export const transformQueryConfig = {
    defaultFields: [
        "id",
        "file_id",
        "file_name",
        "language",
        "document_type",
        "created_at",
        "updated_at",
    ],
    defaultRelations: [],
    allowedFields: [
        "id",
        "file_id",
        "file_name",
        "language",
        "document_type",
        "created_at",
        "updated_at",
    ],
    allowedRelations: [],
    defaultLimit: 10,
    isList: true,
};

export const retrieveTransformQueryConfig = {
    ...transformQueryConfig,
    isList: false,
};