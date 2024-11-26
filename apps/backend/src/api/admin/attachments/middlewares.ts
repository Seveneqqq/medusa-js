import { MiddlewareRoute } from "@medusajs/medusa";
import {
    validateAndTransformQuery,
} from "@medusajs/framework/http";
import {
    transformQueryConfig,
    retrieveTransformQueryConfig,
} from "./query-config";
import {
    AdminListAttachmentsParams,
    AdminGetAttachmentParams,
} from "./validators";

export const adminAttachmentsMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/admin/attachments",
        middlewares: [
            validateAndTransformQuery(
                AdminListAttachmentsParams,
                transformQueryConfig
            ),
        ],
    },
    {
        method: ["GET"],
        matcher: "/admin/attachments/:id",
        middlewares: [
            validateAndTransformQuery(
                AdminGetAttachmentParams,
                retrieveTransformQueryConfig
            ),
        ],
    },
    {
        method: ["POST"],
        matcher: "/admin/attachments/:id/upload",
    },
    {
        method: ["DELETE"],
        matcher: "/admin/attachments",
    },
    {
        method: ["POST"],
        matcher: "/admin/attachments/:id/save-file",
    },
];