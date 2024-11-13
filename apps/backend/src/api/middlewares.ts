import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { defineMiddlewares, authenticate } from "@medusajs/medusa";
import { adminMiddlewares } from "./admin/middlewares";
import { storeMiddlewares } from "./store/middlewares";

export default defineMiddlewares({
  routes: [
    ...adminMiddlewares,
    ...storeMiddlewares,
    // Admin routes with authentication
    {
      matcher: "/admin/product-documents/get-all",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/customers/activate",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/customers/get-customers",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/product-documents/get",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/product-documents/upload",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    // {
    //   matcher: "/store/customer/add-to-approval",
    //   middlewares: [
    //     authenticate("user", ["session", "bearer", "api-key"])
    //   ],
    // },
    {
      matcher: "/admin/product-documents/save-file",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/product-documents/delete",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    // Store customer route
    {
      matcher: "/store/customers/me",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          req.allowed = [
            "orders",
            "addresses",
            "employee",
            "employees",
          ];
          next();
        },
      ],
    },
  ],
});