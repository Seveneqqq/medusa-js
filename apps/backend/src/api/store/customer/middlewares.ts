import { MiddlewareRoute } from "@medusajs/medusa";
// import {
//     validateAndTransformBody,
//     validateAndTransformQuery,
// } from "@medusajs/framework/http";
// import {
//     transformQueryConfig,
//     retrieveTransformQueryConfig,
// } from "./query-config";
// import {
//     AdminListAttachmentsParams,
//     AdminGetAttachmentParams,
//     AdminCreateAttachment,
//     AdminDeleteAttachment,
//     AdminUploadAttachmentBody,
// } from "./validators";

export const adminAttachmentsMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/store/customer",
        // middlewares: [
        //     validateAndTransformQuery(
        //         AdminListAttachmentsParams,
        //         transformQueryConfig
        //     ),
        // ],
    },
    {
        method: ["GET"],
        matcher: "/store/:id/add-to-approval",
        // middlewares: [
        //     validateAndTransformQuery(
        //         AdminGetAttachmentParams,
        //         retrieveTransformQueryConfig
        //     ),
        // ],
    },
];