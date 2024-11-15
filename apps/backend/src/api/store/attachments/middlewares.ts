import { MiddlewareRoute } from "@medusajs/medusa";

export const storeAttachmentsMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/store/products/attachments",
    },
    {
        method: ["POST"],
        matcher: "/store/products/attachments/:id/download-file",
    },
];