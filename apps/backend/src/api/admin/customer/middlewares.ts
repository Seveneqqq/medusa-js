import { MiddlewareRoute } from "@medusajs/medusa";
import {
    validateAndTransformBody,
    validateAndTransformQuery,
} from "@medusajs/framework/http";

import {
    AdminListCustomersParams,
    AdminActivateCustomersBody,
    AdminCustomerSearchParams,
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