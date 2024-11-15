import { MiddlewareRoute } from "@medusajs/medusa";
import {
    validateAndTransformBody,
} from "@medusajs/framework/http";
import {
    StoreCustomerApprovalBody,
} from "./validators";

export const adminAttachmentsMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/store/customer",
    },
    {
        method: ["POST"],
        matcher: "/store/:id/add-to-approval",
        middlewares: [
            validateAndTransformBody(StoreCustomerApprovalBody),
        ],
    },
];