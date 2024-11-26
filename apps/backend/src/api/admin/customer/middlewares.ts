import { MiddlewareRoute } from "@medusajs/medusa";
import {
    validateAndTransformBody,
} from "@medusajs/framework/http";

import {
    AdminActivateCustomersBody,
} from "./validators";

export const adminCustomersMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/admin/customers",
    },
    {
        method: ["POST"],
        matcher: "/admin/customers/:id/activate",
        middlewares: [
            validateAndTransformBody(AdminActivateCustomersBody),
        ],
    },
];